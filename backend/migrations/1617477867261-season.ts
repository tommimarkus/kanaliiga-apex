import {MigrationInterface, QueryRunner} from "typeorm";

export class season1617477867261 implements MigrationInterface {
    name = 'season1617477867261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "season" ("id" SERIAL NOT NULL, "name" character varying, "start" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "seasonId" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "UQ_39c996e461f5fe152d4811f9e54" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "UQ_39c996e461f5fe152d4811f9e54"`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "seasonId"`);
        await queryRunner.query(`DROP TABLE "season"`);
    }

}
