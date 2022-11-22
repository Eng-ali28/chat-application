const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandling = Prisma.PrismaClientKnownRequestError;
const ClientErrorHandling = Prisma.PrismaClientValidationError;
module.exports = { prisma, errorHandling, ClientErrorHandling };
