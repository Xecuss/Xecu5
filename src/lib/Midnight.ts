export type MiddleWare<C> = (ctx: C, next: () => Promise<void>) => Promise<void>;
type innerMiddle<C> = (ctx: C, next?: MiddleWare<C>) => Promise<void>

export abstract class MidNight<E, C>{
    private middlewares: MiddleWare<C>[] = [];

    use(middleware: MiddleWare<C>){
        this.middlewares.push(middleware);
    };

    private createNext(middleware: MiddleWare<C>, oldNext: any, ctx: C): innerMiddle<C>{
        return async () => {
            await middleware(ctx, oldNext);
        }
    }

    private compose(){
        return async ( ctx: C ) => {
            let middlewares = this.middlewares;

            let next = async (ctx: C) => { return; };

            for(let idx = middlewares.length; idx--; ){
                let middleware = middlewares[idx];
                next = this.createNext(middleware, next, ctx);
            }

            await next(ctx);
        }
    }

    public async mid(e: E): Promise<void>{
        let ctx = this.transEventToContext(e);
        let fn = this.compose();
        await fn(ctx);
    }

    abstract transEventToContext(e: E): C;
}