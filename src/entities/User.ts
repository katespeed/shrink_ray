import { Entity, PrimaryGeneratedColumn, Relation, OneToMany, Column } from 'typeorm';
import { Link } from './Link';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: true })
  isPro: boolean;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Link, (link) => link.user)
  link: Relation<Link>[];
}
