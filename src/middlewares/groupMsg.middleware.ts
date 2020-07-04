import { IBotGroupMsgEventContext } from '../interface/context.interface';
import { MiddleWare } from "../lib/Midnight";

export let BasicProcMid: MiddleWare<IBotGroupMsgEventContext>;

export let TriggerHolderMid: MiddleWare<IBotGroupMsgEventContext>;

export let ExampleMid: MiddleWare<IBotGroupMsgEventContext>;

BasicProcMid = async (ctx: IBotGroupMsgEventContext, next) => {
    let e = ctx.rawEvent;
    let data = e.data;
    let res: string = '';
    let msg = data.message;
    for(let item of msg){
        if(item.type === 'text') res += item.text;
        else if(item.type === 'image') res += `[$image(${item.url})$]`;
        else if(item.type === 'emoji') res += `[$emoji(${item.id})$]`;
    }
    ctx.msgText = res;
    ctx.replyText += '1 - BasicProc中间件将结构化消息变成纯文本\n';

    next();

    if(ctx.replyText === '') return;

    ctx.replyText += '2 - BasicProc中间件发送replyText的内容';
    await ctx.manager.sendGroupMsg(ctx.rawEvent.token, ctx.rawEvent.data.group_id, [
        {
            type: 'text',
            text: ctx.replyText
        }
    ]);
}

TriggerHolderMid = async (ctx: IBotGroupMsgEventContext, next) => {
    if(ctx.msgText.indexOf('Sucex') !== -1){
        ctx.replyText += `3 - TriggerHolder中间件控制是否触发\n`;
        await next();
    }
    else{
        ctx.replyText = '';
    }
}

ExampleMid = async (ctx: IBotGroupMsgEventContext, next) => {
    ctx.replyText += '4 - 示例中间件仅当触发时调用\n';
    ctx.replyText += `消息文本：${ctx.msgText}\n`;

    await next();
}