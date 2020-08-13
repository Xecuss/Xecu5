import MiddlewareBase from "../common/middlewareBase";
import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { Bot } from "../../lib/Bot";

/**
 * 触发中间件
 */
export class TwoWordsMid extends MiddlewareBase{
    async proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void> {
        await next();
    }
    setup(bot: Bot): void { return; }
}