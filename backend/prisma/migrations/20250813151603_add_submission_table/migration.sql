-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "nameAsPerAadhaar" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "pan" TEXT NOT NULL,
    "itrFiled" TEXT NOT NULL,
    "gstRegistered" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
