import { UserRole } from "src/common/enums/user.role";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "src/database/entites/base.entity";

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

  @Column({ nullable: true, type: "bigint"})
  otpTime?: number;
}