import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const meals = [
  { name: "Salmon Nigiri", price: 24.49 },
  { name: "Tuna Roll", price: 21.99 },
  { name: "Eel Avocado", price: 22.99 },
  { name: "California Roll", price: 23.49 },
];

async function main() {
  await prisma.meal.createMany({
    data: meals,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
