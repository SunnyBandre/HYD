export type MenuItem = {
  name: string;
  price: string;
  note?: string;
  image?: any; // optional photo
};

export type Category = {
  title: string;
  items: MenuItem[];
};

export const menu: Category[] = [
  {
    title: "Breakfast",
    items: [
      { name: "Egg Omelette / Burji / Half Fry", price: "$6.99" },
      { name: "Bun Kabab", price: "$6.99" },
      { name: "Beef Nihari", price: "$13.99" },
      { name: "Hara Keema", price: "$15.99" },
      { name: "Hara Keema Ghotala", price: "$16.99" },
    ],
  },
  {
    title: "Rolls",
    items: [
      {
        name: "Egg Roll",
        price: "$6.99",
        note: "Choose paratha, naan or chapati",
      },
      { name: "Chicken Boti Roll", price: "$8.99" },
      { name: "Chicken Seekh Kabab Roll", price: "$9.99" },
      { name: "Chicken Bihari Roll", price: "$9.99" },
      { name: "Beef Seekh Kabab Roll", price: "$10.99" },
      { name: "Beef Bihari Roll", price: "$10.99" },
    ],
  },
  {
    title: "BBQ & Grill",
    items: [
      { name: "Ch. Tikka Leg", price: "$8.99" },
      { name: "Ch. Boti", price: "$10.99" },
      { name: "Ch. Malai Boti", price: "$10.99" },
      { name: "Ch. Hariyali Boti", price: "$10.99" },
      { name: "Ch. Bihari", price: "$11.99" },
      { name: "Ch. Seekh Kabab", price: "$12.99" },
      { name: "Beef Bihari", price: "$12.99" },
      { name: "Beef Seekh Kabab", price: "$13.99" },
      { name: "Fish Tilapia", price: "$12.99" },
      { name: "Fish Salmon", price: "$13.99" },
    ],
  },
  {
    title: "Biryani & Rice",
    items: [
      { name: "Plain Rice", price: "$3.99" },
      { name: "Jeera Rice", price: "$5.99" },
      { name: "Vegetarian Biryani", price: "$11.99" },
      {
        name: "Chicken Biryani",
        price: "$14.99",
        image: require("../assets/images/food/chicken-biryani.jpg"),
      },
      { name: "Goat Biryani", price: "$15.99" },
    ],
  },
  {
    title: "Desi Chai",
    items: [
      { name: "Regular Chai 8oz", price: "$2.00" },
      { name: "Regular Chai 10oz", price: "$3.00" },
      { name: "Add Gud / Ginger / Elaichi", price: "+$1.00" },
    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Water", price: "$1.99" },
      { name: "Thumbs Up", price: "$2.99" },
      { name: "Salted Chaas", price: "$3.99" },
      { name: "Sweet Lassi", price: "$3.99" },
      { name: "Mango Lassi", price: "$4.99" },
    ],
  },
  {
    title: "Desserts",
    items: [
      { name: "Gulab Jamun", price: "$5.99" },
      { name: "Carrot Halwa", price: "$5.99" },
      { name: "Laukey Halwa", price: "$6.99" },
    ],
  },
];
