export default class Logger{
    static log(str: string): void{
        console.log(`[${new Date().toLocaleString()}] I: ${str}`);
    }

    static error(str: string): void{
        console.error(`[${new Date().toLocaleString()}] E: ${str}`);
    }

    static warn(str: string): void{
        console.warn(`[${new Date().toLocaleString()}] W: ${str}`);
    }
}

export class NamedLogger{
    private name: string;
    constructor(name: string){
        this.name = name;
    }
    log(str: string): void{
        console.log(`[${new Date().toLocaleString()}][${this.name}] I: ${str}`);
    }

    error(str: string): void{
        console.error(`[${new Date().toLocaleString()}][${this.name}] E: ${str}`);
    }

    warn(str: string): void{
        console.warn(`[${new Date().toLocaleString()}][${this.name}] W: ${str}`);
    }
}

interface ILoggerHistoryItem{
    id: number;
    type: 'info'|'error'|'warn';
    content: string;
    time: number;
    name: string;
}

export class NamedHistoryLogger{
    private name: string;
    private size: number;
    private history: Array<ILoggerHistoryItem>;
    private id: number;
    constructor(name: string, size: number){
        this.name = name;
        this.size = size;
        this.history = [];
        this.id = 0;
    }

    private pushHistory(time: Date, content: string, type: 'info'|'error'|'warn'){
        if(this.history.length >= this.size){
            this.history.shift();
        }
        this.history.push({
            type,
            content,
            time: time.valueOf(),
            name: this.name,
            id: this.id
        });
        this.id++;
    }

    public getHistory(): Array<ILoggerHistoryItem>{
        return this.history;
    }
    public clearHistory(): void{
        this.history = [];
    }

    public log(str: string): void{
        let t = new Date();
        this.pushHistory(t, str, 'info');
        console.log(`[${t.toLocaleString()}][${this.name}] I: ${str}`);
    }

    public error(str: string): void{
        let t = new Date();
        this.pushHistory(t, str, 'error');
        console.error(`[${t.toLocaleString()}][${this.name}] E: ${str}`);
    }

    public warn(str: string): void{
        let t = new Date();
        this.pushHistory(t, str, 'warn');
        console.warn(`[${t.toLocaleString()}][${this.name}] W: ${str}`);
    }
}