import { UserRole } from "src/common/enums/user.role";
import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "src/database/entites/base.entity";
import { Article } from "src/module/articles/entities/article.entity";
import { Tag } from "src/module/tag/entities/tag.entity";

@Entity({ name: "auth" })
export class Auth extends BaseEntity {
  @Column({ nullable: false })
  username!: string;
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true, type: "bigint" })
  otpTime?: number;

  // releataions
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Tag, (tag) => tag.author)
  tags?: Tag[];
}
