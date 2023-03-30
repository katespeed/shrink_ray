import { Request, Response } from 'express';
import { createNewLink } from '../models/LinkModel';
import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';

async function shortenUrl(req: Request, res: Response): Promise<void> {
  // Make sure the user is logged in
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  // Get the userId from `req.session`
  const { userId } = req.session.authenticatedUser;
  // Retrieve the user's account data using their ID
  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);
  // Check if you got back `null`
  if (!user) {
    res.sendStatus(404);
    return;
  }
  // Check if the user is neither a "pro" nor an "admin" account
  // check how many links they've already generated
  // if they have generated 5 links
  // send the appropriate response
  if (!user.isAdmin || !user.isPro) {
    const numOfLink = user.link.length;
    if (numOfLink > 5) {
      res.sendStatus(403);
    }
  }
  // Generate a `linkId`
  // Add the new link to the database (wrap this in try/catch)
  // Respond with status 201 if the insert was successful
  const { originalUrl } = req.body as RequestUrl;
  try {
    const newLink = await createNewLink(originalUrl, userId, user);
    console.log(newLink);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { shortenUrl };
