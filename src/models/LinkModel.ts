import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(userId: string): Promise<Link | null> {
  const link = await linkRepository
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where('link.userId = :userId', { userId })
    .getOne();
  return link;
}

export { getLinkById };
