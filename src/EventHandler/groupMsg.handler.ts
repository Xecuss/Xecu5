import { IGroupMsgEvent } from "ws-bot-manager/dist/interface/IBotEvent";

import Main from '../lib/main';

export default async function EventHandler(this: Main, e: IGroupMsgEvent){
    let data = e.data;
    let res: string = '';
    res += `${e.token}收到群消息 - 来源群${data.group_id} - 由${data.sender.user_name}发送\n`;
    let msg = data.message;
    for(let item of msg){
        if(item.type === 'text') res += `文字: ${item.text}\n`;
        else if(item.type === 'image') res += `图片: ${item.url}\n`;
        else if(item.type === 'emoji') res += `表情: ${item.id}\n`;
    }
    this.logger.log(res)
}