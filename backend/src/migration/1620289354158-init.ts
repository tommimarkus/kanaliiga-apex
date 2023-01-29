import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class init1620289354158 implements MigrationInterface {
  name = 'init1620289354158'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "match-player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "kills" integer NOT NULL, "assists" integer NOT NULL, "damage" integer NOT NULL, "survivalTime" integer NOT NULL, "teamName" character varying NOT NULL, "teamNum" integer NOT NULL, "teamPlacement" integer NOT NULL, "matchId" integer, CONSTRAINT "PK_74cd72748326752379b0bfa2c02" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "match" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "token" character varying NOT NULL, "index" integer NOT NULL DEFAULT \'0\', "start" TIMESTAMP WITH TIME ZONE, "groupId" integer, CONSTRAINT "unique_token_index" UNIQUE ("token", "index"), CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "score" ("id" SERIAL NOT NULL, "kill" integer NOT NULL, "placement1" integer NOT NULL, "placement2" integer NOT NULL, "placement3" integer NOT NULL, "placement4" integer NOT NULL, "placement5" integer NOT NULL, "placement6" integer NOT NULL, "placement7" integer NOT NULL, "placement8" integer NOT NULL, "placement9" integer NOT NULL, "placement10" integer NOT NULL, "placement11" integer NOT NULL, "placement12" integer NOT NULL, "placement13" integer NOT NULL, "placement14" integer NOT NULL, "placement15" integer NOT NULL, "placement16" integer NOT NULL, "placement17" integer NOT NULL, "placement18" integer NOT NULL, "placement19" integer NOT NULL, "placement20" integer NOT NULL, CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "season" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "name" character varying, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "tournament" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "token" character varying NOT NULL, "name" character varying NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "seasonId" integer NOT NULL, "scoreId" integer, CONSTRAINT "UQ_5dc4b22539f4fe8f30669bbe8f2" UNIQUE ("token"), CONSTRAINT "UQ_39c996e461f5fe152d4811f9e54" UNIQUE ("name"), CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TABLE "group" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "order" integer NOT NULL, "tournamentId" integer NOT NULL, CONSTRAINT "tournament_order" UNIQUE ("tournamentId", "order"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))')
    await queryRunner.query('CREATE TYPE "user_roles_enum" AS ENUM(\'ADMIN\', \'USER\')')
    await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "roles" "user_roles_enum" array NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))')
    await queryRunner.query('ALTER TABLE "match-player" ADD CONSTRAINT "FK_8171365ce512840eef7f8a4cb86" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "match" ADD CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "tournament" ADD CONSTRAINT "FK_44dd200e792b4b154314072def7" FOREIGN KEY ("scoreId") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "group" ADD CONSTRAINT "FK_dbc79b088e9c415c2f573a94656" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "group" DROP CONSTRAINT "FK_dbc79b088e9c415c2f573a94656"')
    await queryRunner.query('ALTER TABLE "tournament" DROP CONSTRAINT "FK_44dd200e792b4b154314072def7"')
    await queryRunner.query('ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"')
    await queryRunner.query('ALTER TABLE "match" DROP CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641"')
    await queryRunner.query('ALTER TABLE "match-player" DROP CONSTRAINT "FK_8171365ce512840eef7f8a4cb86"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TYPE "user_roles_enum"')
    await queryRunner.query('DROP TABLE "group"')
    await queryRunner.query('DROP TABLE "tournament"')
    await queryRunner.query('DROP TABLE "season"')
    await queryRunner.query('DROP TABLE "score"')
    await queryRunner.query('DROP TABLE "match"')
    await queryRunner.query('DROP TABLE "match-player"')
  }
}
