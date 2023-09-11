import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeZone } from './master-data/timezone.entity';
import { User } from './user.entity';


@Entity()
class EventLogs extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ type: 'date' })
  public birthday!: string;

  @ManyToOne(() => TimeZone)
  @JoinColumn({
    name: "timezoneId",
    referencedColumnName: "id",
  })
  timezone: TimeZone;
  @Column({ type: "string", nullable: false })
  public timezoneId?: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "UserId",
    referencedColumnName: "id",
  })
  user: User;
  @Column({ type: "string", nullable: false })
  public UserId?: string;

  @Column({ type: 'boolean', default: false })
  public sent!: boolean;

  @Column({ type: 'timestamp', nullable: true, default: new Date() })
  public createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public updatedAt: Date | null;
}

export { EventLogs };
