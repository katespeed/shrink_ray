import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn, getAllUser } from './controllers/UserController';
import { shortenUrl } from './controllers/LinkController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.get('/api/users', getAllUser);
app.post('/api/users', registerUser); // Create an Account
app.post('/api/login', logIn); // log in to an Account
app.get('/api/link', shortenUrl); // shortenUrl

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`My database is called: ${process.env.DATABASE_NAME}`);
});
