import {MigrationInterface, QueryRunner} from "typeorm";

export class matchTokenNotPrimary1616628438368 implements MigrationInterface {
    name = 'matchTokenNotPrimary1616628438368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match-player" DROP CONSTRAINT "FK_979cd4dfeb3b287f9d9a1901c76"`);
        await queryRunner.query(`ALTER TABLE "match-player" DROP COLUMN "matchToken"`);
        await queryRunner.query(`COMMENT ON COLUMN "match"."token" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "PK_411fa7c0be55a3e93f2cb1fae0e"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "UQ_9c396e8ea6e47449eff1a1fbe32" UNIQUE ("token")`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD CONSTRAINT "FK_8171365ce512840eef7f8a4cb86" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match-player" DROP CONSTRAINT "FK_8171365ce512840eef7f8a4cb86"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "UQ_9c396e8ea6e47449eff1a1fbe32"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d"`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "PK_411fa7c0be55a3e93f2cb1fae0e" PRIMARY KEY ("id", "token")`);
        await queryRunner.query(`COMMENT ON COLUMN "match"."token" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD "matchToken" character varying`);
        await queryRunner.query(`ALTER TABLE "match-player" ADD CONSTRAINT "FK_979cd4dfeb3b287f9d9a1901c76" FOREIGN KEY ("matchId", "matchToken") REFERENCES "match"("id","token") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
