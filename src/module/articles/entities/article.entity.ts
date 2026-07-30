import { BaseEntity } from "src/database/entites/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Tag } from "src/module/tag/entities/tag.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, OneToMany } from "typeorm";

@Entity({name:"article"})
export class Article extends BaseEntity {
  @Column()
  title:string;

  @Column()
  text: string

  @Column({nullable: true})
  backgroundImage!: string;

  @DeleteDateColumn({nullable:true})
  deletedAt?:Date

    @ManyToMany(()=> Auth, (user) => user.articles)
    @JoinColumn({name:"auth_id"})
    author!: Auth

    @OneToMany(() => Tag, (tag) => tag.articles)
    @JoinColumn({name: "tag_id"})
    tags!:Tag[]
}
