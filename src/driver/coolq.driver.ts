import { IBotDriver } from 'ws-bot-manager/dist/interface/IBotDriver';
import { IBotEvent } from 'ws-bot-manager/dist/interface/IBotEvent';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

export default class CQDriver implements IBotDriver{
    readonly id: string = 'coolq';

    canUse(req: IncomingMessage): boolean{
        console.log(req.headers);
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