import { PrismaClient } from '@prisma/client';

declare global {
    var prisma : PrismaClient | undefined;
};

const prismadb = globalThis.prisma || new PrismaClient();

// If we init prisma client every time , NextJS with hot reaload will
// init prisma instances causing warning and degration of performance 
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;