const cakeModel = require('../models/Cake');

const sampleCakes = [
  // Chocolate Category
  {
    name: "Chocolate Truffle Delight",
    description: "Rich dark chocolate layer cake topped with ganache glaze",
    category: "Chocolate",
    price: 499,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    name: "Belgian Dark Forest",
    description: "Premium Belgian chocolate sponge layered with cherries and whipped cream",
    category: "Chocolate",
    price: 649,
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62"
  },
  {
    name: "Nutella Hazelnut Crunch",
    description: "Creamy Nutella frosting with roasted hazelnut praline layers",
    category: "Chocolate",
    price: 699,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    name: "Triple Chocolate Lava",
    description: "Molten dark, milk, and white chocolate layered sponge",
    category: "Chocolate",
    price: 599,
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62"
  },
  {
    name: "Choco Lava Mousse Cake",
    description: "Decadent chocolate mousse cake with a gooey cocoa core",
    category: "Chocolate",
    price: 529,
    stockQuantity: 14,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },

  // Velvet Category
  {
    name: "Red Velvet Dream",
    description: "Classic red velvet with silky cream cheese frosting",
    category: "Velvet",
    price: 599,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f"
  },
  {
    name: "Royal Red Velvet Supreme",
    description: "Triple-layer red velvet cake studded with white chocolate chips",
    category: "Velvet",
    price: 699,
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c"
  },
  {
    name: "Pink Velvet Berry Swirl",
    description: "Delicate pink velvet cake with raspberry cream cheese filling",
    category: "Velvet",
    price: 649,
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f"
  },
  {
    name: "Crimson Velvet Fudge",
    description: "Rich red velvet sponge layered with dark fudge cream",
    category: "Velvet",
    price: 579,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c"
  },

  // Fruit Category
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
  },
  {
    name: "Pineapple Paradise",
    description: "Juicy pineapple slices with whipped cream and maraschino cherries",
    category: "Fruit",
    price: 399,
    stockQuantity: 16,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187"
  },
  {
    name: "Blackcurrant Burst",
    description: "Tangy blackcurrant compote layered with light sponge",
    category: "Fruit",
    price: 479,
    stockQuantity: 11,
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13136"
  },
  {
    name: "Fresh Kiwi Lemon Zest",
    description: "Refreshing kiwi compote with zesty lemon sponge",
    category: "Fruit",
    price: 519,
    stockQuantity: 9,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187"
  },
  {
    name: "Mixed Berry Mousse",
    description: "Blueberry, raspberry, and strawberry mousse cake",
    category: "Fruit",
    price: 589,
    stockQuantity: 13,
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13136"
  },

  // Cheesecake Category
  {
    name: "Blueberry Cheesecake Supreme",
    description: "Baked New York style cheesecake topped with wild blueberry compote",
    category: "Cheesecake",
    price: 749,
    stockQuantity: 14,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
  },
  {
    name: "Classic New York Cheesecake",
    description: "Rich and dense baked cheesecake with graham cracker crust",
    category: "Cheesecake",
    price: 699,
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
  },
  {
    name: "Salted Caramel Cheesecake",
    description: "Creamy cheesecake drizzled with warm house-made salted caramel",
    category: "Cheesecake",
    price: 779,
    stockQuantity: 7,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
  },
  {
    name: "Mango Swirl Cheesecake",
    description: "Tropical Alphonso mango puree swirled into smooth cheesecake",
    category: "Cheesecake",
    price: 729,
    stockQuantity: 11,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
  },

  // Vanilla Category
  {
    name: "Classic Caramel Vanilla",
    description: "Soft Madagascar vanilla sponge drizzled with rich salted caramel",
    category: "Vanilla",
    price: 399,
    stockQuantity: 18,
    imageUrl: "https://images.unsplash.com/photo-1542826438-bd32f43d626f"
  },
  {
    name: "French Vanilla Bean",
    description: "Fragrant French vanilla sponge with whipped cream frosting",
    category: "Vanilla",
    price: 429,
    stockQuantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1542826438-bd32f43d626f"
  },
  {
    name: "Vanilla Butterscotch Crunch",
    description: "Vanilla sponge coated with crunchy butterscotch nuggets",
    category: "Vanilla",
    price: 459,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1542826438-bd32f43d626f"
  },

  // Specialty Category
  {
    name: "Tiramisu Espresso Delight",
    description: "Italian classic with coffee-soaked ladyfingers and mascarpone",
    category: "Specialty",
    price: 679,
    stockQuantity: 10,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
  },
  {
    name: "Pistachio Saffron Fusion",
    description: "Exotic saffron sponge layered with crushed Iranian pistachios",
    category: "Specialty",
    price: 799,
    stockQuantity: 6,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
  },
  {
    name: "Biscoff Cookie Butter Cake",
    description: "Speculoos Biscoff cookie spread layered with fluffy cake",
    category: "Specialty",
    price: 729,
    stockQuantity: 9,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
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
