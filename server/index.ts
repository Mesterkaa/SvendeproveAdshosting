import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';

import * as mongoose from 'mongoose';

import {logger} from "./config/logger"
import { MONGODB_URI, PORT } from "./config/secrets";

class Server {


    public app: express.Application;

    constructor() {

        this.app = express();
        this.config();
        this.mongo();
        this.routes();
    }

    private routes(): void{

        this.app.use(express.static(__dirname + "/../app-mesterkaa-dk"))
    }
    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
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
