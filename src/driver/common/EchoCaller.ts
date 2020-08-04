import WebSocket from 'ws';
import { EventEmitter } from 'events';

export default class EchoCaller extends EventEmitter{
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