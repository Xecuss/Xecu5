import { IBotGroupMsgEventContext } from '../interface/context.interface';
import { MidNight } from '../lib/Midnight';
import BotManager from "ws-bot-manager";
import { IGroupMsgEvent } from 'ws-bot-manager/dist/interface/IBotEvent';

export class GroupMsgMidManager extends MidNight<IGroupMsgEvent, IBotGroupMsgEventContext>{

    private manager: BotManager;
    constructor(m: BotManager){
        super();
        this.manager = m;
    }

    transEventToContext(e: IGroupMsgEvent): IBotGroupMsgEventContext {
        return {
            rawEvent: e,
            msg: '',
            reply: '',
            manager: this.manager
        }
    }
}