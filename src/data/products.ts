export interface Product {
  id: number;
  name: string;
  stock: number;
}

export const initialProducts: Product[] = [
  { id: 1, name: "Teclado", stock: 10 },
  { id: 2, name: "Mouse", stock: 5 },
  { id: 3, name: "Monitor", stock: 2 },
];

export const LOW_STOCK_THRESHOLD = 5;
