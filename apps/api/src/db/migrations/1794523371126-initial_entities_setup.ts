import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialEntitiesSetup1794523371126 implements MigrationInterface {
    name = 'InitialEntitiesSetup1794523371126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duration_minutes" integer NOT NULL, "price_per_duration" integer NOT NULL, "grace_period_minutes" integer NOT NULL DEFAULT '0', "daily_max_amount" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, "branch_id" uuid NOT NULL, CONSTRAINT "REL_4088ff7ff4e3f44bb4c58335ba" UNIQUE ("branch_id"), CONSTRAINT "PK_2c804ed4019b80ce48eedba5cec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "state" character varying NOT NULL, "address" character varying NOT NULL, "total_capacity" integer NOT NULL, "disabled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "email_verified_at" TIMESTAMP WITH TIME ZONE, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accepted_at" TIMESTAMP WITH TIME ZONE, "disabled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "UQ_ef2d3488875cb7728f5375c766e" UNIQUE ("organization_id", "user_id"), CONSTRAINT "PK_af79a22d50256af35812ba60a87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_user_id" uuid NOT NULL, "branch_id" uuid NOT NULL, CONSTRAINT "UQ_8d92f0ee48e92eca18daeb68cc2" UNIQUE ("organization_user_id", "branch_id"), CONSTRAINT "PK_37027b9a3d990b4066938e5bc54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plate_number" character varying NOT NULL, "color" character varying, "model" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, CONSTRAINT "UQ_c204b665c4ebef129c399062b5c" UNIQUE ("organization_id", "plate_number"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."parking_sessions_status_enum" AS ENUM('active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "parking_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."parking_sessions_status_enum" NOT NULL DEFAULT 'active', "entry_at" TIMESTAMP WITH TIME ZONE NOT NULL, "exit_at" TIMESTAMP WITH TIME ZONE, "entry_photo_path" character varying, "exit_photo_path" character varying, "entry_plate_confidence" real, "exit_plate_confidence" real, "duration_minutes" integer, "billed_duration_minutes" integer, "billed_price_per_duration" integer, "billed_grace_period_minutes" integer, "billed_daily_max_amount" integer, "total_amount" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" uuid NOT NULL, "branch_id" uuid NOT NULL, "vehicle_id" uuid NOT NULL, "entry_recorded_by" uuid NOT NULL, "exit_recorded_by" uuid, CONSTRAINT "PK_3e965188d8b19a33232c3972b22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee982b8556266d12650326b9ef" ON "parking_sessions"  ("organization_id", "entry_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_353b5090ad4ab74a1e181fb944" ON "parking_sessions"  ("organization_id", "branch_id", "status") `);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "UQ_25d24010f53bb80b78e412c9656" UNIQUE ("role_id", "permission_id"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tokens_type_enum" AS ENUM('refresh', 'email_verification', 'password_reset', 'invite')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "token" character varying NOT NULL, "type" "public"."tokens_type_enum" NOT NULL, "email" character varying, "metadata" jsonb, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rates" ADD CONSTRAINT "FK_cb839347284be26aa1bc9d17ebd" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rates" ADD CONSTRAINT "FK_4088ff7ff4e3f44bb4c58335ba6" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_9ecf73d5ca57108dc33c87f7d88" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_users" ADD CONSTRAINT "FK_2e986873df93e8e64973f51eaae" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_branches" ADD CONSTRAINT "FK_e11f49856bd8e5dfeee8425572c" FOREIGN KEY ("organization_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_branches" ADD CONSTRAINT "FK_83152ee2320a92aaa58dba46019" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_f9603f682ee2d499d3abfd50225" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" ADD CONSTRAINT "FK_da28bb98627cc91181bb6d452b6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" ADD CONSTRAINT "FK_82d8b28404b82743b7703fc493d" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" ADD CONSTRAINT "FK_cf0c504ea503ea443e9e55724c1" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" ADD CONSTRAINT "FK_e417fb280b95babfdcc062d8f68" FOREIGN KEY ("entry_recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" ADD CONSTRAINT "FK_60fae5311314952810d64d64d93" FOREIGN KEY ("exit_recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" DROP CONSTRAINT "FK_60fae5311314952810d64d64d93"`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" DROP CONSTRAINT "FK_e417fb280b95babfdcc062d8f68"`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" DROP CONSTRAINT "FK_cf0c504ea503ea443e9e55724c1"`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" DROP CONSTRAINT "FK_82d8b28404b82743b7703fc493d"`);
        await queryRunner.query(`ALTER TABLE "parking_sessions" DROP CONSTRAINT "FK_da28bb98627cc91181bb6d452b6"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_f9603f682ee2d499d3abfd50225"`);
        await queryRunner.query(`ALTER TABLE "employee_branches" DROP CONSTRAINT "FK_83152ee2320a92aaa58dba46019"`);
        await queryRunner.query(`ALTER TABLE "employee_branches" DROP CONSTRAINT "FK_e11f49856bd8e5dfeee8425572c"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_2e986873df93e8e64973f51eaae"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c"`);
        await queryRunner.query(`ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_9ecf73d5ca57108dc33c87f7d88"`);
        await queryRunner.query(`ALTER TABLE "rates" DROP CONSTRAINT "FK_4088ff7ff4e3f44bb4c58335ba6"`);
        await queryRunner.query(`ALTER TABLE "rates" DROP CONSTRAINT "FK_cb839347284be26aa1bc9d17ebd"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_type_enum"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_353b5090ad4ab74a1e181fb944"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee982b8556266d12650326b9ef"`);
        await queryRunner.query(`DROP TABLE "parking_sessions"`);
        await queryRunner.query(`DROP TYPE "public"."parking_sessions_status_enum"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "employee_branches"`);
        await queryRunner.query(`DROP TABLE "organization_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "branches"`);
        await queryRunner.query(`DROP TABLE "rates"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
