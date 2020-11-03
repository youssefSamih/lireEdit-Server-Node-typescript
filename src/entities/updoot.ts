import { Column, Entity, BaseEntity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './post';
import { User } from './user';

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: 'int' })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: 'CASCADE'
  })
  post: Post;
}
