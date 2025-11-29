import { Category, Product, Basket } from './types';

export const BOUQUET_PRICES = {
  NENHUM: 0,
  PEQUENO: 45.00,
  GRANDE: 90.00
};

export const STANDARD_BASKET_PRICE = 129.90;

export const PRODUCTS: Product[] = [
  // Chocolates
  { id: 'c1', name: 'Caixa Bombons Finos', brand: 'Lindt', price: 69.90, category: Category.CHOCOLATE, image: 'https://images.unsplash.com/photo-1620980776848-8531bacde684?auto=format&fit=crop&q=80&w=300' },
  { id: 'c2', name: 'Kit Kat & Trento (Kit)', brand: 'Nestlé/Peccin', price: 28.00, category: Category.CHOCOLATE, image: 'https://images.unsplash.com/photo-1623066348421-a1e48eb27f12?auto=format&fit=crop&q=80&w=300' },
  { id: 'c3', name: 'Ferrero Rocher Box', brand: 'Ferrero', price: 39.90, category: Category.CHOCOLATE, image: 'https://images.unsplash.com/photo-1548133547-a8a29367eb78?auto=format&fit=crop&q=80&w=300' },
  { id: 'c4', name: 'Coração de Trufas', brand: 'Kopenhagen', price: 55.00, category: Category.CHOCOLATE, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=300' },

  // Wines & Drinks
  { id: 'w1', name: 'Vinho Tinto Suave', brand: 'Pergola', price: 45.00, category: Category.WINE, image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=300' },
  { id: 'w2', name: 'Espumante Rosé', brand: 'Chandon', price: 110.00, category: Category.WINE, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=300' },
  { id: 'w3', name: 'Coca-Cola Garrafa Vidro', brand: 'Coca-Cola', price: 12.00, category: Category.WINE, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300' },

  // Cosmetics & Make
  { id: 'k1', name: 'Kit Spa & Banho', brand: 'Natura', price: 89.90, category: Category.COSMETIC, image: 'https://images.unsplash.com/photo-1556228552-523de5147bb6?auto=format&fit=crop&q=80&w=300' },
  { id: 'k2', name: 'Batom & Gloss', brand: 'MAC', price: 99.00, category: Category.COSMETIC, image: 'https://images.unsplash.com/photo-1631214548051-eb24177579bb?auto=format&fit=crop&q=80&w=300' },
  { id: 'k3', name: 'Paleta Sombras Nude', brand: 'O Boticário', price: 129.90, category: Category.COSMETIC, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=300' },

  // Lingerie
  { id: 'l1', name: 'Conjunto Renda Sexy', brand: 'Romance', price: 129.90, category: Category.LINGERIE, image: 'https://images.unsplash.com/photo-1632299863773-f1dfb3935294?auto=format&fit=crop&q=80&w=300' },
  { id: 'l2', name: 'Body Rendado', brand: 'Intimissimi', price: 180.00, category: Category.LINGERIE, image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=300' },
  { id: 'l3', name: 'Camisola de Seda', brand: 'Valisere', price: 140.00, category: Category.LINGERIE, image: 'https://images.unsplash.com/photo-1583209814683-c91e44a947d2?auto=format&fit=crop&q=80&w=300' },

  // Extras
  { id: 'e1', name: 'Balão Coração Metalizado', brand: 'Festas', price: 25.00, category: Category.EXTRAS, image: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=300' },
  { id: 'e2', name: 'Pelúcia Stitch/Urso', brand: 'Disney/Gen', price: 79.90, category: Category.EXTRAS, image: 'https://images.unsplash.com/photo-1598528859737-234b67664741?auto=format&fit=crop&q=80&w=300' },
  { id: 'e3', name: 'Varal de Fotos Polaroid', brand: 'Personalizado', price: 35.00, category: Category.EXTRAS, image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=300' },
];