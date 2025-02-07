 export interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
  date: string;
}

export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  rating: number;
  Reviews: Review[]; 
  colors: string[],
  sizes: string[],
  stock: number,
  tag: string[];
  discount?: number;
  originalPrice?: number;
}

export const productData:Product[]  = [
  {
    id: 1,
    imageUrl: "/NewArrival/img1.png",
    name: "T-SHIRT WITH TAPE DETAILS",
    price: 120,
    rating: 4.5,
    Reviews: [
      {
        id: 0,
        rating: 4.5,
        name: "Samantha D.",
        review: `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
        date: "14-05-2023"
      },
      {
        id: 1,
        rating: 5,
        name: "Alex M.",
        review: `"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."`,
        date: "15-05-2023"
      },
      {
        id: 2,
        rating: 4.5,
        name: "Ethan R.",
        review: `"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt."`,
        date: "16-05-2023"
      },
      {
        id: 3,
        rating: 5,
        name: "Olivia P.",
        review: `"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out."`,
        date: "17-05-2023"
      },
      {
        id: 4,
        rating: 5,
        name: "Liam K.",
        review: `"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion."`,
        date: "18-05-2023"
      },
      {
        id: 5,
        rating: 4.5,
        name: "Ava H.",
        review: `"I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter."`,
        date: "19-05-2023"
      },
    ],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["New Arrival", "Men"],
  },
  {
    id: 2,
    discount: 20,
    imageUrl: "/NewArrival/img2.png",
    name: "SKINNY FIT JEANS",
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    Reviews: [
      {
        id: 0,
        rating: 4.5,
        name: "Samantha D.",
        review: `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
        date: "14-05-2023"
      },
      {
        id: 1,
        rating: 5,
        name: "Alex M.",
        review: `"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."`,
        date: "15-05-2023"
      },
    ],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["New Arrival", "Men"],
  },
  {
    id: 3,
    imageUrl: "/NewArrival/img3.png",
    name: "CHECKERED SHIRT",
    price: 180,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["New Arrival", "Men"],
  },
  {
    id: 4,
    discount: 30,
    imageUrl: "/NewArrival/img4.png",
    name: "SLEEVE STRIPED T-SHIRT",
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["New Arrival", "Men"],
  },
  {
    id: 5,
    discount: 20,
    imageUrl: "/TopSelling/img1.png",
    name: "VERTICAL STRIPED SHIRT",
    price: 212,
    originalPrice: 232,
    rating: 5.0,
    Reviews: [
      {
        id: 0,
        rating: 4.5,
        name: "Samantha D.",
        review: `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
        date: "14-05-2023"
      },
      {
        id: 1,
        rating: 5,
        name: "Alex M.",
        review: `"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."`,
        date: "15-05-2023"
      },
    ],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Top Selling", "Men"],
  },
  {
    id: 6,
    imageUrl: "/TopSelling/img2.png",
    name: "COURAGE GRAPHIC T-SHIRT",
    price: 145,
    rating: 4.0,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Top Selling", "Men"],
  },
  {
    id: 7,
    imageUrl: "/TopSelling/img3.png",
    name: "LOOSE FIT BERMUDA SHORTS",
    price: 80,
    rating: 3.0,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Top Selling", "Men"],
  },
  {
    id: 8,
    imageUrl: "/TopSelling/img4.png",
    name: "FADED SKINNY JEANS",
    price: 210,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Top Selling", "Men"],
  },
  {
    id: 9,
    imageUrl: "/suggestion/img2.png",
    name: "Gradient Graphic T-shirt",
    price: 145,
    rating: 3.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 10,
    imageUrl: "/suggestion/img3.png",
    name: "Polo with Tipping Details",
    price: 180,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 11,
    discount: 30,
    imageUrl: "/suggestion/img4.png",
    name: "Black Striped T-shirt",
    price: 120,
    originalPrice: 150,
    rating: 5.0,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 12,
    discount: 20,
    imageUrl: "/NewArrival/img2.png",
    name: "SKINNY FIT JEANS",
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 13,
    imageUrl: "/NewArrival/img3.png",
    name: "CHECKERED SHIRT",
    price: 180,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 14,
    discount: 30,
    imageUrl: "/NewArrival/img4.png",
    name: "SLEEVE STRIPED T-SHIRT",
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 15,
    discount: 20,
    imageUrl: "/TopSelling/img1.png",
    name: "VERTICAL STRIPED SHIRT",
    price: 212,
    originalPrice: 232,
    rating: 5.0,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 15,
    imageUrl: "/TopSelling/img2.png",
    name: "COURAGE GRAPHIC T-SHIRT",
    price: 145,
    rating: 4.0,
    Reviews: [],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men"],
  },
  {
    id: 16,
    imageUrl: "/TopSelling/img3.png",
    name: "LOOSE FIT BERMUDA SHORTS",
    price: 80,
    rating: 3.0,
    Reviews: [],

    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    tag: ["Casual", "Men", "Gym"],
  },

];