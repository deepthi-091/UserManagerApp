import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Product, CartItem, ProductRating } from '@/types';

interface AppContextType {
  users: User[];
  products: Product[];
  cart: CartItem[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  ratings: ProductRating[];
  addRating: (rating: Omit<ProductRating, 'id' | 'createdAt' | 'submitting' | 'submitted'>) => string;
  updateRating: (id: string, updates: Partial<ProductRating>) => void;
  getRatingsForProduct: (productId: string) => ProductRating[];
  getAverageRating: (productId: string) => number | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High performance laptop for work and gaming',
    price: 89999,
    image: '💻',
    stock: 10,
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 45999,
    image: '📱',
    stock: 20,
  },
  {
    id: '3',
    name: 'Headphones',
    description: 'Wireless headphones with noise cancellation',
    price: 8999,
    image: '🎧',
    stock: 30,
  },
  {
    id: '4',
    name: 'Tablet',
    description: 'Portable tablet for reading and browsing',
    price: 35999,
    image: '📘',
    stock: 15,
  },
  {
    id: '5',
    name: 'Smart Watch',
    description: 'Wearable smartwatch with fitness tracking',
    price: 12999,
    image: '⌚',
    stock: 25,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main St, City',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      address: '456 Oak Ave, Town',
      createdAt: new Date(),
    },
  ]);

  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ratings, setRatings] = useState<ProductRating[]>([]);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const addRating = useCallback(
    (rating: Omit<ProductRating, 'id' | 'createdAt' | 'submitting' | 'submitted'>) => {
      const id = Date.now().toString();
      const newRating: ProductRating = {
        ...rating,
        id,
        createdAt: new Date(),
        submitting: false,
        submitted: false,
      };
      setRatings((prev) => [newRating, ...prev]);
      return id;
    },
    []
  );

  const updateRating = useCallback((id: string, updates: Partial<ProductRating>) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const getRatingsForProduct = useCallback(
    (productId: string) => ratings.filter((r) => r.productId === productId),
    [ratings]
  );

  const getAverageRating = useCallback(
    (productId: string): number | null => {
      const relevant = ratings.filter((r) => r.productId === productId && r.submitted);
      if (relevant.length === 0) return null;
      return relevant.reduce((sum, r) => sum + r.stars, 0) / relevant.length;
    },
    [ratings]
  );

  return (
    <AppContext.Provider
      value={{
        users,
        products,
        cart,
        addUser,
        updateUser,
        deleteUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        ratings,
        addRating,
        updateRating,
        getRatingsForProduct,
        getAverageRating,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
