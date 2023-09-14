import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Req, Res } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // req.session.views = (req.session.views || 0) + 1
    // Write response
    // res.end(req.session.views + ' views')
    
    return this.appService.getHello();
  }
}
