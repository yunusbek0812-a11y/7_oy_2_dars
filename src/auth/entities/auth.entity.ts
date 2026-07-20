import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ timestamps: true, tableName: "auth" })
export class Auth extends Model {
  @Column({ allowNull: false })
  username!: string;

  @Column({ allowNull: false, unique: true })
  email!: string;

  @Column({ allowNull: false })
  password!: string;

  @Column({ allowNull: true })
  code?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  otpTime?: number;

  @Column({ allowNull: false, defaultValue: false })
  isActive!: boolean;
}