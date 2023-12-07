-- CreateTable
CREATE TABLE "test" (
    "id" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "angler" VARCHAR(100) NOT NULL,
    "fishSpecies" VARCHAR(100) NOT NULL,
    "date" DATE NOT NULL,
    "location" VARCHAR(100),
    "weight" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "pressure" DOUBLE PRECISION,
    "image" VARCHAR(100) NOT NULL,
    "voiceMessage" VARCHAR(100),

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

