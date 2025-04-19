import express from 'express';
import Users from './module/User/routes';
import Accounts from './module/Account/routes';
import Cards from './module/Card/routes';

const app = express();

app.use(express.json());

app.use('/', Users);
app.use('/accounts', Accounts);
app.use('/', Cards);

export { app };
