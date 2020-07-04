import { IBotEvent, IGroupMsgEvent } from "ws-bot-manager/dist/interface/IBotEvent";
import BotManager from "ws-bot-manager";

export interface IBotEventBaseContext{
    rawEvent: IBotEvent;
}

export interface IBotGroupMsgEventContext extends IBotEventBaseContext{
    rawEvent: IGroupMsgEvent;
    msg: string;
    reply: string;
    manager: BotManager;
}