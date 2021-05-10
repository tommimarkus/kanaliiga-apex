import {MigrationInterface, QueryRunner} from "typeorm";

export class changeScoreRelationFromTournamentToSeason1620667479813 implements MigrationInterface {
    name = 'changeScoreRelationFromTournamentToSeason1620667479813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_44dd200e792b4b154314072def7"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "scoreId"`);
        await queryRunner.query(`ALTER TABLE "season" ADD "scoreId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "seasonId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."seasonId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_dbc79b088e9c415c2f573a94656"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "tournament_order"`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "tournamentId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "group"."tournamentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "tournament_order" UNIQUE ("tournamentId", "order")`);
        await queryRunner.query(`ALTER TABLE "season" ADD CONSTRAINT "FK_77597518a3d43368bb2e1843250" FOREIGN KEY ("scoreId") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_dbc79b088e9c415c2f573a94656" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_dbc79b088e9c415c2f573a94656"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"`);
        await queryRunner.query(`ALTER TABLE "season" DROP CONSTRAINT "FK_77597518a3d43368bb2e1843250"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "tournament_order"`);
        await queryRunner.query(`COMMENT ON COLUMN "group"."tournamentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "tournamentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "tournament_order" UNIQUE ("order", "tournamentId")`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_dbc79b088e9c415c2f573a94656" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."seasonId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "seasonId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "scoreId"`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "scoreId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_44dd200e792b4b154314072def7" FOREIGN KEY ("scoreId") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
