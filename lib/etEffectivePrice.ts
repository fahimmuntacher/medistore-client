type MedicineLike = {
  price: number
  discountPrice?: number
}

export function getEffectivePrice(medicine: MedicineLike) {
  // console.log(medicine.price);
  // if (
  //   medicine.discountPrice &&
  //   medicine.discountPrice > 0 &&
  //   medicine.discountPrice < medicine.price
  // ) {
  //   return medicine.discountPrice
  // }
  return medicine.price
}
