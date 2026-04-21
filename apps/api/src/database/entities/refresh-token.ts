import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "@database/entities/user";

@Entity("refresh_token")
export default class RefreshToken {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "varchar", unique: true })
  token!: string;

  @Column({ type: "boolean", nullable: true, default: false })
  revoked!: boolean;

  @Column({ type: "datetime" })
  expiresAt!: Date;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
