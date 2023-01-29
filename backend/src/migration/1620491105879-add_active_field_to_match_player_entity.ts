import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class addActiveFieldToMatchPlayerEntity1620491105879 implements MigrationInterface {
  name = 'addActiveFieldToMatchPlayerEntity1620491105879'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match-player" ADD "active" boolean NOT NULL DEFAULT true')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match-player" DROP COLUMN "active"')
  }
}
