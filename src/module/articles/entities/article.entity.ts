import { BaseEntity } from "src/database/entites/base.entity";
import { ArticleImage } from "src/module/article-images/entities/article-image.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Tag } from "src/module/tag/entities/tag.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity({ name: "article" })
export class Article extends BaseEntity {
  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  backgroundImage!: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Auth, (user) => user.articles)
  @JoinColumn({ name: "author_id" })
  author: Auth;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: "tag_articles",
  })
  tags: Tag[];
  articleImages: any;

  @OneToMany(() => ArticleImage, (articleImage) => articleImage.article,{nullable:true})
  articleImage?: ArticleImage[];
}
