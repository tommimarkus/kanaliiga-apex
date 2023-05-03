import { MigrationInterface, QueryRunner } from "typeorm";

export class improveIndexing1683144445052 implements MigrationInterface {
    name = 'improveIndexing1683144445052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_f5ab7dec459cf626573d77daf6" ON "season" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3e4a42a8be8b449354a8b31cc" ON "season" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_f83327a69cfcbdc6819d0b3da1" ON "season" ("start") `);
        await queryRunner.query(`CREATE INDEX "IDX_12232f7bb28df308f375523926" ON "season" ("end") `);
        await queryRunner.query(`CREATE INDEX "IDX_35e403fb0633ef8313b63e102b" ON "tournament" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_5dc4b22539f4fe8f30669bbe8f" ON "tournament" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_39c996e461f5fe152d4811f9e5" ON "tournament" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_89be1ef37f403ce8c0faa79d5d" ON "group" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_117bd89523dbb1690ecd12d21b" ON "group" ("order") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b1a1c721ad9ad70bd61fa7c25" ON "match" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c396e8ea6e47449eff1a1fbe3" ON "match" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_057eafe4b865d8006fc02cd5f5" ON "match" ("index") `);
        await queryRunner.query(`CREATE INDEX "IDX_94e4c24a1498da8d531a6ac145" ON "match" ("start") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8fcd72f4226de6241139e4ee3" ON "match" ("aimAssistAllowed") `);
        await queryRunner.query(`CREATE INDEX "IDX_916f7e2b39ecb3827964df3b40" ON "match" ("mapName") `);
        await queryRunner.query(`CREATE INDEX "IDX_a44dd01d55bfa1eb9e9ce7b53b" ON "match-player" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1a1027a6936121b910f5e7990" ON "match-player" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d0edcc811d5413f8fda6dd5c58" ON "match-player" ("kills") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc872a0ab7097cbc053b64b081" ON "match-player" ("assists") `);
        await queryRunner.query(`CREATE INDEX "IDX_2189f9c77b61682cf3bcf4b8a0" ON "match-player" ("damage") `);
        await queryRunner.query(`CREATE INDEX "IDX_4773b2363e1e6647741a1341c9" ON "match-player" ("survivalTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_1615e8b22f63bf70f1181ab734" ON "match-player" ("teamName") `);
        await queryRunner.query(`CREATE INDEX "IDX_9299e80494538a765266d43aa9" ON "match-player" ("teamNum") `);
        await queryRunner.query(`CREATE INDEX "IDX_b492e60b97be3cc58c56f2418c" ON "match-player" ("teamPlacement") `);
        await queryRunner.query(`CREATE INDEX "IDX_803a049c1c15df896a5aaa4747" ON "match-player" ("hits") `);
        await queryRunner.query(`CREATE INDEX "IDX_f30202573a670cb0fe4e686aba" ON "match-player" ("characterName") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0e22a93aa808572b00559b831" ON "match-player" ("revivesGiven") `);
        await queryRunner.query(`CREATE INDEX "IDX_237b903442f1df8282efc054c8" ON "match-player" ("knockdowns") `);
        await queryRunner.query(`CREATE INDEX "IDX_6290bdc92c470d3c69d73afa39" ON "match-player" ("respawnsGiven") `);
        await queryRunner.query(`CREATE INDEX "IDX_54e41e25ec325827f1173ec1c2" ON "match-player" ("headshots") `);
        await queryRunner.query(`CREATE INDEX "IDX_2439efc64b179b8e676641f1aa" ON "match-player" ("shots") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_8174eb35667132931ceb6fd808" ON "user" ("roles") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8174eb35667132931ceb6fd808"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2439efc64b179b8e676641f1aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54e41e25ec325827f1173ec1c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6290bdc92c470d3c69d73afa39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_237b903442f1df8282efc054c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0e22a93aa808572b00559b831"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f30202573a670cb0fe4e686aba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_803a049c1c15df896a5aaa4747"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b492e60b97be3cc58c56f2418c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9299e80494538a765266d43aa9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1615e8b22f63bf70f1181ab734"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4773b2363e1e6647741a1341c9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2189f9c77b61682cf3bcf4b8a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc872a0ab7097cbc053b64b081"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0edcc811d5413f8fda6dd5c58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1a1027a6936121b910f5e7990"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a44dd01d55bfa1eb9e9ce7b53b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_916f7e2b39ecb3827964df3b40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8fcd72f4226de6241139e4ee3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94e4c24a1498da8d531a6ac145"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_057eafe4b865d8006fc02cd5f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c396e8ea6e47449eff1a1fbe3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b1a1c721ad9ad70bd61fa7c25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_117bd89523dbb1690ecd12d21b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89be1ef37f403ce8c0faa79d5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39c996e461f5fe152d4811f9e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5dc4b22539f4fe8f30669bbe8f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35e403fb0633ef8313b63e102b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12232f7bb28df308f375523926"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f83327a69cfcbdc6819d0b3da1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3e4a42a8be8b449354a8b31cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5ab7dec459cf626573d77daf6"`);
    }

}
