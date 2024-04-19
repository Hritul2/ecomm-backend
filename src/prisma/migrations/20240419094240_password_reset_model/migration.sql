-- CreateTable
CREATE TABLE "PasswordReset" (
    "PasswordResetID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "Expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("PasswordResetID")
);

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
