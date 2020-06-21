import config from './config/config';
import Platform from './lib/main';

let p = new Platform(config);

p.listen();