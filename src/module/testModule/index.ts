import { meta } from './metainfo';
import { Before } from '../../lib/decorator';
import { IBotGroupMsgEventContext } from '../../interface/context.interface';
import { IBotModule } from '../../interface/module.interface';

export default class TestModule implements IBotModule{
    public readonly meta = meta;

    constructor(){}

    @Before()
    async testBeforeMethod1(ctx: IBotGroupMsgEventContext){
        ctx.replyText += '测试模块进行处理(testBeforeMethod1)\n';
    }

    @Before()
    async testBeforeMethod2(ctx: IBotGroupMsgEventContext){
        ctx.replyText += `测试模块进行处理2，输出模块自身描述：${this.meta.description}\n`;
    }
}