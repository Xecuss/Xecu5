import IBotConfig from '../interface/config.interface';

const Config: IBotConfig = {
    managerConfig: {
        port: 3000,
        drivers: [],
        verify: () => true,
        logger: console,
        getGroup: () => ''
    }
}

export default Config;