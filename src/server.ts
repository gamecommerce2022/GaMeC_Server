import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import { ProductRoute } from './domain_product/route';
import { UserRoute } from './domain_user/route';

const router = express();

/** Connect with Mongo DB */
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
 .then(() => {
  Logging.info('Connect to Mongo Database');
  startServer();
 })
 .catch((err) => {
  Logging.error('Unable to connect Mongo Database');
  Logging.error(err);
 });

/** Only start the server if Mongo Connects */
const startServer = () => {
 router.use((req, res, next) => {
  /** Log the req */
  Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
   /** Log the res */
   Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
  });

  next();
 });

 router.use(express.urlencoded({ extended: true }));
 router.use(express.json());

 router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
   res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
   return res.status(200).json({});
  }
  next();
 });

 /** Routes */
 router.use('/products', ProductRoute.default);
 router.use('/users', UserRoute.default);

 /** Health Check */
 router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

 /** Error Handling */
 router.use((req, res, next) => {
  const error = new Error('not found');
  Logging.error(error);

  return res.status(404).json({ message: error.message });
 });

 http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
