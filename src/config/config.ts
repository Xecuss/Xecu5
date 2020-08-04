import IBotConfig from '../interface/config.interface';
import { NamedHistoryLogger } from '../lib/logger';
import path from 'path';

const logger = new NamedHistoryLogger('Bot', 20);

const Config: IBotConfig = {
    managerConfig: {
        port: 9000,
        drivers: [
            path.resolve('./dist/driver/coolq.driver'),
            path.resolve('./dist/driver/discord.driver')
        ],
        verify: () => true,
        logger: logger,
        getGroup: () => 'default'
    },
    logger
}

export default Config;