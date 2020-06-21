import { IBotDriver } from 'ws-bot-manager/dist/interface/IBotDriver';
import { IBotEvent } from 'ws-bot-manager/dist/interface/IBotEvent';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

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

export default class CQDriver implements IBotDriver{
    public readonly id: string = 'coolq';

    private caller = new EchoCaller();

    canUse(req: IncomingMessage): boolean{
        let ua = req.headers['user-agent'];

        if(ua === undefined) return false;

        if(ua.indexOf('CQHttp') !== -1) return true;

        return false;
    }

    checkResponse(data: any): boolean {
        throw new Error("Method not implemented.");
    }

    procResponse(data: any) {
        throw new Error("Method not implemented.");
    }

    procEvent(data: any, botId: number): Promise<IBotEvent> {
        throw new Error("Method not implemented.");
    }

    getGroupList(ws: WebSocket): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    async callAPI(){}
}