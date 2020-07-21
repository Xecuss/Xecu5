import 'reflect-metadata';
import { GroupMsgMidManager } from '../MidManager/GroupMsgMidManager';
import LogicBot from "ws-bot-manager/dist/lib/LogicBot";

import { BasicProcMid, TriggerHolderMid, LineProcMid } from '../middlewares/groupMsg.middleware';
import { IStructMessageItem } from "ws-bot-manager/dist/interface/IBotMessage";

import { IBotConfig } from '../interface/bot.interface';
import { IBotModule } from '../interface/module.interface';
import { IBotGroupMsgEventContext } from '../interface/context.interface';

//目前没有完整的结构，先把模块在这里导入
import TestModule from '../module/testModule';
import { MethodType } from './decorator';

type messageFunc = (str: string) => IStructMessageItem[];

type lineProcFunc = (ctx: IBotGroupMsgEventContext) => any;

/**
 * 目前还没有完整的结构，所以暂时先把一部分“消息函数”写在这里
 */
const image: messageFunc = (url: string): IStructMessageItem[] => {
    return [{
        type: 'image',
        url
    }]
};
const emoji: messageFunc = (id: string): IStructMessageItem[] => {
    return [{
        type: 'emoji',
        id
    }];
};
const at: messageFunc = (id: string): IStructMessageItem[] => {
    return [{
        type: 'mention',
        id
    }];
};

export class Bot{
    public readonly token: string;

    public readonly defaultTrigger: string;

    private groupMsgManager: GroupMsgMidManager;

    private managerBot: LogicBot;

    private msgFuncMap: {[K: string]: messageFunc };

    public beforeProc: Array<lineProcFunc>;

    public afterProc: Array<lineProcFunc>;

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

        this.msgFuncMap = Object.create(null);

        this.beforeProc = [];
        this.afterProc = [];

        this.bindEvent();

        this.setMiddleware();

        //临时用的消息函数
        this.mountMessageFunction('image', image);
        this.mountMessageFunction('emoji', emoji);
        this.mountMessageFunction('at', at);

        //临时用模块
        this.mountModule(new TestModule());
    }

    private setMiddleware(){
        this.groupMsgManager.use(BasicProcMid);
        this.groupMsgManager.use(LineProcMid);
        this.groupMsgManager.use(TriggerHolderMid);
    }

    public mountMessageFunction(id: string, fn: messageFunc){
        //先检查是否有同id
        let nowFn = this.msgFuncMap[id];
        if(nowFn !== undefined) throw new Error(`模块挂载消息函数错误：${id} 与现有id冲突`);

        this.msgFuncMap[id] = fn;
    }

    public runMessageFunction(id: string, arg: string): IStructMessageItem[]{
        let nowFn = this.msgFuncMap[id];
        if(nowFn === undefined) throw new Error(`调用消息函数错误：${id} 不存在`);

        return nowFn(arg);
    }

    private bindEvent(){
        let mBot = this.managerBot;
        mBot.groupMsgEmitter.on(this.groupMsgManager.mid.bind(this.groupMsgManager));
    }

    public mountModule(module: IBotModule){
        let p = Object.getPrototypeOf(module);
        let keys = Object.getOwnPropertyNames(p);

        for(let k of keys){
            if(typeof p[k] !== 'function' || k === 'constructor') continue;

            let funcType = Reflect.getMetadata('XB:Method', p, k);
                
            switch(funcType){
                case MethodType.BeforeProc: {
                    console.log(`mount: ${k}`);
                    this.beforeProc.push(p[k].bind(module));
                    break;
                }
                case MethodType.AfterProc: {
                    console.log(`mount: ${k}`);
                    this.afterProc.push(p[k].bind(module));
                    break;
                }
                default: {
                    console.log(`${k} 不属于可执行method`);
                }
            }
        }
    }
}