import config from './config/config';
import { Application } from './lib/main';

let app = new Application(config);

app.listen();