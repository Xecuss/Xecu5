import { IBotDriver } from "ws-bot-manager/dist/interface/IBotDriver";
import { IncomingMessage } from "http";
import WebSocket from 'ws';
import EchoCaller from "../common/EchoCaller";
import { IGroupMsgEvent, IBotEvent } from "ws-bot-manager/dist/interface/IBotEvent";
import { IStructMessageItem, ISendMessageResponse } from "ws-bot-manager/dist/interface/IBotMessage";


export default class DiscordDriver implements IBotDriver{
    public readonly id: string = 'discord-ws-client';

    private caller = new EchoCaller();

    canUse(req: IncomingMessage): Boolean {
        let ua = req.headers['user-agent'];

        if(ua === undefined) return false;

        if(ua.indexOf('discordWSC') !== -1) return true;

        return false;
    }
    public callAPI(ws: WebSocket, args: any): Promise<any>{
        const eventId = this.caller.call(ws, args);
        return new Promise((res) => {
            this.caller.once(eventId, res);
        });
    }

    checkResponse(data: any): boolean {
        if(data.echo !== undefined) return true;
        return false;
    }

    procResponse(data: any) {
        this.caller.check(data);
    }

    async procEvent(data: any, botId: number): Promise<IBotEvent | null> {
        if(data.type === 'heart_beat'){
            return null;
        }
        else if(data.type === 'channel-msg'){
            return this.procGroupMsg(data, botId);
        }
        return null;
    }

    procGroupMsg(data: any, botId: number): IBotEvent{
        let msg = data.data;
        let result: IGroupMsgEvent = {
            type: 'group-message',
            botId,
            token: '',
            data: {
                group_id: msg.channel.id,
                type: 'message',
                sender: {
                    user_id: msg.sender.id.toString(),
                    user_name: msg.sender.username,
                    role: 'normal'
                },
                message_id: msg.reference?.messageID.toString(),
                message: [{
                    type: 'text',
                    text: msg.content
                }]
            }
        };
        return result;
    }

    public async getGroupList(ws: WebSocket): Promise<string[]> {
        let rawRes = await this.callAPI(ws, {
            action: "get-channels"
        });
        let res: Array<string> = [];
        if(rawRes.retcode === 0){
            //console.log(rawRes.data);
            res = rawRes.data.map((group_list: any) => group_list.id.toString());
        }
        return res;
    }

    public async sendGroupMsg(ws: WebSocket, target: string, msg: IStructMessageItem[]): Promise<ISendMessageResponse> {
        let rawMsg: string = '';
        for(let item of msg){
            if(item.type === 'text') rawMsg += item.text;
        }
        let rawRes = await this.callAPI(ws, {
            action: 'send-channel-msg',
            params: {
                msg: rawMsg,
                channelId: target
            }
        });
        if(rawRes.retcode === 0){
            return {
                success: true
            }
        }
        return { success: false };
    }
    
    sendPrivateMsg(ws: import("ws"), target: string, msg: import("ws-bot-manager/dist/interface/IBotMessage").IStructMessageItem[]): Promise<import("ws-bot-manager/dist/interface/IBotMessage").ISendMessageResponse> {
        throw new Error("Method not implemented.");
    }
    
}