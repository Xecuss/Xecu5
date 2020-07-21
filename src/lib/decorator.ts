import 'reflect-metadata';

export enum MethodType {
    BeforeProc,
    AfterProc,
    Trigger
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