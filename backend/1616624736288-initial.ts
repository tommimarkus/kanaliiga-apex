import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1616624736288 implements MigrationInterface {
    name = 'initial1616624736288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournament" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "name" character varying, CONSTRAINT "UQ_5dc4b22539f4fe8f30669bbe8f2" UNIQUE ("token"), CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "start" TIMESTAMP WITH TIME ZONE, "tournamentId" integer, CONSTRAINT "PK_411fa7c0be55a3e93f2cb1fae0e" PRIMARY KEY ("id", "token"))`);
        await queryRunner.query(`CREATE TABLE "match-player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "kills" integer NOT NULL, "assists" integer NOT NULL, "damage" integer NOT NULL, "survivalTime" integer NOT NULL, "teamName" character varying NOT NULL, "teamNum" integer NOT NULL, "teamPlacement" integer NOT NULL, "matchId" integer, "matchToken" character varying, CONSTRAINT "PK_74cd72748326752379b0bfa2c02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_b096f0c0ca94610b3e77128500c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD CONSTRAINT "FK_979cd4dfeb3b287f9d9a1901c76" FOREIGN KEY ("matchId", "matchToken") REFERENCES "match"("id","token") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match-player" DROP CONSTRAINT "FK_979cd4dfeb3b287f9d9a1901c76"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_b096f0c0ca94610b3e77128500c"`);
        await queryRunner.query(`DROP TABLE "match-player"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "tournament"`);
    }

}
