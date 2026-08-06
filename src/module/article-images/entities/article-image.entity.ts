import { BaseEntity } from "src/database/entites/base.entity";
import { Article } from "src/module/articles/entities/article.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"article_image"})
export class ArticleImage extends BaseEntity{
  // @PrimaryGeneratedColumn()
  // id!: number;

  // @Column()
  // articleId!: number;

  @Column()
  sortOrder!: number;

  @Column()
  url!: string

  @ManyToOne(() => Article, (article) => article.articleImages, {cascade: true})
  @JoinColumn({name:"article_id"})
  article!: Article;
}
