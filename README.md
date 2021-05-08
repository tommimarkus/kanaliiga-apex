# Kanaliiga Apex Legends Statistics Service

## Tools

- Visual Studio Code (<https://code.visualstudio.com/>)
  - Plugins:
    - ESLint
    - Prettier
- Docker (<https://www.docker.com/>)
- pgAdmin (<https://www.pgadmin.org/>)
- Sourcetree (<https://www.sourcetreeapp.com/>)
- Browser Addons:
  - React Developer Tools

## Setup backend

Install nestjs globally:

```bash
npm i -g @nestjs/cli
```

### Start database

Ensure you have a PostgreSQL database up and running.

#### Docker

To run the database inside Docker, run as follows:

```bash
docker run --name postgresql-container
  -p <DB_PORT>:5432
  -e POSTGRES_DB=<DB_NAME> \
  -e POSTGRES_USER=<DB_USER> \
  -e POSTGRES_PASSWORD=<DB_PASSWORD>
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v ${PWD}/.postgres/default/data:/var/lib/postgresql/data/pgdata \
  -d postgres:11
```

### Configure database connection

Open directory `backend` and create an `.env` file by copying from
`example.env` and fill in the blanks

```bash
cd backend
cp example.env .env
```

Fill in at least `TYPEORM_PORT`, `TYPEORM_DATABASE` `TYPEORM_USERNAME` and `TYPEORM_PASSWORD`
to match the values of the PostgreSQL database in the previous step.

For automatic database synchronization, set `TYPEORM_SYNCHRONIZE=true`. DB synchronization is useful in developement environment, but you will want to turn it off in production.

Start the application:

```bash
npm run start:dev
```

### Create user

Create a password for a user:

```bash
npm run genba --- <PASSWORD> 12
```

Create an admin user for the API:

```sql
INSERT INTO public.user
 (username, "passwordHash", roles)
VALUES (
  '<USERNAME>',
  '<12 ROUND BCRYPT PASSWORD>',
  ARRAY['ADMIN']::user_roles_enum[]
);
```

#### Migrations

##### Generating Migrations

> ...without losing all your precious development db data.

```bash
npm run migration:createdb
npm run migration:generate <NAME FOR MIGRATION>
npm run migration:dropdb
```

> Do this every time there is a change to entity source file
> e.g. user.entity.ts
>
> Commit the migration file!

##### Running Migrations

```bash
npm run typeorm -- migration:run
```

> This is typically only run on production server

### Insert data

First, obtain match data in `json` format. Then do the following:

- Open Swagger UI from <http://localhost:3001/docs/>
- Click on the `Authorize` button and fill in the credentials you
  created in the previous step.
- Locate and click on `POST` `/api/match/json`
- Click "Try it out" and input a token string and the match json file.
- Execute. Check, that you got a `201` response code and a valid response body.

## Setup Frontend

### Configure development environment

Copy `example.env` to `.env` and fill in the blanks to match
your environment and the configured backend.

For `REACT_APP_BASIC_AUTH` use the user and password you have
created in the backend, with base 64 encoding: `base64encode('<user>:<password>')`.

or

```bash
echo user:password | base64 -i
```

### Install and run

```bash
npm install
npm run start
```

Open browser in `http://localhost:3000`.
