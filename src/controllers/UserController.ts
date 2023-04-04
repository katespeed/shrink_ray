import { Request, Response } from 'express';
import argon2 from 'argon2';
import { isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import { getUserByUsername, addNewUser, allUserData } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function getAllUser(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  // TODO: Implement the registration code
  // Make sure to check if the user with the given username exists before attempting to add the account
  const { username, password } = req.body as AuthRequest;
  const user = await getUserByUsername(username);
  if (user) {
    res.sendStatus(400); // 404 Not Found
    return;
  }
  // Make sure to hash the password before adding it to the database

  const passwordHash = await argon2.hash(password);
  // Wrap the call to `addNewUser` in a try/catch like in the sample code
  // IMPORTANT: Hash the password
  try {
    const newUser = await addNewUser(username, passwordHash);
    console.log(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);
  const now = new Date();
  // NOTES: We need to convert the date string back into a Date() object
  //        `parseISO()` does the conversion
  const logInTimeout = parseISO(req.session.logInTimeout);
  // NOTES: If the client has a timeout set and it has not expired
  if (logInTimeout && isBefore(now, logInTimeout)) {
    // NOTES: This will create a human friendly duration message
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    // NOTES: Reject their request
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }
  //   console.log('1');
  const { username, password } = req.body as AuthRequest;

  const user = await getUserByUsername(username);
  if (!user) {
    res.sendStatus(404); // 404 Not Found - email doesn't exist
    return;
  }
  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
  }
  //   console.log('3');
  await req.session.clearSession();
  req.session.authenticatedUser = {
    userId: user.userId,
    userName: user.username,
    isPro: user.isPro,
    isAdmin: user.isAdmin,
  };
  req.session.isLoggedIn = true;

  res.redirect('/shrink');
}
export { registerUser, logIn, getAllUser };
