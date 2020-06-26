import { IBotDriver } from 'ws-bot-manager/dist/interface/IBotDriver';
import { IBotEvent, IGroupMsgEvent } from 'ws-bot-manager/dist/interface/IBotEvent';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import EchoCaller from './lib/EchoCaller';
import transCQHttpType from './lib/CQHttp2StructMessage';
import { IStructMessageItem } from 'ws-bot-manager/dist/interface/IBotMessage';

export default class CQDriver implements IBotDriver{
    public readonly id: string = 'cqhttp';

    private caller = new EchoCaller();

    canUse(req: IncomingMessage): boolean{
        let ua = req.headers['user-agent'];

        if(ua === undefined) return false;

        if(ua.indexOf('CQHttp') !== -1) return true;

        return false;
    }

    checkResponse(data: any): boolean {
        if(data.echo !== undefined) return true;
        return false;
    }

    procResponse(data: any) {
        this.caller.check(data);
    }

    async procEvent(data: any, botId: number): Promise<IBotEvent | null> {
        if(data.post_type === 'meta_event' && data.meta_event_type === 'heartbeat'){
            return null;
        }
        else if(data.post_type === 'message' && data.message_type === 'group'){
            return this.procGroupMsg(data, botId);
        }
        return null;
    }

    procGroupMsg(data: any, botId: number): IBotEvent{
        let msg = data.message;
        let result: IGroupMsgEvent = {
            type: 'group-message',
            botId,
            token: '',
            data: {
                group_id: data.group_id.toString(),
                type: 'message',
                sender: {
                    user_id: data.sender.user_id.toString(),
                    user_name: data.sender.card || data.sender.nickname,
                    role: data.sender.role || 'normal'
                },
                message_id: data.message_id.toString(),
                message: this.transCQHttpMsg(msg)
            }
        };
        return result;
    }

    transCQHttpMsg(msg: any): Array<IStructMessageItem>{
        let res: Array<IStructMessageItem> = [];
        if(typeof msg === 'string'){
            //to do
        }
        else{
            for(let item of msg){
                let transFunc = transCQHttpType[item.type];
                if(transFunc !== undefined){
                    res.push(transFunc(item));
                }
            }
        }
        return res;
    }

    public async getGroupList(ws: WebSocket): Promise<string[]> {
        let rawRes = await this.callAPI(ws, {
            "action":"get_group_list"
        });
        let res: Array<string> = [];
        if(rawRes.retcode === 0){
            res = rawRes.data.map((group_list: any) => group_list.group_id.toString());
        }
        return res;
    }

    public callAPI(ws: WebSocket, args: any): Promise<any>{
        const eventId = this.caller.call(ws, args);
        return new Promise((res) => {
            this.caller.once(eventId, res);
        });
    }
}