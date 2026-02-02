export function getEffectivePrice(medicine: {
  price: number;
  discountPrice?: number;
}) {
  return medicine.discountPrice && medicine.discountPrice < medicine.price
    ? medicine.discountPrice
    : medicine.price;
}