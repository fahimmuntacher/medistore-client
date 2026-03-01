
export type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  manufacturer: string;
  image: string;
  reviews: { rating: number }[];
};
