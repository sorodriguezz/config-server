import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}