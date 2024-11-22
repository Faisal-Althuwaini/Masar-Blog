import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserUsernameIndex1677025274621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "findByUserName" ON "user" USING HASH ("username");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "findByUserName";
    `);
  }
}
