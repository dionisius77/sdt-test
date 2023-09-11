import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import {
  CreateUserDto,
  RegisterRespDto,
  TimeZoneDto,
} from './user.dto';
import { TransformInterceptor } from '@app/interceptors';
import { UserService } from './user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { TimeZone, User } from '@app/entities';

@UseInterceptors(TransformInterceptor)
@Controller('/')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;
  @UseInterceptors(ClassSerializerInterceptor)

  @Post('user')
  private async createUser(@Body() body: CreateUserDto): Promise<void> {
    await this.service.register(body);
  }

  @ApiOkResponse({ type: [User] })
  @Get('user')
  private async getUser(): Promise<User[]> {
    return await this.service.getUsers();
  }

  @Put('user/:id')
  private async updateUser(@Body() body: CreateUserDto, @Param("id") id: string): Promise<void> {
    await this.service.updateUser(id, body);
  }

  @Delete('user/:id')
  private async deleteUser(@Param("id") id: string): Promise<void> {
    await this.service.deleteUser(id);
  }

  @Post('timezone')
  private async insertTimeZone(@Body() body: TimeZoneDto): Promise<void | never> {
    await this.service.insertTimezone(body);
  }

  @ApiOkResponse({ type: [TimeZone] })
  @Get('timezone')
  private async getTimezone(): Promise<TimeZone[]> {
    return await this.service.getTimezone();
  }
}
