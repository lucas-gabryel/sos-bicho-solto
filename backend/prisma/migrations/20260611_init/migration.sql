-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROTETOR');

-- CreateEnum
CREATE TYPE "AnimalSpecies" AS ENUM ('CACHORRO', 'GATO', 'OUTRO');

-- CreateEnum
CREATE TYPE "AnimalSex" AS ENUM ('MACHO', 'FEMEA');

-- CreateEnum
CREATE TYPE "AnimalSize" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "AnimalStatus" AS ENUM ('EM_ACOLHIMENTO', 'ADOTADO', 'EM_TRATAMENTO', 'FALECIDO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "species" "AnimalSpecies" NOT NULL,
    "breed" VARCHAR(120) NOT NULL,
    "sex" "AnimalSex" NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DECIMAL(5,2),
    "size" "AnimalSize" NOT NULL,
    "status" "AnimalStatus" NOT NULL DEFAULT 'EM_ACOLHIMENTO',
    "color" VARCHAR(80),
    "description" TEXT,
    "photoUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "address" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoptions" (
    "id" UUID NOT NULL,
    "animalId" UUID NOT NULL,
    "tutorId" UUID NOT NULL,
    "adoptionDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "animals_name_idx" ON "animals"("name");

-- CreateIndex
CREATE INDEX "animals_species_status_idx" ON "animals"("species", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tutors_cpf_key" ON "tutors"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tutors_email_key" ON "tutors"("email");

-- CreateIndex
CREATE INDEX "tutors_name_idx" ON "tutors"("name");

-- CreateIndex
CREATE INDEX "tutors_cpf_idx" ON "tutors"("cpf");

-- CreateIndex
CREATE INDEX "adoptions_animalId_idx" ON "adoptions"("animalId");

-- CreateIndex
CREATE INDEX "adoptions_tutorId_idx" ON "adoptions"("tutorId");

-- CreateIndex
CREATE INDEX "adoptions_adoptionDate_idx" ON "adoptions"("adoptionDate");

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
