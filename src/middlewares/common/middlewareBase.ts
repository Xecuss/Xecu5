import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { Bot } from "../../lib/Bot";

export default abstract class MiddlewareBase{
    abstract async proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void>;

    abstract setup(bot: Bot): void;
}