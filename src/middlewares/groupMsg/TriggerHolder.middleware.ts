import { IBotGroupMsgEventContext } from '../../interface/context.interface';
import MiddlewareBase from '../common/middlewareBase';
import { Bot } from '../../lib/Bot';

export class TriggerHolderMid extends MiddlewareBase{
    constructor(){
        super();
    }

    public async proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void> {
        if(ctx.msgText.indexOf('Hiyuki') !== -1){
            await next();
        }
        else{
            ctx.replyText = '';
        }
    }
    public setup(bot: Bot): void { return; }
}