import { IGroupMsgEvent } from "ws-bot-manager/dist/interface/IBotEvent";

import Main from '../lib/main';

export default async function EventHandler(this: Main, e: IGroupMsgEvent){
    let data = e.data;
    let res: string = '';
    res += `${e.token}收到群消息 - 来源群${data.group_id} - 由${data.sender.user_name}发送\n`;
    let msg = data.message;
    let trigger: boolean = false;
    for(let item of msg){
        if(item.type === 'text'){
            res += `文字: ${item.text}\n`
            if(item.text.indexOf('Sucex') !== -1) trigger = true;
        }
        else if(item.type === 'image') res += `图片: ${item.url}\n`;
        else if(item.type === 'emoji') res += `表情: ${item.id}\n`;
    }
    if(trigger){
        let sendRes = await this.manager.sendGroupMsg('default', e.data.group_id, [{
            type: 'text',
            text: res
        }]);
        if(sendRes.success){
            this.logger.log(`msgId: ${sendRes.message_id}` || '无发获取messageId');
        }
    }
    else{
        this.logger.log(res);
    }
}