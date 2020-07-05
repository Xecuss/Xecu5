import { IBotGroupMsgEventContext } from '../interface/context.interface';
import { MiddleWare } from "../lib/Midnight";
import { IStructMessageItem } from 'ws-bot-manager/dist/interface/IBotMessage';

export let BasicProcMid: MiddleWare<IBotGroupMsgEventContext>;

export let TriggerHolderMid: MiddleWare<IBotGroupMsgEventContext>;

export let ExampleMid: MiddleWare<IBotGroupMsgEventContext>;

function transStructMsg(msg: IStructMessageItem[]): string{
    let res: string = '';
    for(let item of msg){
        if(item.type === 'text') res += item.text;
        else if(item.type === 'image') res += `[$image(${item.url})$]`;
        else if(item.type === 'emoji') res += `[$emoji(${item.id})$]`;
    }
    return res;
}

const funcReg = /\[\$(.+?)\((.*?)\)\$\]/g;

interface FuncList{
    name: string;
    arg: string;
    raw: string;
}

function transReply(ctx: IBotGroupMsgEventContext): IStructMessageItem[]{
    let msg: string = ctx.replyText;
    let bot = ctx.bot;
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
                let callRes = bot.runMessageFunction(callItem.name, callItem.arg);
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

BasicProcMid = async (ctx: IBotGroupMsgEventContext, next) => {
    let e = ctx.rawEvent;
    let data = e.data;
    let msg = data.message;
    
    ctx.msgText = transStructMsg(msg);
    ctx.replyText += '1 - BasicProc中间件将结构化消息变成纯文本\n';

    next();

    if(ctx.replyText === '') return;

    ctx.replyText += '1 - BasicProc中间件发送replyText的内容';
    await ctx.bot.sendGroupMsg(ctx.rawEvent.data.group_id, transReply(ctx));
}

TriggerHolderMid = async (ctx: IBotGroupMsgEventContext, next) => {
    if(ctx.msgText.indexOf('Sucex') !== -1){
        ctx.replyText += `2 - TriggerHolder中间件控制是否触发\n`;
        await next();
    }
    else{
        ctx.replyText = '';
    }
}

ExampleMid = async (ctx: IBotGroupMsgEventContext, next) => {
    ctx.replyText += '3 - 示例中间件仅当触发时调用\n';
    ctx.replyText += `消息文本：${ctx.msgText}\n`;

    await next();
}