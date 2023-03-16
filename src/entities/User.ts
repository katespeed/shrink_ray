import { Entity, PrimaryGeneratedColumn, Relation, OneToMany, Column } from 'typeorm';
import { Link } from './Link';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  isPro: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Link, (link) => link.user)
  link: Relation<Link>[];
}
