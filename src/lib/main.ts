import Manager from 'ws-bot-manager';
import IBotConfig, { Console } from '../interface/config.interface';

export default class Listener{
    private manager: Manager;

    private logger: Console;

    private port: number;

    constructor(config: IBotConfig){
        this.manager = new Manager(config.managerConfig);
        this.logger = config.logger;
        this.port = config.managerConfig.port;
    }

    listen(): void{
        this.logger.log(`在${this.port}开始监听...`);
        this.manager.listen();
    }
}