import Manager from 'ws-bot-manager';
import IBotConfig, { Console } from '../interface/config.interface';

import { GroupMsgMidManager } from '../MidManager/GroupMsgMidManager';

import { TransMsgToStringMid, TriggerHolderMid } from '../middlewares/groupMsg.handler';

export class Application{
    public manager: Manager;

    public logger: Console;

    private port: number;

    private groupMsgManager: GroupMsgMidManager;

    constructor(config: IBotConfig){
        this.manager = new Manager(config.managerConfig);
        this.logger = config.logger;
        this.port = config.managerConfig.port;

        this.groupMsgManager = new GroupMsgMidManager(this.manager);
        
        this.bindEvent();

        this.setMiddleware();
    }

    private bindEvent(){
        this.manager.groupMsgEmitter.on(this.groupMsgManager.mid.bind(this.groupMsgManager));
    }

    private setMiddleware(){
        this.groupMsgManager.use(TransMsgToStringMid);
        this.groupMsgManager.use(TriggerHolderMid);
    }

    listen(): void{
        this.logger.log(`在${this.port}开始监听...`);
        this.manager.listen();
    }
}