import {MigrationInterface, QueryRunner} from "typeorm";

export class tournamentStart1617294227590 implements MigrationInterface {
    name = 'tournamentStart1617294227590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" ADD "start" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "start"`);
    }

}
