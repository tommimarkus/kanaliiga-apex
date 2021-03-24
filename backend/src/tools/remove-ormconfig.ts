import fs = require('fs');
import { ormconfigName } from './name.ormconfig';

const removeOrmConfig = (): void => {
  try {
    fs.unlinkSync(ormconfigName);
  } catch {}
};

removeOrmConfig();

export default removeOrmConfig;
