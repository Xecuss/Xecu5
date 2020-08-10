import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { IStructMessageItem } from "ws-bot-manager/dist/interface/IBotMessage";
import MiddlewareBase from "../common/middlewareBase";
import { Bot } from "../../lib/Bot";

interface FuncList{
    name: string;
    arg: string;
    raw: string;
}

const funcReg = /\[\$(.+?)\((.*?)\)\$\]/g;

export type messageFunc = (str: string) => IStructMessageItem[];

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

export class BasicProcMid extends MiddlewareBase{

    private msgFuncMap: {[K: string]: messageFunc };

    constructor(){
        super();

        this.msgFuncMap = Object.create(null);
    }
    
    private transStructMsg(msg: IStructMessageItem[]): string{
        let res: string = '';
        for(let item of msg){
            if(item.type === 'text') res += item.text;
            else if(item.type === 'image') res += `[$image(${item.url})$]`;
            else if(item.type === 'emoji') res += `[$emoji(${item.id})$]`;
            else if(item.type === 'mention') res += `[$at(${item.id})$]`;
        }
        return res;
    }

    private transReply(ctx: IBotGroupMsgEventContext): IStructMessageItem[]{
        let msg: string = ctx.replyText;
        let res: IStructMessageItem[] = [];
        let funcList: FuncList[] = [];
        let leftMsg = msg.replace(funcReg, (raw: string, $1: string, $2: string): string => {
            funcList.push({
                name: $1,
                arg: $2,
                raw
            });
            return '[$]';
        });
        let textNode = leftMsg.split('[$]');
        let callIdx = 0;
        for(let item of textNode){
            res.push({
                type: 'text',
                text: item
            });
            let callItem = funcList[callIdx];
            if(callItem !== undefined){
                try{
                    let callRes = this.runMessageFunction(callItem.name, callItem.arg);
                    res.push(...callRes);
                }
                catch(e){
                    res.push({
                        type: 'text',
                        text: callItem.raw
                    });
                }
                callIdx++;
            }
        }
        return res;
    }

    async proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void>{
        let e = ctx.rawEvent;
        let data = e.data;
        let msg = data.message;
        
        ctx.msgText = this.transStructMsg(msg);
        ctx.replyText += '1 - BasicProc中间件将结构化消息变成纯文本\n';

        await next();

        if(ctx.replyText === '') return;

        ctx.replyText += '1 - BasicProc中间件发送replyText的内容';
        await ctx.bot.sendGroupMsg(ctx.rawEvent.data.group_id, this.transReply(ctx));
    }

    public runMessageFunction(id: string, arg: string): IStructMessageItem[]{
        let nowFn = this.msgFuncMap[id];
        if(nowFn === undefined) throw new Error(`调用消息函数错误：${id} 不存在`);

        return nowFn(arg);
    }

    private mountMessageFunction(id: string, fn: messageFunc){
        //先检查是否有同id
        let nowFn = this.msgFuncMap[id];
        if(nowFn !== undefined) throw new Error(`模块挂载消息函数错误：${id} 与现有id冲突`);

        this.msgFuncMap[id] = fn;
    }

    setup(bot: Bot): void{
        //临时用的消息函数
        this.mountMessageFunction('image', image);
        this.mountMessageFunction('emoji', emoji);
        this.mountMessageFunction('at', at);
    }
}