import { Logger } from '@nestjs/common';
import { createDatabase } from 'pg-god';
import { connectionOptions } from '../config/config.typeorm';

async function create() {
  const options = connectionOptions();

  const databaseName =
    typeof options.database === 'string' ? options.database : undefined;

  if (databaseName === undefined) {
    throw new Error('No database name found');
  }

  const user =
    typeof options.username === 'string' ? options.username : undefined;

  if (user === undefined) {
    throw new Error('No user name found');
  }

  const port = typeof options.port === 'number' ? options.port : undefined;

  if (port === undefined) {
    throw new Error('No port found');
  }

  const host = typeof options.host === 'string' ? options.host : undefined;

  if (host === undefined) {
    throw new Error('No host name found');
  }

  const password =
    typeof options.password === 'string' ? options.password : undefined;

  if (password === undefined) {
    throw new Error('No password found');
  }

  await createDatabase(
    {
      databaseName,
    },
    {
      user,
      port,
      host,
      password,
    },
  );
}

create().catch((e: Error) => Logger.error(`${e.name} ${e.message}`));
