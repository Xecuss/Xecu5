import 'reflect-metadata';

export enum MethodType {
    BeforeProc = '0',
    AfterProc = '1',
    Trigger = '2'
}

export function Before(): MethodDecorator{
    return (target, key, descriptor) => {
        Reflect.defineMetadata('XB:Method', MethodType.BeforeProc, target, key);
    }
}

export function After(): MethodDecorator{
    return (target, key, descriptor) => {
        Reflect.defineMetadata('XB:Method', MethodType.AfterProc, target, key);
    }
}