import { IBotDriver } from 'ws-bot-manager/dist/interface/IBotDriver';
import { IBotEvent, IGroupMsgEvent } from 'ws-bot-manager/dist/interface/IBotEvent';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { IBotGroupMessage, IStructMessageItem } from 'ws-bot-manager/dist/interface/IBotMessage';

class EchoCaller extends EventEmitter{
    private static echo: number = 1;

    call(ws: WebSocket, data: any): string{
        let echoId = EchoCaller.echo++,
            eName = `e${echoId}`;
        data.echo = echoId;
        ws.send(JSON.stringify(data));
        return eName;
    }

    check(data: any): void{
        if(data?.echo){
            let eName = `e${data.echo}`;
            this.emit(eName, data);
        }
    }
}

const transCQHttpType: { [T: string]: (item: any) => IStructMessageItem} = {
    'text': (item: any) => { return {
        type: 'text',
        text: item.data.text
    };},
    'image': (item: any) => {return {
        type: 'image',
        url: item.data.file
    };},
    'face': (item: any) => {return {
        type: 'emoji',
        id: item.data.id
    };}
}

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
        throw new Error("Method not implemented.");
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

    async getGroupList(ws: WebSocket): Promise<string[]> {
        return ['938949705'];
    }

    async callAPI(){}
}