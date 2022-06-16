import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as passport from 'passport';
import { BearerStrategy, IBearerStrategyOptionWithRequest } from 'passport-azure-ad'


import * as mongoose from 'mongoose';

import { azure, mongodb_uri, port } from './config/config.json'
import {logger} from "./config/logger"
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
  }
  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(morgan('common'));

    const options: IBearerStrategyOptionWithRequest = {
      identityMetadata: `https://${azure.metadata.authority}/${azure.credentials.tenantID}/${azure.metadata.version}/${azure.metadata.discovery}`,
      issuer: `https://${azure.metadata.authority}/${azure.credentials.tenantID}/${azure.metadata.version}`,
      clientID: azure.credentials.clientID,
      audience: azure.credentials.audience,
      validateIssuer: azure.settings.validateIssuer,
      passReqToCallback: azure.settings.passReqToCallback,
      loggingLevel: azure.settings.loggingLevel as "error" | "info" | "warn" | undefined,
      scope: azure.resource.scope,
    };

    const userBearerStrategy = new BearerStrategy(options, (req, token, done) => {
      done(null, {}, token);
    });
    const adminBearerStrategy = new BearerStrategy(options, (req, token, done) => {
      const groups = token.groups;
      if (groups == undefined || !Array.isArray(groups) ||groups.length == 0) return done(null, false);
      const matchingGroups = groups.filter(x => azure.adminGroups.includes(x));
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
              mongoose.connect(mongodb_uri, {
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

          await mongoose.connect(mongodb_uri, {
              keepAlive: true
          });
      };
      run().catch(error => logger.error(error));
  }
  public start(): void {
      const httpServer = http.createServer(this.app);

      httpServer.listen(port, 'localhost', () => {
          logger.log('info', 'HTTP Server running on port localhost:' + port);

      });
  }
}

const server = new Server();
server.start();
