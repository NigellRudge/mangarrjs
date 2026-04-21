import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import BaseEntity from "./shared/base";
import { Role } from "@database/entities/shared/enums";
import RefreshToken from "@database/entities/refresh-token";

@Entity()
export default class User extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  username!: string;

  @Column({ type: "varchar", length: 50 })
  password!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({
    type: "simple-enum",
    enum: Role,
    default: Role.user,
  })
  role!: Role;

  @OneToMany(() => RefreshToken, (toke) => toke.user)
  refreshTokens!: RefreshToken[];

  get isAdministrator() {
    return this.role === Role.admin;
  }
}
