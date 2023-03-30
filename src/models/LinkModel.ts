import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';
import { User } from '../entities/User';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(userId: string): Promise<Link | null> {
  const link = await linkRepository
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where('link.userId = :userId', { userId })
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

export { getLinkById, createNewLink };
