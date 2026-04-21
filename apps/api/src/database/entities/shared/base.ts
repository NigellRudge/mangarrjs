import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RecordStatus } from "./enums";

@Entity()
export default abstract class BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    type: "simple-enum",
    enum: RecordStatus,
    default: RecordStatus.active,
  })
  status!: RecordStatus;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
