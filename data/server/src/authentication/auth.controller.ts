import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async getUsersFrom42(@Req() req) {
    console.log(req.user.accessToken);
    return this.authService.getUsersFrom42(req.user.accessToken);
  }
}
