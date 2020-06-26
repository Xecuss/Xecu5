import { IStructMessageItem } from 'ws-bot-manager/dist/interface/IBotMessage';

const transCQHttpType: { [T: string]: (item: any) => IStructMessageItem} = {
    'text': (item: any) => { return {
        type: 'text',
        text: item.data.text
    };},
    'image': (item: any) => {return {
        type: 'image',
        url: item.data.file
    };},
    'face': (item: any) => {return {
        type: 'emoji',
        id: item.data.id
    };}
}

export function CQHttpMsg2StructMsg(msg: any): Array<IStructMessageItem>{
    let res: Array<IStructMessageItem> = [];
    if(typeof msg === 'string'){
        //to do
    }
    else{
        for(let item of msg){
            let transFunc = transCQHttpType[item.type];
            if(transFunc !== undefined){
                res.push(transFunc(item));
            }
        }
    }
    return res;
}

export function StructMsg2CQHttpMsg(msg: Array<IStructMessageItem>): any{
    let res: Array<any> = [];
    for(let item of msg){
        switch(item.type){
            case 'text': {
                res.push({
                    type: 'text',
                    data: {
                        text: item.text
                    }
                });
                break;
            }
            case 'image': {
                res.push({
                    type: 'image',
                    data: {
                        file: item.url
                    }
                });
                break;
            }
            case 'emoji': {
                res.push({
                    type: 'face',
                    data: {
                        id: item.id
                    }
                });
                break;
            }
        }
    }

    return res;
}