export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  address: string;
  paymentMethod: 'cash' | 'phonepay' | 'paytm';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}
