-- CreateTable
CREATE TABLE "fish" (
    "fishId" SERIAL NOT NULL,
    "fishName" VARCHAR(100) NOT NULL,
    CONSTRAINT "fish_pkey" PRIMARY KEY ("fishId")
);
