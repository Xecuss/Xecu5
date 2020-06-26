import Manager from 'ws-bot-manager';
import IBotConfig, { Console } from '../interface/config.interface';

import GroupMsgHandler from '../EventHandler/groupMsg.handler';

export default class Listener{
    public manager: Manager;

    public logger: Console;

    private port: number;

    constructor(config: IBotConfig){
        this.manager = new Manager(config.managerConfig);
        this.logger = config.logger;
        this.port = config.managerConfig.port;
        this.manager.groupMsgEmitter.on(GroupMsgHandler.bind(this));
    }

    listen(): void{
        this.logger.log(`在${this.port}开始监听...`);
        this.manager.listen();
    }
}