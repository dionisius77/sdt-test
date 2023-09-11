import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class TimeZone extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public value!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public text!: string;

  @ApiProperty({ type: Array<string> })
  @Column({ type: 'text', nullable: false, array: true })
  public utc!: string[];

  @ApiProperty()
  @Column({ type: 'numeric', nullable: false })
  public offset!: number;
}

export { TimeZone };
