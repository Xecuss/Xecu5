import MiddlewareBase from "../common/middlewareBase";
import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { Bot } from "../../lib/Bot";
import { MethodType } from "./decorator";

export class LineProcMid extends MiddlewareBase{
    private beforeProc: any[] = [];
    private afterProc: any[] = [];

    constructor(){
        super();
    }

    public async proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void>{
        //let { bot } = ctx;
        let beforeList = this.beforeProc;
        for(let fn of beforeList){
            await fn(ctx);
        }
    
        await next();
    
        let afterList = this.afterProc;
        for(let fn of afterList){
            await fn(ctx);
        }
    }

    public setup(bot: Bot){
        let res = this.getMethodListfromBot(bot, 'XB:Method', [MethodType.BeforeProc, MethodType.AfterProc]);
        this.beforeProc = res[MethodType.BeforeProc] || [];
        this.afterProc = res[MethodType.AfterProc] || [];
    }
}