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
      {
        name: "Egg Omelette / Burji / Half Fry",
        price: "$6.99",
        image: require("../assets/images/food/egg-omelette.webp"),
      },
      {
        name: "Bun Kabab",
        price: "$6.99",
        image: require("../assets/images/food/bun-kabab.webp"),
      },
      {
        name: "Beef Nihari",
        price: "$13.99",
        image: require("../assets/images/food/beef-nihari.webp"),
      },
      {
        name: "Hara Keema",
        price: "$15.99",
        image: require("../assets/images/food/hara-keema.webp"),
      },
      {
        name: "Hara Keema Ghotala",
        price: "$16.99",
        image: require("../assets/images/food/hara-keema-ghotala.webp"),
      },
    ],
  },
  {
    title: "Rolls",
    items: [
      {
        name: "Egg Roll",
        price: "$6.99",
        note: "Choose paratha, naan or chapati",
        image: require("../assets/images/food/egg-roll.webp"),
      },
      {
        name: "Chicken Boti Roll",
        price: "$8.99",
        image: require("../assets/images/food/chicken-boti-roll.webp"),
      },
      {
        name: "Chicken Seekh Kabab Roll",
        price: "$9.99",
        image: require("../assets/images/food/chicken-seekh-kabab-roll.webp"),
      },
      {
        name: "Chicken Bihari Roll",
        price: "$9.99",
        image: require("../assets/images/food/chicken-bihari-roll.webp"),
      },
      {
        name: "Beef Seekh Kabab Roll",
        price: "$10.99",
        image: require("../assets/images/food/beef-seekh-kabab-roll.webp"),
      },
      {
        name: "Beef Bihari Roll",
        price: "$10.99",
        image: require("../assets/images/food/beef-bihari-roll.webp"),
      },
    ],
  },
  {
    title: "BBQ & Grill",
    items: [
      {
        name: "Ch. Tikka Leg",
        price: "$8.99",
        image: require("../assets/images/food/ch-tikka-leg.webp"),
      },
      {
        name: "Ch. Boti",
        price: "$10.99",
        image: require("../assets/images/food/ch-boti.webp"),
      },
      {
        name: "Ch. Malai Boti",
        price: "$10.99",
        image: require("../assets/images/food/ch-malai-boti.webp"),
      },
      {
        name: "Ch. Hariyali Boti",
        price: "$10.99",
        image: require("../assets/images/food/ch-hariyali-boti.webp"),
      },
      {
        name: "Ch. Bihari",
        price: "$11.99",
        image: require("../assets/images/food/ch-bihari.webp"),
      },
      {
        name: "Ch. Seekh Kabab",
        price: "$12.99",
        image: require("../assets/images/food/ch-seekh-kabab.webp"),
      },
      {
        name: "Beef Bihari",
        price: "$12.99",
        image: require("../assets/images/food/beef-bihari.webp"),
      },
      {
        name: "Beef Seekh Kabab",
        price: "$13.99",
        image: require("../assets/images/food/beef-seekh-kabab.webp"),
      },
      {
        name: "Fish Tilapia",
        price: "$12.99",
        image: require("../assets/images/food/fish-tilapia.webp"),
      },
      {
        name: "Fish Salmon",
        price: "$13.99",
        image: require("../assets/images/food/fish-salmon.webp"),
      },
    ],
  },
  {
    title: "Biryani & Rice",
    items: [
      {
        name: "Plain Rice",
        price: "$3.99",
        image: require("../assets/images/food/plain-rice.webp"),
      },
      {
        name: "Jeera Rice",
        price: "$5.99",
        image: require("../assets/images/food/jeera-rice.webp"),
      },
      {
        name: "Vegetarian Biryani",
        price: "$11.99",
        image: require("../assets/images/food/vegetarian-biryani.webp"),
      },
      {
        name: "Chicken Biryani",
        price: "$14.99",
        image: require("../assets/images/food/chicken-biryani.webp"),
      },
      {
        name: "Goat Biryani",
        price: "$15.99",
        image: require("../assets/images/food/goat-biryani.webp"),
      },
    ],
  },
  {
    title: "Desi Chai",
    items: [
      {
        name: "Regular Chai 8oz",
        price: "$2.00",
        image: require("../assets/images/food/regular-chai.webp"),
      },
      {
        name: "Regular Chai 10oz",
        price: "$3.00",
        image: require("../assets/images/food/regular-chai.webp"),
      },
      {
        name: "Add Gud / Ginger / Elaichi",
        price: "+$1.00",
        image: require("../assets/images/food/mixed-chai.webp"),
      },
    ],
  },
  {
    title: "Drinks",
    items: [
      {
        name: "Water",
        price: "$1.99",
        image: require("../assets/images/food/water.webp"),
      },
      {
        name: "Thumbs Up",
        price: "$2.99",
        image: require("../assets/images/food/thumbs-up.webp"),
      },
      {
        name: "Salted Chaas",
        price: "$3.99",
        image: require("../assets/images/food/salted-chaas.webp"),
      },
      {
        name: "Sweet Lassi",
        price: "$3.99",
        image: require("../assets/images/food/sweet-lassi.webp"),
      },
      {
        name: "Mango Lassi",
        price: "$4.99",
        image: require("../assets/images/food/mango-lassi.webp"),
      },
    ],
  },
  {
    title: "Desserts",
    items: [
      {
        name: "Gulab Jamun",
        price: "$5.99",
        image: require("../assets/images/food/gulab-jamun.webp"),
      },
      {
        name: "Carrot Halwa",
        price: "$5.99",
        image: require("../assets/images/food/carrot-halwa.webp"),
      },
      {
        name: "Laukey Halwa",
        price: "$6.99",
        image: require("../assets/images/food/laukey-halwa.webp"),
      },
    ],
  },
];