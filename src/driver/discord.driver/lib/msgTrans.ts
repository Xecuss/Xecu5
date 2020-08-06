import { IStructMessageItem } from "ws-bot-manager/dist/interface/IBotMessage";

export function DWSCMsg2StructMsg(msg: any): Array<IStructMessageItem>{
    let res: Array<IStructMessageItem> = [];
    res.push({
        type: 'text',
        text: msg.content
    });

    let attachments = msg.attachments;
    if(attachments){
        for(let item of attachments){
            res.push({
                type: 'image',
                url: item.url
            });
        }
    }

    let mentions = msg.mentions;
    if(mentions){
        for(let item of mentions){
            res.push({
                type: 'mention',
                id: item
            })
        }
    }

    return res;
}

export function StructMsg2DWSCMsg(msg: Array<IStructMessageItem>): any{
    let res: any = {
        content: '',
        attachments: [],
        mentions: []
    };

    for(let item of msg){
        switch(item.type){
            case 'text': {
                res.content += item.text;
                break;
            }
            case 'image': {
                res.attachments.push({
                    url: item.url
                });
                break;
            }
            case 'mention': {
                res.content += `<@${item.id}>`;
                break;
            }
        }
    }
    return res;
}