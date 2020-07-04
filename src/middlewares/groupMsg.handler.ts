import { IBotGroupMsgEventContext } from '../interface/context.interface';
import { MiddleWare } from "../lib/Midnight";

export let TransMsgToStringMid: MiddleWare<IBotGroupMsgEventContext>;

export let TriggerHolderMid: MiddleWare<IBotGroupMsgEventContext>;

TransMsgToStringMid = async (ctx: IBotGroupMsgEventContext, next) => {
    let e = ctx.rawEvent;
    let data = e.data;
    let res: string = 'StructMsg2String: ';
    let msg = data.message;
    for(let item of msg){
        if(item.type === 'text') res += item.text;
        else if(item.type === 'image') res += `[$image(${item.url})$]`;
        else if(item.type === 'emoji') res += `[$emoji(${item.id})$]`;
    }
    ctx.msg = res;
    next();
}

TriggerHolderMid = async (ctx: IBotGroupMsgEventContext, next) => {
    if(ctx.msg.indexOf('Sucex') !== -1){
        ctx.reply = `TriggerHolderMid: \n${ctx.msg}`;
    }
    await next();
    await ctx.manager.sendGroupMsg(ctx.rawEvent.token, ctx.rawEvent.data.group_id, [
        {
            type: 'text',
            text: ctx.reply
        }
    ]);
}