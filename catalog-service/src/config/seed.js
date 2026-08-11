const cakeModel = require('../models/Cake');

const sampleCakes = [
  {
    name: "Chocolate Truffle Delight",
    description: "Rich dark chocolate layer cake topped with ganache glaze",
    category: "Chocolate",
    price: 499,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    name: "Red Velvet Dream",
    description: "Classic red velvet with silky cream cheese frosting",
    category: "Velvet",
    price: 599,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f"
  },
  {
    name: "Strawberry Bliss",
    description: "Fresh farm strawberries with light vanilla sponge",
    category: "Fruit",
    price: 449,
    stockQuantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187"
  },
  {
    name: "Mango Passion Crunch",
    description: "Tropical mango mousse with passion fruit gelatin glaze",
    category: "Fruit",
    price: 549,
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13136"
  }
];

const seedCakesIfEmpty = async () => {
  try {
    const count = await cakeModel.countDocuments();
    if (count === 0) {
      await cakeModel.insertMany(sampleCakes);
      console.log("[Catalog Service] Sample cake inventory seeded successfully!");
    }
  } catch (error) {
    console.error("[Catalog Seed Error]:", error.message);
  }
};

module.exports = seedCakesIfEmpty;
