import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { JwtUser } from 'src/auth/types/jwt.types';
import { DevToolsService } from './dev-tools.service';
import { RunDevToolActionParamsDto } from './dto/run-dev-tool-action.dto';

@UseGuards(JwtAuthGuard)
@Controller('dev-tools')
export class DevToolsController {
  constructor(private readonly devToolsService: DevToolsService) {}

  @Post('actions/:actionId')
  runAction(
    @CurrentUser() user: JwtUser,
    @Param() params: RunDevToolActionParamsDto,
  ) {
    return this.devToolsService.runAction(user.sub, params.actionId);
  }
}
