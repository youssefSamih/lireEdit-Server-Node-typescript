import { ObjectType, Field } from "type-graphql";
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { User } from "./user";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  
  @Field()
  @Column()
  title!: string;
  @Field(() => String)

  @Field()
  @Column()
  text!: string;
  @Field(() => String)

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field()
  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
