import fs = require('fs');
import typeormConfig from '../config/config.typeorm';
import { ormconfigName } from './name.ormconfig';
import removeOrmConfig from './remove-ormconfig';

removeOrmConfig();

fs.writeFileSync(ormconfigName, JSON.stringify(typeormConfig(), null, 2));
