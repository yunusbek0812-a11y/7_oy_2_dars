import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAT!: Date;

  @UpdateDateColumn()
  updateAT!: Date;
}