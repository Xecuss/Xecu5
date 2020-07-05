import { IBotGroupMsgEventContext } from '../interface/context.interface';
import { MidNight } from '../lib/Midnight';
import { IGroupMsgEvent } from 'ws-bot-manager/dist/interface/IBotEvent';
import { Bot } from '../lib/Bot';

export class GroupMsgMidManager extends MidNight<IGroupMsgEvent, IBotGroupMsgEventContext>{

    private bot: Bot;
    constructor(b: Bot){
        super();
        this.bot = b;
    }

    transEventToContext(e: IGroupMsgEvent): IBotGroupMsgEventContext {
        return {
            rawEvent: e,
            msgText: '',
            replyText: '',
            bot: this.bot
        }
    }
} 