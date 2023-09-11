import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventLogs, RoleFormat, TimeZone, User } from '@app/entities';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import {
  CreateUserDto,
  TimeZoneDto,
} from './user.dto';
import { MailService } from '@app/helpers';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @InjectRepository(TimeZone)
  private readonly repositoryTimezone: Repository<TimeZone>;
  @InjectRepository(EventLogs)
  private readonly repositoryEventLogs: Repository<EventLogs>;

  @Inject(MailService)
  private readonly mailService: MailService;
  @Cron("0 */15 * * * *")
  async handleCron() {
    this.logger.log(`Start send email job`)
    const currentDate = new Date();
    const timezones = await this.repositoryTimezone.find();
    const activeTimezones = timezones.filter(item => {
      const now = moment.utc(currentDate).utcOffset(item.offset * 60);
      return now.hour() === 11
    });
    if (activeTimezones.length > 0) {
      const timezoneIds = activeTimezones.map(item => item.id);
      const events = await this.repositoryEventLogs.find({
        where: {
          timezoneId: In(timezoneIds),
          sent: false,
          birthday: LessThanOrEqual(moment(currentDate).format("YYYY-MM-DD"))
        },
        relations: {
          user: true,
          timezone: true,
        },
      });

      if (events.length > 0) {
        try {
          const promises: Promise<string>[] = []
          events.forEach(item => {
            const promise = this.mailService.sendEmail(item.user.email, `Hey, ${item.user.firstName} ${item.user.lastName} it's your birthday`, item.id);
            promises.push(promise);
          })
          const process = await Promise.all(promises);
          const successId = process.filter(item => item !== undefined);
          this.logger.log(`Birthday message sent to: `, successId.join(", "))
          await this.repositoryEventLogs.update({ id: In(successId) }, { sent: true });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  @Cron("0 10 23 31 11 *")
  async handleYearlyCron() {
    try {
      const users = await this.repository.find();
      const newEvents: EventLogs[] = users.map(item => {
        const currentYear = new Date().getFullYear();
        const splittedBirthdate = item.birthday.split("-");
        splittedBirthdate[0] = (currentYear+1).toString();
        const birthday = splittedBirthdate.join("-");
        const event = new EventLogs;
        event.UserId = item.id;
        event.birthday = birthday
        event.timezoneId = item.timezoneId;
        return event;
      });
      await this.repositoryEventLogs.save(newEvents);
      this.logger.log("New events generated");
      console.log(newEvents);
    } catch (error) {

    }
  }

  public register = async (body: CreateUserDto): Promise<void> => {
    const {
      firstName,
      lastName,
      email,
      birthdate,
      timezoneId,
    }: CreateUserDto = body;
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }

    user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.birthday = birthdate;
    user.timezoneId = timezoneId;
    user.email = email;

    const savedUser = await this.repository.save(user);
    const currentYear = new Date().getFullYear();
    const splittedBirthdate = birthdate.split("-");
    splittedBirthdate[0] = currentYear.toString();
    const birthday = splittedBirthdate.join("-");
    await this.repositoryEventLogs.insert({
      user: { id: savedUser.id },
      timezoneId,
      birthday,
    });
  }

  public getUsers = async (): Promise<User[]> => {
    return await this.repository.find({ order: { createdAt: 'DESC' }, relations: { timezone: true } });
  }

  public deleteUser = async (id: string): Promise<void> => {
    try {
      const user = await this.repository.findOne({ where: { id } });
      console.log(user);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      await this.repository.remove(user);
    } catch (error) {
      return error;
    }
  }

  public updateUser = async (id: string, body: CreateUserDto): Promise<void> => {
    const {
      firstName,
      lastName,
      email,
      birthdate,
      timezoneId,
    }: CreateUserDto = body;
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      const currentYear = new Date().getFullYear();
      const splittedBirthdate = birthdate.split("-");
      splittedBirthdate[0] = currentYear.toString();
      const birthday = splittedBirthdate.join("-");

      await this.repository.update(id, {
        firstName, lastName, email, birthday: birthdate, timezoneId
      });
      await this.repositoryEventLogs.update(
        { user: { id }, sent: false },
        { birthday, timezoneId }
      );
    } catch (error) {
      return error;
    }
  }

  public insertTimezone = async (body: TimeZoneDto): Promise<void> => {
    await this.repositoryTimezone.save(body.timezone);
  }

  public getTimezone = async (): Promise<TimeZone[]> => {
    return await this.repositoryTimezone.find({ order: { offset: 'ASC' } });
  }
}
