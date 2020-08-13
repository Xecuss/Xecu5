import { meta } from './metainfo';
import { Before, After } from '../../middlewares/groupMsg/decorator';
import { IBotGroupMsgEventContext } from '../../interface/context.interface';
import { IBotModule } from '../../interface/module.interface';

export default class TestModule implements IBotModule{
    public readonly meta = meta;

    constructor(){}

    @Before()
    async testBeforeMethod(ctx: IBotGroupMsgEventContext){
        ctx.msgText = ctx.msgText.replace('Xecus', 'Sucex');
        ctx.replyText += 'Before处理，本次测试使用了一种新的中间件结构\n';
    }

    @After()
    async testAfterMethod(ctx: IBotGroupMsgEventContext){
        ctx.replyText += `After处理，理论上可以降低Bot和中间件的耦合\n`;
        if(ctx.msgText.indexOf('Hiyuki') === -1){
            ctx.replyText = '';
        }
        console.log(ctx.replyText);
    }
}