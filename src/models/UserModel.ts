import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUsername(username: string): Promise<User | null> {
  // TODO: Get the user by where the username matches the parameter
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.link', 'link')
    .where('user.username = :username', { username })
    .getOne();
  return user;
}

async function addNewUser(username: string, passwordHash: string): Promise<User | null> {
  // TODO: Add the new user to the database
  let newUser = new User();
  newUser.username = username;
  newUser.passwordHash = passwordHash;
  newUser = await userRepository.save(newUser);
  return newUser;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.link', 'link')
    .where('user.userId = :userId', { userId })
    .getOne();
  return user;
}

async function allUserData(): Promise<User[]> {
  return await userRepository.find();
}

export { getUserByUsername, addNewUser, getUserById, allUserData };
