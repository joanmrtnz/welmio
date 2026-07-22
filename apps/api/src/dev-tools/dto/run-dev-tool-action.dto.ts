import { IsIn } from 'class-validator';
import { DEV_TOOL_ACTION_IDS } from '../types/dev-tool-action.types';
import type { DevToolActionId } from '../types/dev-tool-action.types';

export class RunDevToolActionParamsDto {
  @IsIn(DEV_TOOL_ACTION_IDS)
  actionId: DevToolActionId;
}
