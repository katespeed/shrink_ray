import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';
import { User } from '../entities/User';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link | null> {
  const link = await linkRepository
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where('link.linkId = :linkId', { linkId })
    .getOne();
  return link;
}

function createLinkId(originalUrl: string, userId: string): string {
  const md5 = createHash('md5');
  md5.update(
    originalUrl.concat(userId.toString())
  ); /* TODO: concatenate the original url and userId */
  const urlHash = md5.digest('base64url');
  const linkId = urlHash.slice(0, 9); /* TODO: Get only the first 9 characters of `urlHash` */
  return linkId;
}

async function createNewLink(originalUrl: string, linkId: string, creator: User): Promise<Link> {
  // TODO: Implement me!
  let newLink = new Link();
  newLink.linkId = createLinkId(originalUrl, creator.userId);
  newLink.originalUrl = originalUrl;
  newLink.lastAccessedOn = new Date();
  newLink.user = creator;
  newLink = await linkRepository.save(newLink);
  return newLink;
}

async function updateLinkVisits(link: Link): Promise<Link> {
  // Increment the link's number of hits propertys
  let updatedLink = link;
  updatedLink.numHits += 1;
  // Create a new date object and assign it to the link's `lastAccessedOn` property.
  const now = new Date();
  updatedLink.lastAccessedOn = now;
  // Update the link's numHits and lastAccessedOn in the database
  updatedLink = await linkRepository.save(updatedLink);
  return updatedLink;
}

export { getLinkById, createNewLink, updateLinkVisits };
