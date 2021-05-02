import {MigrationInterface, QueryRunner} from "typeorm";

export class groups1619963535113 implements MigrationInterface {
    name = 'groups1619963535113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_b096f0c0ca94610b3e77128500c"`);
        await queryRunner.query(`CREATE TABLE "score" ("id" SERIAL NOT NULL, "kill" integer NOT NULL, "placement1" integer NOT NULL, "placement2" integer NOT NULL, "placement3" integer NOT NULL, "placement4" integer NOT NULL, "placement5" integer NOT NULL, "placement6" integer NOT NULL, "placement7" integer NOT NULL, "placement8" integer NOT NULL, "placement9" integer NOT NULL, "placement10" integer NOT NULL, "placement11" integer NOT NULL, "placement12" integer NOT NULL, "placement13" integer NOT NULL, "placement14" integer NOT NULL, "placement15" integer NOT NULL, "placement16" integer NOT NULL, "placement17" integer NOT NULL, "placement18" integer NOT NULL, "placement19" integer NOT NULL, "placement20" integer NOT NULL, CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "order" integer NOT NULL, "tournamentId" integer NOT NULL, CONSTRAINT "tournament_order" UNIQUE ("tournamentId", "order"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "tournamentId"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "match" ADD "index" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "match" ADD "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "season" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "season" ADD "end" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "scoreId" integer`);
        await queryRunner.query(`CREATE TYPE "user_roles_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" "user_roles_enum" array NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "match"."token" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_9c396e8ea6e47449eff1a1fbe32"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "seasonId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."seasonId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "unique_token_index" UNIQUE ("token", "index")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_44dd200e792b4b154314072def7" FOREIGN KEY ("scoreId") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_dbc79b088e9c415c2f573a94656" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_dbc79b088e9c415c2f573a94656"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_44dd200e792b4b154314072def7"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP CONSTRAINT "FK_7c3c956491004cf64cf725d8792"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_64e4b0003b6e0a10d1e388e2641"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "unique_token_index"`);
        await queryRunner.query(`COMMENT ON COLUMN "tournament"."seasonId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "seasonId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD CONSTRAINT "FK_7c3c956491004cf64cf725d8792" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_9c396e8ea6e47449eff1a1fbe32" UNIQUE ("token")`);
        await queryRunner.query(`COMMENT ON COLUMN "match"."token" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TYPE "user_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "scoreId"`);
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "index"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "tournamentId" integer`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_b096f0c0ca94610b3e77128500c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
