import { MigrationInterface, QueryRunner } from "typeorm";

export class upgradeEverything1675029979606 implements MigrationInterface {
    name = 'upgradeEverything1675029979606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "aimAssistAllowed" boolean`);
        await queryRunner.query(`ALTER TABLE "match" ADD "mapName" character varying`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "hits" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "characterName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "revivesGiven" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "knockdowns" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "respawnsGiven" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "headshots" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "shots" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "shots"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "headshots"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "respawnsGiven"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "knockdowns"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "revivesGiven"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "characterName"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "hits"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "mapName"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "aimAssistAllowed"`);
    }

}
