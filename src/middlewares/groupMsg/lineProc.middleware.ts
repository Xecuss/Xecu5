import MiddlewareBase from "../common/middlewareBase";
import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { Bot } from "../../lib/Bot";
import { MethodType } from "../../lib/decorator";

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
        let modules = bot.moduleList;

        for(let module of modules){
            let p = Object.getPrototypeOf(module);
            let keys = Object.getOwnPropertyNames(p);
            for(let k of keys){
                if(typeof p[k] !== 'function' || k === 'constructor') continue;
    
                let funcType = Reflect.getMetadata('XB:Method', p, k);
                    
                switch(funcType){
                    case MethodType.BeforeProc: {
                        console.log(`mount: ${k}`);
                        this.beforeProc.push(p[k].bind(module));
                        break;
                    }
                    case MethodType.AfterProc: {
                        console.log(`mount: ${k}`);
                        this.afterProc.push(p[k].bind(module));
                        break;
                    }
                    default: {
                        console.log(`${k} 不属于可执行method`);
                    }
                }
            }       
        }
    }
}