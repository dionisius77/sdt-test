import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { TimeZone } from './master-data/timezone.entity';
import { ApiProperty } from '@nestjs/swagger';

enum RoleFormat {
  CANDIDATE = 'candidate',
  ADMIN = 'admin',
}

@Entity()
class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;
  
  @ApiProperty()
  @Column({ type: 'text' })
  public firstName!: string;
  
  @ApiProperty()
  @Column({ type: 'text' })
  public lastName!: string;
  
  @ApiProperty()
  @Column({ type: 'text' })
  public email!: string;
  
  @ApiProperty()
  @Column({ type: 'date' })
  public birthday!: string;
  
  @ApiProperty({ type: TimeZone })
  @ManyToOne(() => TimeZone)
  @JoinColumn({
    name: "timezoneId",
    referencedColumnName: "id",
  })
  timezone: TimeZone;
  @Column({ type: "string", nullable: false })
  public timezoneId?: string;
  
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public createdAt: Date | null;
  
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public updatedAt: Date | null;
}

export { User, RoleFormat };
