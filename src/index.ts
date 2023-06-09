import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn, getAllUser } from './controllers/UserController';
import {
  getOriginalUrl,
  shortenUrl,
  getLinksForUser,
  deleteLinksForUser,
} from './controllers/LinkController';

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public', { extensions: ['html'] }));

app.get('/api/users', getAllUser);
app.post('/api/register', registerUser); // Create an Account
app.post('/api/login', logIn); // log in to an Account
app.get('/api/links', shortenUrl); // shortenUrls
app.get('/api/link/:targetLinkId', getOriginalUrl);
app.get('/api/user/:targetUserId/links', getLinksForUser); // Get some Links by UserId
app.post('/api/user/:linkId', deleteLinksForUser); // delete Links by UserId

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`My database is called: ${process.env.DATABASE_NAME}`);
});
