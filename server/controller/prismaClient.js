const { PrismaClient, Prisma } = require("@prisma/client");
const errorHandling = Prisma.PrismaClientKnownRequestError;
const ClientErrorHandling = Prisma.PrismaClientValidationError;
const prisma = new PrismaClient();
module.exports = { prisma, errorHandling, ClientErrorHandling };
