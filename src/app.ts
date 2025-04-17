import express from 'express';
import Users from './module/User/routes';

const app = express();

app.use(express.json());

app.use('/', Users);

export { app } ;
