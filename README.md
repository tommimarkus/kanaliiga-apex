# Kanaliiga Apex Legends Statistics Service

## Setup backend

Install nestjs globally:

``` bash
npm i -g @nestjs/cli
```

Read `backend/README.md` for basic commands.

### Start database

Ensure you have a PostgreSQL database up and running.

#### Docker

To run the database inside Docker, run as follows:

``` bash
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

``` bash
cd backend
cp example.env .env
```

Fill in at least `TYPEORM_PORT`, `TYPEORM_DATABASE` `TYPEORM_USERNAME` and `TYPEORM_PASSWORD`
to match the values of the PostgreSQL database in the previous step.

For automatic database synchronization, set `TYPEORM_SYNCHRONIZE=true`. DB synchronization
is useful in developement environment but you probably want to turn it off in production.

Start the application:

``` bash
npm run start:dev
```

### Create user

Create a password for a user:

``` bash
node ./node_modules/bcryptjs/bin/bcrypt <PASSWORD> 12
```

Create an admin user for the API:

``` sql
INSERT INTO public.user
 (username, "passwordHash", roles)
VALUES (
  '<USERNAME>',
  '<12 ROUND BCRYPT PASSWORD>',
  ARRAY['ADMIN']::user_roles_enum[]
);
```

#### Optional: Manual migrations

If you want to run database migrations manually instead of syncrhonization,
set `TYPEORM_SYNCHRONIZE=false` and run:

``` bash
npm run typeorm -- migration:run
```

## Insert data

First, obtain match data in `json` format. Then do the following:

- Open Swagger UI from <http://localhost:3001/docs/>
- Click on the `Authorize` button and fill in the credentials you
   created in the previous step.
- Locate and click on `POST` `/api/match/json`
- Click "Try it out" and input a token string and the match json file.
- Execute. Check, that you got a `201` response code and a valid response body.
