export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  isDiscount: boolean;
  image: string;
  category: string;
  brand: string;
  stock: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  date: string;
}
