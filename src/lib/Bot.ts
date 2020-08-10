import 'reflect-metadata';
import LogicBot from "ws-bot-manager/dist/lib/LogicBot";

import { IBotConfig } from '../interface/bot.interface';
import { IBotModule } from '../interface/module.interface';

import { GroupMsgMidManager, BasicProcMid, LineProcMid, TriggerHolderMid } from '../middlewares/groupMsg';

//目前没有完整的结构，先把模块在这里导入
import TestModule from '../module/testModule';

export class Bot{
    public readonly token: string;

    public readonly defaultTrigger: string;

    private groupMsgManager: GroupMsgMidManager;

    private managerBot: LogicBot;

    private readonly _moduleList: Array<IBotModule> = [];

    //该变量不能在外部写入，只可以读取，必须通过mountModule来添加模块
    get moduleList(){
        return this._moduleList;
    }

    //将LogicBot上的方法代理到Bot上方便访问
    get sendGroupMsg(){
        return this.managerBot.sendGroupMsg.bind(this.managerBot);
    }
    get sendPrivateMsg(){
        return this.managerBot.sendPrivateMsg.bind(this.managerBot);
    }

    constructor(token: string, mBot: LogicBot, conf: IBotConfig){
        this.token = token;

        this.defaultTrigger = conf.trigger;

        this.managerBot = mBot;

        this.groupMsgManager = new GroupMsgMidManager(this);

        this.bindEvent();
        //临时用模块
        this.mountModule(new TestModule());

        this.setMiddleware();
    }

    private setMiddleware(){
        this.mountMiddleware(BasicProcMid);
        this.mountMiddleware(LineProcMid);
        this.mountMiddleware(TriggerHolderMid);
    }

    private bindEvent(){
        let mBot = this.managerBot;
        mBot.groupMsgEmitter.on(this.groupMsgManager.mid.bind(this.groupMsgManager));
    }

    public mountModule(module: IBotModule){
        this.moduleList.push(module);
    }

    public mountMiddleware(Middleware: any){
        let midInstance = new Middleware();
        midInstance.setup(this);
        this.groupMsgManager.use(midInstance.proc.bind(midInstance));
    }
}