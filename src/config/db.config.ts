import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma connected to database");
    } catch (error: any) {
        console.error("Prisma connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
