export enum Category {
  CHOCOLATE = 'Chocolates & Doces',
  WINE = 'Vinhos & Bebidas',
  COSMETIC = 'Cosméticos & Maquiagem',
  LINGERIE = 'Lingerie & Moda Íntima',
  EXTRAS = 'Fotos, Ímãs & Pelúcias',
}

export type BasketColor = 'VERMELHO' | 'VERDE' | 'LILAS';
export type BouquetSize = 'NENHUM' | 'PEQUENO' | 'GRANDE';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  description?: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface CustomOptions {
  selectedColor?: BasketColor;
  bouquetSize: BouquetSize;
  observation?: string;
}

export interface Basket {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Preço base da cesta vazia ou do pacote padrão
  items: BasketItem[];
  isCustomizable: boolean;
  image: string;
  message?: string;
  options?: CustomOptions;
}

export interface CartItem {
  basket: Basket;
  quantity: number;
}