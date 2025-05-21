import { envs } from './config/envs.config';
import { Server } from './server';

const bootstrap = async () => {
  new Server({ port: envs.PORT }).start();
};

void bootstrap();
