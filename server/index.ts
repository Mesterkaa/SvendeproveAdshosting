import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as passport from 'passport';
import { BearerStrategy, IBearerStrategyOptionWithRequest } from 'passport-azure-ad'


import * as mongoose from 'mongoose';

import * as AzureConfig from './config/azureConfig.json'
import {logger} from "./config/logger"
import { MONGODB_URI, PORT } from "./config/secrets";

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        //this.mongo();
        this.routes();
    }

    private routes(): void{

        this.app.use(express.static(__dirname + "/../spa-ads-web-application"))
        this.app.get("/api/public", (req, res) => {
          res.send({text: "PUBLIC"});
        })
        this.app.get("/api/secure", passport.authenticate('oauth-bearer', {session: false, scope: "access_as_user"}), (req, res) => {
          res.send({text: "SECURE"});
        })
        this.app.get("/api/admin", passport.authenticate('oauth-bearer', {session: false, scope: "access_as_admin"}), (req, res) => {
          res.send({text: "ADMIN"});
        })
    }
    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(morgan('dev'));

        const options: IBearerStrategyOptionWithRequest = {
          identityMetadata: `https://${AzureConfig.metadata.authority}/${AzureConfig.credentials.tenantID}/${AzureConfig.metadata.version}/${AzureConfig.metadata.discovery}`,
          issuer: `https://${AzureConfig.metadata.authority}/${AzureConfig.credentials.tenantID}/${AzureConfig.metadata.version}`,
          clientID: AzureConfig.credentials.clientID,
          audience: AzureConfig.credentials.audience,
          validateIssuer: AzureConfig.settings.validateIssuer,
          passReqToCallback: AzureConfig.settings.passReqToCallback,
          loggingLevel: AzureConfig.settings.loggingLevel as "error" | "info" | "warn" | undefined,
          scope: AzureConfig.resource.scope
        };
        const bearerStrategy = new BearerStrategy(options, (token, done: any) => {
          // Send user info using the second argument
          done(null, token);
        });
        this.app.use(passport.initialize());
        passport.use(bearerStrategy);
    }
    private mongo(): void {
        const connection = mongoose.connection;
        connection.on("connected", () => {
            logger.info("Mongo Connection Established");
        });
        connection.on("reconnected", () => {
            logger.info("Mongo Connection Reestablished");
        });
        connection.on("disconnected", () => {
            logger.warn("Mongo Connection Disconnected");
            logger.warn("Trying to reconnect to Mongo ...");
            setTimeout(()=> {
                mongoose.connect((MONGODB_URI as string), {
                    keepAlive: true,
                    socketTimeoutMS: 3000, connectTimeoutMS: 3000
                });
            }, 3000)
        });
        connection.on("close", () => {
            logger.info("Mongo Connection Closed");
        });
        connection.on("error", (error: Error) => {
            logger.error("Mongo Connection ERROR: " + error)
        });

        const run = async () => {

            await mongoose.connect((MONGODB_URI as string), {
                keepAlive: true
            });
        };
        run().catch(error => logger.error(error));
    }
    public start(): void {
        const httpServer = http.createServer(this.app);

        httpServer.listen(PORT, 'localhost', () => {
            logger.log('info', 'HTTP Server running on port localhost:' + PORT.toString());

        });
    }
}

const server = new Server();
server.start();
