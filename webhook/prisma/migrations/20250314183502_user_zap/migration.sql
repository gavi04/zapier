-- AlterTable
CREATE SEQUENCE zap_ownerid_seq;
ALTER TABLE "Zap" ALTER COLUMN "ownerId" SET DEFAULT nextval('zap_ownerid_seq');
ALTER SEQUENCE zap_ownerid_seq OWNED BY "Zap"."ownerId";
