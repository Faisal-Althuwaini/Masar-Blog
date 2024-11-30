import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserUsernameIndex1677025274621 implements MigrationInterface {
  name = 'AddUserUsernameIndex1677025274621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the index after the table is created
    await queryRunner.query(
      `CREATE INDEX "findByUserName" ON "user" ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first before dropping the table
    await queryRunner.query(`DROP INDEX "findByUserName"`);
  }
}
