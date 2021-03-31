import { IBotGroupMsgEventContext } from "../../interface/context.interface";
import { Bot } from "../../lib/Bot";

export default abstract class MiddlewareBase{
    abstract proc(ctx: IBotGroupMsgEventContext, next: () => Promise<void>): Promise<void>;

    abstract setup(bot: Bot): void;


    protected getMethodListfromBot(bot: Bot, metaKey: string, targetValue: string | Array<string>): { [K: string]: any } {
        let modules = bot.moduleList;

        let target: Array<string> = [];

        if(Array.isArray(targetValue)) target = targetValue;
        else target = [targetValue];

        let result: {[K: string]: any} = Object.create(null);

        for(let module of modules){
            let p = Object.getPrototypeOf(module);
            let keys = Object.getOwnPropertyNames(p);
            for(let k of keys){
                if(typeof p[k] !== 'function' || k === 'constructor') continue;
    
                let funcType = Reflect.getMetadata(metaKey, p, k);

                if(target.indexOf(funcType) === -1){
                    continue;
                }

                if(!result[funcType]){
                    result[funcType] = [];
                }
                console.log(`mount: ${k} type: ${metaKey} - ${funcType}`);
                result[funcType].push(p[k].bind(module));
            }
        }

        return result;
    }
}