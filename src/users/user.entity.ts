import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default:true })
  admin: boolean;

  @OneToMany(()=>Report, (report)=>report.user)
  report:Report[]
}
