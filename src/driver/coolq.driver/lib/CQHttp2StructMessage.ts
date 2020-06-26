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

export default transCQHttpType;