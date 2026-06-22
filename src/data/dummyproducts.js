import riceImg from "../Assests/Rice.jpg";
import wheatImg from "../Assests/Wheat.jpg";
import sugarImg from "../Assests/Sugar.jpg";

const products = [
  {
    id: 1,
    name: "Rice",
    category: "Grains",
    stock: 10,
    price: 50,
    status: "Active",
    image: riceImg,
  },
  {
    id: 2,
    name: "Wheat",
    category: "Grains",
    stock: 3,
    price: 40,
    status: "Low Stock",
    image: wheatImg,
  },
  {
    id: 3,
    name: "Sugar",
    category: "Food",
    stock: 0,
    price: 60,
    status: "Out of Stock",
    image: sugarImg,
  },
];

export default products;
