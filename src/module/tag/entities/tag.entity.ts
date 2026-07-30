import { Article } from "src/module/articles/entities/article.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { BaseEntity } from "src/database/entites/base.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";

@Entity({ name: "tag" })
export class Tag extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => Auth, (author) => author.tags)
  @JoinColumn({ name: "author_id" })
  author: Auth;

  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable({ name: "tag_articles" })
  articles: Article[];
}