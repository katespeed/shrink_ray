import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';
import {
  createNewLink,
  updateLinkVisits,
  getLinkById,
  getLinksByUserId,
  getLinksByUserIdForOwnAccount,
  deleteLinksById,
  linkBelongsToUser,
} from '../models/LinkModel';

async function shortenUrl(req: Request, res: Response): Promise<void> {
  // Make sure the user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
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

async function getOriginalUrl(req: Request, res: Response): Promise<void> {
  // Retrieve the link data using the targetLinkId from the path parameter
  // Check if you got back `null`
  // send the appropriate response
  const { targetLinkId } = req.params as TargetLinkIdParam;
  const link = await getLinkById(targetLinkId);
  if (!link) {
    res.sendStatus(404);
  }
  // Call the appropriate function to increment the number of hits and the last accessed date
  const targetURL = await updateLinkVisits(link);
  // Redirect the client to the original URL
  console.log('Result: ', targetURL.originalUrl);
  console.log(targetURL);
  res.redirect(301, targetURL.originalUrl);
}

async function getLinksForUser(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as TargetUserIdParam;
  const user = await getUserById(targetUserId);
  if (!user) {
    res.sendStatus(404);
  }
  let links;
  if (!req.session.isLoggedIn) {
    links = await getLinksByUserId(targetUserId);
  }
  if (req.session.isLoggedIn || user.isAdmin) {
    links = await getLinksByUserIdForOwnAccount(targetUserId);
  }
  console.log(links);
  res.json(links);
}

async function deleteLinksForUser(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn || authenticatedUser.isAdmin) {
    // || !authenticatedUser.isAdmin) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { linkId } = req.params as LinkIdParam;

  const linkExists = await linkBelongsToUser(linkId, authenticatedUser.userId);
  if (!linkExists) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  await deleteLinksById(linkId);
  res.sendStatus(204); // 204 No Content
}

export { shortenUrl, getOriginalUrl, getLinksForUser, deleteLinksForUser };
