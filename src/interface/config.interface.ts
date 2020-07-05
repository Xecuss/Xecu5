import { IBotManagerConfig } from "ws-bot-manager/dist/interface/IBotManagerConfig";

export interface Console{
    log(s: string): void;
    warn(s: string): void;
    error(s: string): void;
}

export default interface IBotConfig{
    managerConfig: IBotManagerConfig;
    logger: Console
}