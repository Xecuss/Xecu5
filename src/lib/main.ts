import Manager from 'ws-bot-manager';
import IBotConfig, { Console } from '../interface/config.interface';
import { Bot } from './Bot';
import { IBotInnerEvent } from 'ws-bot-manager/dist/interface/IBotInnerEvent';

export class Application{
    public manager: Manager;

    public logger: Console;

    private port: number;

    private botMap: Map<string, Bot>;

    constructor(config: IBotConfig){
        this.manager = new Manager(config.managerConfig);
        this.logger = config.logger;
        this.port = config.managerConfig.port;
        this.botMap = new Map();
        
        this.bindEvent();
    }

    private connectHandle(e: IBotInnerEvent){
        if(e.type === 'bot-connect'){
            let mBot = this.manager.getBot(e.token);

            if(mBot === undefined){
                this.logger.error(`connectHandle: 连接时无法找到token为 ${e.token} bot！`);
                return;
            }

            let botInstance = new Bot(e.token, mBot, {
                trigger: 'Sucex'
            });

            this.botMap.set(e.token, botInstance);
        }
    }

    private bindEvent(){
        this.manager.on(this.connectHandle.bind(this));
    }

    listen(): void{
        this.logger.log(`在${this.port}开始监听...`);
        this.manager.listen();
    }
}