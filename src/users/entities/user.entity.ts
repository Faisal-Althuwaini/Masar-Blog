import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { Follow } from '@src/follows/entities/follow.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes?: Like[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[]; // Link back to the posts the user has created

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];
}
