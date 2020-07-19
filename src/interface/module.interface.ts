export interface IModuleMeta{
    readonly id: string;

    readonly name: string;

    readonly friendlyName: string;

    readonly description: string;
}

export interface IBotModule{
    readonly meta: IModuleMeta;
}