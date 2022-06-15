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
import { PublicRoutes } from './routes/publicRoutes';
import { SecureRoutes } from './routes/secureRoutes';
import { AdminRoutes } from './routes/adminRoutes';

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.mongo();
        this.routes();
    }

    private routes(): void{

      this.app.use(express.static(__dirname + "/../spa-ads-web-application"))

      this.app.use("/api", new PublicRoutes().router);
      this.app.use("/api/secure", passport.authenticate('user_access', {session: false}), new SecureRoutes().router);
      this.app.use("/api/admin", passport.authenticate('admin_access', {session: false}), new AdminRoutes().router);

      this.app.get("/api/public", (req, res) => {
        res.send({text: "PUBLIC"});
      })
      this.app.get("/api/secure", passport.authenticate('user_access', {session: false}), (req, res) => {
        res.send({text: "SECURE"});
      })
      this.app.get("/api/admin", passport.authenticate('admin_access', {session: false}), (req, res) => {
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
          scope: AzureConfig.resource.scope,
        };

        const userBearerStrategy = new BearerStrategy(options, (req, token, done) => {
          done(null, {}, token);
        });
        const adminBearerStrategy = new BearerStrategy(options, (req, token, done) => {
          const groups = token.groups;
          if (groups == undefined || !Array.isArray(groups) ||groups.length == 0) return done(null, false);
          const matchingGroups = groups.filter(x => AzureConfig.adminGroups.includes(x));
          console.log("matchingGroups", matchingGroups)
          if (matchingGroups.length == 0) return done(null, false)
          done(null, {}, token);
        });

        this.app.use(passport.initialize());
        passport.use('user_access', userBearerStrategy);
        passport.use('admin_access', adminBearerStrategy);
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
