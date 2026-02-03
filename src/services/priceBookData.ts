// priceBookData.ts
import type { Category } from "../types/priceBook"

export const priceBookCategories: Category[] = [
  {
    id: "flooring-installation",
    name: "Flooring Installation",
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    subCategories: [
      {
        id: "hardwood-install",
        name: "Hardwood Installation",
        image: "https://images.pexels.com/photos/11771646/pexels-photo-11771646.jpeg",
        items: [
          {
            id: "hw-install-basic",
            name: "Hardwood Install (Per Sq Ft)",
            image: "https://images.pexels.com/photos/9908376/pexels-photo-9908376.jpeg",
            price: 6.5,
          },
          {
            id: "hw-install-premium",
            name: "Premium Hardwood Install",
            image: "https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg",
            price: 8.75,
          },
        ],
      },
    ],
  },

  {
    id: "flooring-repair",
    name: "Flooring Repair",
    image: "https://images.pexels.com/photos/5691624/pexels-photo-5691624.jpeg",
    subCategories: [
      {
        id: "wood-repair",
        name: "Wood Floor Repair",
        image: "https://images.pexels.com/photos/5583129/pexels-photo-5583129.jpeg",
        items: [
          {
            id: "board-replacement",
            name: "Board Replacement",
            image: "https://images.pexels.com/photos/24902948/pexels-photo-24902948.jpeg",
            price: 120,
          },
          {
            id: "scratch-fix",
            name: "Scratch & Dent Repair",
            image: "https://images.pexels.com/photos/35091313/pexels-photo-35091313.jpeg",
            price: 75,
          },
        ],
      },
    ],
  },

  {
    id: "flooring-refinishing",
    name: "Floor Refinishing",
    image: "https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg",
    subCategories: [
      {
        id: "dustless-sanding",
        name: "Dustless Sanding",
        image: "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg",
        items: [
          {
            id: "sand-basic",
            name: "Dustless Sanding (Per Sq Ft)",
            image: "https://images.pexels.com/photos/31920408/pexels-photo-31920408.jpeg",
            price: 3.25,
          }
        ],
      },
    ],
  },

  {
    id: "vinyl-laminate",
    name: "Vinyl & Laminate Flooring",
    image: "https://images.pexels.com/photos/6585599/pexels-photo-6585599.jpeg",
    subCategories: [
      {
        id: "vinyl-install",
        name: "Vinyl Flooring",
        image: "/images/sub/vinyl.png",
        items: [
          {
            id: "vinyl-install",
            name: "Luxury Vinyl Install",
            image: "https://images.pexels.com/photos/18516403/pexels-photo-18516403.jpeg",
            price: 4.5,
          },

        ],
      },
    ],
  },

  {
    id: "tile-flooring",
    name: "Tile Flooring",
    image: "https://images.pexels.com/photos/5146920/pexels-photo-5146920.jpeg",
    subCategories: [
      {
        id: "tile-install",
        name: "Tile Installation",
        image: "/images/sub/tile.png",
        items: [
          {
            id: "tile-install-basic",
            name: "Tile Install (Per Sq Ft)",
            image: "https://images.pexels.com/photos/11806476/pexels-photo-11806476.jpeg",
            price: 7.25,
          },
          {
            id: "grout-sealing",
            name: "Grout Sealing",
            image: "https://images.pexels.com/photos/10187904/pexels-photo-10187904.jpeg",
            price: 1.5,
            stock: "out",
          },
        ],
      },
    ],
  },
]

