import { IBotEvent, IGroupMsgEvent } from "ws-bot-manager/dist/interface/IBotEvent";
import { Bot } from "../lib/Bot";

export interface IBotEventBaseContext{
    rawEvent: IBotEvent;
}

export interface IBotGroupMsgEventContext extends IBotEventBaseContext{
    rawEvent: IGroupMsgEvent;
    msgText: string;
    replyText: string;
    bot: Bot;
}