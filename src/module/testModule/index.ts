import { meta } from './metainfo';
import { Before, After } from '../../lib/decorator';
import { IBotGroupMsgEventContext } from '../../interface/context.interface';
import { IBotModule } from '../../interface/module.interface';

export default class TestModule implements IBotModule{
    public readonly meta = meta;

    constructor(){}

    @Before()
    async testBeforeMethod(ctx: IBotGroupMsgEventContext){
        ctx.msgText = ctx.msgText.replace('Xecus', 'Sucex');
        ctx.replyText += 'Before处理，将请求中的Xecus换成Sucex\n';
    }

    @After()
    async testAfterMethod(ctx: IBotGroupMsgEventContext){
        ctx.replyText += `After处理，输出模块自身描述：${this.meta.description}\n`;
        if(ctx.msgText.indexOf('Hiyuki') === -1){
            ctx.replyText = '';
        }
        console.log(ctx.replyText);
    }
}