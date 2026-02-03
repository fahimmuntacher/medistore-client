export interface IOrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  medicine: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  createdAt: string | Date;
}

export interface IOrder {
  id: string;
  customerId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress; 
  createdAt: string | Date;
  updatedAt: string | Date;
}

export enum OrderStatus {
  PLACED = "PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  details : string
}
