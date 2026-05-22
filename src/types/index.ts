export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  structuredAddress?: StructuredAddress;
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
  structuredAddress?: StructuredAddress;
  paymentMethod: 'cash' | 'phonepay' | 'paytm';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface RatingImage {
  uri: string;
  uploadedUrl?: string;
  uploading: boolean;
  error?: string;
}

export interface ProductRating {
  id: string;
  productId: string;
  stars: number;
  reviewText: string;
  images: RatingImage[];
  createdAt: Date;
  submitting: boolean;
  submitted: boolean;
}

export interface MockUploadResponse {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface StructuredAddress {
  country: string;
  city: string;
  street: string;
  coordinates: LocationCoordinates;
  label?: string;
}

export interface Country {
  code: string;
  name: string;
  cities: string[];
}
