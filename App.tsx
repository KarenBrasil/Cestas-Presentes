import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, BOUQUET_PRICES, STANDARD_BASKET_PRICE } from './constants';
import { Basket, Product, Category, BasketItem, CartItem, BasketColor, BouquetSize } from './types';
import MessageGenerator from './components/MessageGenerator';

type View = 'HOME' | 'STANDARD_CONFIG' | 'CUSTOM_BUILDER' | 'CHECKOUT' | 'SUCCESS';

function App() {
  const [view, setView] = useState<View>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderObservation, setOrderObservation] = useState('');
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // --- Standard Basket State ---
  const [stdColor, setStdColor] = useState<BasketColor>('VERMELHO');
  const [stdBouquet, setStdBouquet] = useState<BouquetSize>('NENHUM');
  const [stdMessage, setStdMessage] = useState('');

  // --- Custom Builder State ---
  const [customBasketItems, setCustomBasketItems] = useState<BasketItem[]>([]);
  const [customBasketMessage, setCustomBasketMessage] = useState('');
  const [customBouquet, setCustomBouquet] = useState<BouquetSize>('NENHUM');
  
  const categories = Object.values(Category);
  
  const whatsappNumber = "5585998370928";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de tirar uma dúvida sobre as Cestas & Mimos.");

  // --- FAQ State ---
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    { question: "Qual o prazo de entrega?", answer: "Entregamos no mesmo dia para pedidos feitos até as 14h. Para pedidos após esse horário, a entrega é no dia seguinte pela manhã." },
    { question: "Posso escolher a data e horário?", answer: "Sim! Na finalização do pedido, você pode colocar nas observações a data e turno de preferência." },
    { question: "Quais as formas de pagamento?", answer: "Aceitamos Pix, Cartão de Crédito e Débito no momento da entrega ou link de pagamento." },
    { question: "As cestas já vêm embaladas?", answer: "Sim, todas as cestas vão em embalagem de luxo com laço de cetim e cartão personalizado." }
  ];

  // --- Logic ---

  const calculateBasketTotal = (basket: Basket) => {
    let total = basket.basePrice;
    if (basket.isCustomizable) {
      total += basket.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }
    if (basket.options?.bouquetSize) {
      total += BOUQUET_PRICES[basket.options.bouquetSize];
    }
    return total;
  };

  const addToCart = (basket: Basket) => {
    setCart(prev => [...prev, { basket, quantity: 1 }]);
  };

  const removeFromCart = (basketId: string) => {
    setCart(prev => prev.filter(i => i.basket.id !== basketId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + (calculateBasketTotal(item.basket) * item.quantity);
    }, 0);
  }, [cart]);

  // Handlers
  const handleAddCustomProduct = (product: Product) => {
    setCustomBasketItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveCustomProduct = (productId: string) => {
    setCustomBasketItems(prev => {
      const existing = prev.find(i => i.product.id === productId);
      if (existing && existing.quantity > 1) {
         return prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const finishCustomBasket = () => {
    if (customBasketItems.length === 0) return;
    
    const newBasket: Basket = {
      id: `custom-${Date.now()}`,
      name: 'Minha Cesta Personalizada',
      description: 'Cesta exclusiva montada com seus itens favoritos.',
      basePrice: 0,
      items: customBasketItems,
      isCustomizable: true,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
      message: customBasketMessage,
      options: { bouquetSize: customBouquet }
    };

    addToCart(newBasket);
    setCustomBasketItems([]);
    setCustomBasketMessage('');
    setCustomBouquet('NENHUM');
    setView('CHECKOUT');
  };

  const finishStandardBasket = () => {
    let colorName = '';
    if (stdColor === 'VERMELHO') colorName = 'Paixão (Vermelho)';
    else if (stdColor === 'VERDE') colorName = 'Esperança (Verde)';
    else colorName = 'Carinho (Lilás)';

    const newBasket: Basket = {
      id: `std-${Date.now()}`,
      name: `Cesta Surpresa de Doces - ${colorName}`,
      description: `Seleção especial de doces na cor ${stdColor.toLowerCase()}.`,
      basePrice: STANDARD_BASKET_PRICE, 
      items: [], 
      isCustomizable: false,
      image: 'https://images.unsplash.com/photo-1621406833973-7e4499097e3f?auto=format&fit=crop&q=80&w=400',
      message: stdMessage,
      options: { selectedColor: stdColor, bouquetSize: stdBouquet }
    };

    addToCart(newBasket);
    setStdColor('VERMELHO');
    setStdBouquet('NENHUM');
    setStdMessage('');
    setView('CHECKOUT');
  }

  // --- Components Helpers ---

  const BouquetSelector = ({ 
    selected, 
    onSelect 
  }: { 
    selected: BouquetSize, 
    onSelect: (s: BouquetSize) => void 
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div 
        onClick={() => onSelect('NENHUM')}
        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition-all 
          ${selected === 'NENHUM' 
            ? 'border-romance-500 bg-romance-50 dark:bg-romance-900/30 dark:border-romance-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-romance-300 dark:bg-dark-card'}`}
      >
        <span className="text-2xl mb-2">🍃</span>
        <span className="font-bold text-gray-700 dark:text-gray-200">Sem Flores</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Apenas a cesta</span>
      </div>
      <div 
        onClick={() => onSelect('PEQUENO')}
        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition-all 
          ${selected === 'PEQUENO' 
            ? 'border-romance-500 bg-romance-50 dark:bg-romance-900/30 dark:border-romance-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-romance-300 dark:bg-dark-card'}`}
      >
        <span className="text-2xl mb-2">💐</span>
        <span className="font-bold text-gray-700 dark:text-gray-200">Buquê Pequeno</span>
        <span className="text-sm text-romance-600 dark:text-romance-400 font-bold">+ R$ {BOUQUET_PRICES.PEQUENO},00</span>
      </div>
      <div 
        onClick={() => onSelect('GRANDE')}
        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition-all 
          ${selected === 'GRANDE' 
            ? 'border-romance-500 bg-romance-50 dark:bg-romance-900/30 dark:border-romance-500' 
            : 'border-gray-200 dark:border-gray-700 hover:border-romance-300 dark:bg-dark-card'}`}
      >
        <span className="text-2xl mb-2">🌹</span>
        <span className="font-bold text-gray-700 dark:text-gray-200">Buquê Grande</span>
        <span className="text-sm text-romance-600 dark:text-romance-400 font-bold">+ R$ {BOUQUET_PRICES.GRANDE},00</span>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-white dark:bg-dark-card border-t border-romance-200 dark:border-gray-800 mt-12 py-10 px-6 transition-colors">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-romance-800 dark:text-romance-400 mb-4">Cestas & Mimos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Transformando sentimentos em presentes inesquecíveis. Entregamos amor em forma de cestas personalizadas.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-4">Contato</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-romance-500">📍</span> Rua das Flores, 123 - Fortaleza/CE
            </li>
            <li className="flex items-center gap-2">
              <span className="text-romance-500">📞</span> (85) 99837-0928
            </li>
            <li className="flex items-center gap-2">
              <span className="text-romance-500">✉️</span> contato@cestasemimos.com
            </li>
          </ul>
        </div>
        <div>
           <h4 className="font-bold text-gray-800 dark:text-white mb-4">Links Úteis</h4>
           <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
             <li><button onClick={() => setView('HOME')} className="hover:text-romance-600">Início</button></li>
             <li><button onClick={() => setView('STANDARD_CONFIG')} className="hover:text-romance-600">Cestas Prontas</button></li>
             <li><button onClick={() => setView('CUSTOM_BUILDER')} className="hover:text-romance-600">Monte a Sua</button></li>
           </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 text-center text-xs text-gray-400">
        © 2024 Cestas & Mimos. Todos os direitos reservados.
      </div>
    </footer>
  );

  const renderFAQ = () => (
    <div className="max-w-3xl mx-auto px-4 mt-16 mb-8">
      <h3 className="text-2xl font-serif font-bold text-center text-gray-800 dark:text-white mb-8">
        Dúvidas Frequentes
      </h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
            <button 
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <span className="font-semibold text-gray-800 dark:text-gray-200">{faq.question}</span>
              <span className={`transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''} text-romance-500`}>
                ▼
              </span>
            </button>
            <div 
              className={`px-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-romance-600 dark:text-romance-400 font-semibold hover:underline"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02C17.18 3.03 14.69 2 12.04 2zM12.05 19.34c-1.49 0-2.95-.39-4.24-1.16l-.3-.18-3.15.83.84-3.07-.19-.31c-.82-1.33-1.25-2.88-1.25-4.47 0-4.63 3.77-8.4 8.4-8.4 2.24 0 4.4 1.13 5.98 2.71 1.59 1.59 2.47 3.7 2.47 5.95 0 4.63-3.76 8.39-8.39 8.39l.03-.29zm4.61-6.28c-.25-.13-1.5-.74-1.73-.83-.23-.09-.39-.13-.56.13-.17.25-.67.83-.82 1-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.1-.51.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.32-.02-.45-.06-.13-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.02 2.58c.13.16 1.77 2.7 4.28 3.79.6.26 1.06.41 1.42.53.6.19 1.15.16 1.59.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.22-.16-.47-.28z"/></svg>
          Ainda tenho dúvidas, falar no WhatsApp
        </a>
      </div>
    </div>
  );

  // --- Render Sections ---

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm shadow-sm border-b border-romance-100 dark:border-gray-800 py-4 px-6 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('HOME')}>
        <div className="bg-gradient-to-br from-romance-400 to-romance-600 text-white p-2 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-romance-800 dark:text-romance-400 tracking-tight">Cestas & Mimos</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Alternar Tema"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {view !== 'CHECKOUT' && view !== 'SUCCESS' && (
          <button 
            onClick={() => cart.length > 0 && setView('CHECKOUT')}
            className="relative group bg-white dark:bg-dark-card border border-romance-200 dark:border-gray-700 p-2 rounded-full hover:bg-romance-50 dark:hover:bg-gray-800 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-romance-500 group-hover:text-romance-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-romance-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="pb-10">
      {/* Hero */}
      <div className="relative bg-romance-100 dark:bg-gray-900 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pb-16 transition-colors">
        <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1600" 
            alt="Fundo romantico" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-romance-100 dark:from-dark-bg via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-4 mt-8">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-romance-900 dark:text-romance-300 mb-4 drop-shadow-sm tracking-tight">Surpreenda quem você ama</h2>
          <p className="text-lg text-romance-800 dark:text-gray-300 font-light max-w-2xl mx-auto mb-8">
            Cestas exclusivas com chocolates, vinhos e flores. Entregamos amor e carinho em cada detalhe.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={() => setView('STANDARD_CONFIG')}
                className="bg-romance-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-romance-700 hover:scale-105 transition flex items-center justify-center gap-2"
             >
                <span>🎁</span> Pronta Entrega
             </button>
             <button 
                onClick={() => setView('CUSTOM_BUILDER')}
                className="bg-white dark:bg-dark-card text-romance-600 dark:text-romance-400 border border-romance-300 dark:border-gray-600 px-8 py-3 rounded-full font-bold shadow-md hover:bg-romance-50 dark:hover:bg-gray-800 hover:scale-105 transition flex items-center justify-center gap-2"
             >
                <span>✨</span> Quero Montar
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Opção 1: Padrão */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden transform transition hover:-translate-y-1 hover:shadow-2xl dark:border dark:border-gray-800">
            <div className="h-72 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1576402401666-41f234399b59?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Cesta Padrão com Balão" />
              <div className="absolute top-4 right-4 bg-romance-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                Favorita
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                 <p className="text-white font-serif italic text-lg">Com balão de coração incluso</p>
              </div>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2">Cesta Surpresa Clássica</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-light">
                A escolha perfeita sem complicações. Doces selecionados, balão metalizado e cores temáticas (Vermelho, Verde ou Lilás).
              </p>
              <div className="text-2xl font-bold text-romance-600 dark:text-romance-400 mb-6">
                R$ {STANDARD_BASKET_PRICE.toFixed(2).replace('.',',')}
              </div>
              <button 
                onClick={() => setView('STANDARD_CONFIG')}
                className="w-full bg-romance-600 text-white py-3 rounded-xl font-bold hover:bg-romance-700 transition shadow-lg"
              >
                Personalizar Cor e Buquê
              </button>
            </div>
          </div>

          {/* Opção 2: Personalizada */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden transform transition hover:-translate-y-1 hover:shadow-2xl border-2 border-romance-200 dark:border-gray-700 border-dashed">
            <div className="h-72 overflow-hidden bg-romance-50 dark:bg-gray-800 relative">
               <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Personalizar Itens" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition">
                  <span className="bg-white/95 text-romance-800 px-6 py-2 rounded-full font-bold shadow-lg font-serif tracking-wide">Lingerie • Vinhos • Make</span>
               </div>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2">Monte do Seu Jeito</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-light">
                Liberdade total para criar. Escolha item por item: chocolates de luxo, lingerie, vinhos, pelúcias e maquiagem.
              </p>
              <div className="text-2xl font-bold text-romance-600 dark:text-romance-400 mb-6">
                Orçamento Livre
              </div>
              <button 
                onClick={() => setView('CUSTOM_BUILDER')}
                className="w-full bg-transparent text-romance-600 dark:text-romance-400 border-2 border-romance-600 dark:border-romance-400 py-3 rounded-xl font-bold hover:bg-romance-50 dark:hover:bg-gray-800 transition"
              >
                Começar a Montar
              </button>
            </div>
          </div>

        </div>

        {/* Info Icons */}
        <div className="mt-16 text-center grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800 dark:text-white">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-4 text-3xl">🚀</div>
                <h4 className="font-bold">Entrega Rápida</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Seu presente chega rapidinho</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-4 text-3xl">✨</div>
                <h4 className="font-bold">Qualidade Premium</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Marcas originais e selecionadas</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-4 text-3xl">💌</div>
                <h4 className="font-bold">Feito com Amor</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cada detalhe pensado para emocionar</p>
            </div>
        </div>

        {/* FAQ Section */}
        {renderFAQ()}

      </div>
      <Footer />
    </div>
  );

  const renderStandardConfig = () => (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-3xl mx-auto px-4 py-8 flex-grow">
        <button onClick={() => setView('HOME')} className="text-romance-600 dark:text-romance-400 font-medium mb-6 flex items-center gap-1 hover:underline">
          ← Voltar
        </button>

        <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white mb-2">Configure sua Cesta Surpresa</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Personalize os detalhes da sua cesta clássica.</p>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">1. Escolha a Cor do Tema</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">A cor define o laço, o balão e os detalhes da decoração.</p>
          <div className="grid grid-cols-3 gap-4">
              {['VERMELHO', 'VERDE', 'LILAS'].map((color) => (
                  <button
                      key={color}
                      onClick={() => setStdColor(color as BasketColor)}
                      className={`relative overflow-hidden h-32 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all group ${
                          stdColor === color 
                          ? 'border-gray-800 dark:border-white shadow-md scale-105 z-10' 
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                  >
                      {/* Background color imitation */}
                      <div className={`absolute inset-0 opacity-20 ${
                         color === 'VERMELHO' ? 'bg-red-500' : color === 'VERDE' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      
                      <div 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md z-10"
                          style={{ 
                              backgroundColor: color === 'VERMELHO' ? '#ef4444' : color === 'VERDE' ? '#22c55e' : '#a855f7' 
                          }}
                      ></div>
                      <span className="font-bold text-gray-800 dark:text-white z-10 font-serif text-lg drop-shadow-sm">
                          {color === 'VERMELHO' ? 'Paixão' : color === 'VERDE' ? 'Esperança' : 'Carinho'}
                      </span>
                  </button>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">2. Deseja adicionar flores?</h3>
          <BouquetSelector selected={stdBouquet} onSelect={setStdBouquet} />
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">3. Mensagem Especial</h3>
          <MessageGenerator 
              currentMessage={stdMessage}
              onMessageSelect={setStdMessage}
          />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-dark-card border-t dark:border-gray-800 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex justify-between items-center z-40 transition-colors">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Estimado</p>
          <p className="text-2xl font-bold text-romance-600 dark:text-romance-400">
            R$ {(STANDARD_BASKET_PRICE + BOUQUET_PRICES[stdBouquet]).toFixed(2).replace('.',',')}
          </p>
        </div>
        <button 
          onClick={finishStandardBasket}
          className="bg-romance-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-romance-700 shadow-lg transition transform hover:scale-105"
        >
          Adicionar ao Pedido
        </button>
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-8 flex-grow pb-32">
        <button onClick={() => setView('HOME')} className="text-romance-600 dark:text-romance-400 font-medium mb-6 flex items-center gap-1 hover:underline">
          ← Voltar
        </button>

        <div className="mb-8 border border-romance-300 dark:border-romance-700 rounded-2xl p-6 bg-white dark:bg-dark-card shadow-sm">
          <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white mb-2">Monte sua Cesta</h2>
          <p className="text-gray-500 dark:text-gray-400">Navegue pelas categorias e selecione seus itens favoritos.</p>
        </div>

        <div className="space-y-10">
          {categories.map(category => {
            const products = PRODUCTS.filter(p => p.category === category);
            if (products.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white mb-4 border-b border-romance-200 dark:border-gray-700 pb-2 inline-block px-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map(product => {
                    const inBasket = customBasketItems.find(i => i.product.id === product.id);
                    const qty = inBasket ? inBasket.quantity : 0;

                    return (
                      <div key={product.id} className="bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-50 dark:border-gray-800 group">
                        <div className="h-48 overflow-hidden relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          {qty > 0 && (
                             <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                 {qty} no cesto
                             </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2 h-12">
                               <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{product.name}</h4>
                               <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full whitespace-nowrap ml-2 h-fit">{product.brand}</span>
                          </div>
                          <div className="flex justify-between items-end">
                              <p className="text-lg font-bold text-romance-600 dark:text-romance-400">R$ {product.price.toFixed(2).replace('.',',')}</p>
                              
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                  {qty > 0 ? (
                                  <>
                                      <button onClick={() => handleRemoveCustomProduct(product.id)} className="w-7 h-7 bg-white dark:bg-gray-700 text-gray-600 dark:text-white rounded-md shadow-sm flex items-center justify-center text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/30">-</button>
                                      <span className="text-sm font-bold w-4 text-center text-gray-800 dark:text-white">{qty}</span>
                                      <button onClick={() => handleAddCustomProduct(product)} className="w-7 h-7 bg-romance-500 text-white rounded-md shadow-sm flex items-center justify-center text-sm font-bold hover:bg-romance-600">+</button>
                                  </>
                                  ) : (
                                  <button onClick={() => handleAddCustomProduct(product)} className="px-3 py-1 bg-romance-100 dark:bg-romance-900/30 text-romance-700 dark:text-romance-300 rounded-md text-sm font-bold hover:bg-romance-200 dark:hover:bg-romance-900/50 transition">
                                      Adicionar
                                  </button>
                                  )}
                              </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-romance-100 dark:border-gray-800">
              <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white mb-4">Adicionar Flores?</h3>
              <BouquetSelector selected={customBouquet} onSelect={setCustomBouquet} />
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-romance-100 dark:border-gray-800">
            <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white mb-2">Mensagem do Cartão</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Deixe nossa IA criar algo especial para você.</p>
            <MessageGenerator 
              onMessageSelect={setCustomBasketMessage}
              currentMessage={customBasketMessage}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-dark-card border-t dark:border-gray-800 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex justify-between items-center z-40 transition-colors">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total da Cesta</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            R$ {(calculateBasketTotal({basePrice: 0, items: customBasketItems, isCustomizable: true, id: 'temp', name: 'temp', description: '', image: '', options: {bouquetSize: customBouquet}})).toFixed(2).replace('.',',')}
          </p>
          <p className="text-xs text-gray-400">{customBasketItems.reduce((a,b) => a+b.quantity, 0)} itens + {customBouquet !== 'NENHUM' ? 'Flores' : 'Sem flores'}</p>
        </div>
        <button 
          onClick={finishCustomBasket}
          disabled={customBasketItems.length === 0}
          className="bg-green-600 text-white px-6 md:px-10 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
        >
          Concluir Cesta
        </button>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-8 flex-grow">
        <button onClick={() => setView('HOME')} className="text-romance-600 dark:text-romance-400 font-medium mb-6 flex items-center gap-1 hover:underline">
          ← Adicionar mais itens
        </button>
        
        <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <span>🛍️</span> Seu Carrinho
        </h2>
        
        <div className="space-y-6 mb-8">
          {cart.map((item, idx) => {
            const basketTotal = calculateBasketTotal(item.basket);
            
            return (
              <div key={`${item.basket.id}-${idx}`} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-romance-100 dark:border-gray-800 relative">
                 <button onClick={() => removeFromCart(item.basket.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                 </button>

                <div className="flex gap-4">
                  <img src={item.basket.image} alt={item.basket.name} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg">{item.basket.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.basket.description}</p>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg mb-2">
                          {item.basket.options?.bouquetSize && item.basket.options.bouquetSize !== 'NENHUM' && (
                              <div className="flex items-center gap-1 text-romance-700 dark:text-romance-400 font-semibold">
                                  <span>🌹</span> Buquê {item.basket.options.bouquetSize === 'PEQUENO' ? 'Pequeno' : 'Grande'}
                              </div>
                          )}
                          {item.basket.isCustomizable && (
                              <div className="mt-1 text-xs">
                                  {item.basket.items.slice(0, 5).map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                                  {item.basket.items.length > 5 && '...'}
                              </div>
                          )}
                      </div>

                      {item.basket.message && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-romance-300 pl-2">
                          Mensagem: "{item.basket.message.substring(0, 50)}..."
                        </p>
                      )}
                      
                      <div className="flex justify-end mt-2">
                           <p className="font-bold text-xl text-gray-800 dark:text-white">R$ {basketTotal.toFixed(2).replace('.',',')}</p>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm mb-6 border dark:border-gray-800">
          <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Observações do Pedido</label>
          <textarea 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-romance-500 outline-none"
              rows={3}
              placeholder="Ex: Entregar na portaria, não tocar campainha, ligar quando chegar..."
              value={orderObservation}
              onChange={(e) => setOrderObservation(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg mb-8 border border-romance-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg border-b dark:border-gray-700 pb-2">Resumo Financeiro</h3>
          <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2).replace('.',',')}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
            <span>Entrega (Delivery)</span>
            <span>R$ 15,00</span>
          </div>
          <div className="flex justify-between font-bold text-2xl text-romance-700 dark:text-romance-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span>Total</span>
            <span>R$ {(cartTotal + 15).toFixed(2).replace('.',',')}</span>
          </div>
        </div>

        <button 
          onClick={() => setView('SUCCESS')}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-xl mb-4 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>💳</span> Finalizar Pagamento
        </button>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">ou</p>
          <div className="flex justify-center gap-4">
               <a 
                 href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                 target="_blank"
                 rel="noreferrer"
                 className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium text-sm flex items-center gap-1 transition"
               >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02C17.18 3.03 14.69 2 12.04 2zM12.05 19.34c-1.49 0-2.95-.39-4.24-1.16l-.3-.18-3.15.83.84-3.07-.19-.31c-.82-1.33-1.25-2.88-1.25-4.47 0-4.63 3.77-8.4 8.4-8.4 2.24 0 4.4 1.13 5.98 2.71 1.59 1.59 2.47 3.7 2.47 5.95 0 4.63-3.76 8.39-8.39 8.39l.03-.29zm4.61-6.28c-.25-.13-1.5-.74-1.73-.83-.23-.09-.39-.13-.56.13-.17.25-.67.83-.82 1-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.1-.51.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.32-.02-.45-.06-.13-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.02 2.58c.13.16 1.77 2.7 4.28 3.79.6.26 1.06.41 1.42.53.6.19 1.15.16 1.59.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.22-.16-.47-.28z"/></svg>
                  Tirar Dúvida no WhatsApp
               </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-28 h-28 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-4xl font-serif font-bold text-gray-800 dark:text-white mb-4">Pedido Confirmado! ❤️</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg">
        Obrigado por escolher a Cestas & Mimos. Vamos preparar tudo com muito carinho. Você será redirecionado para o pagamento em breve.
      </p>
      
      <button 
        onClick={() => {
          setCart([]);
          setOrderObservation('');
          setView('HOME');
        }}
        className="bg-gray-800 dark:bg-gray-700 text-white px-10 py-3 rounded-xl font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition"
      >
        Voltar ao Início
      </button>
    </div>
  );

  // Floating WhatsApp Button
  const FloatingWhatsApp = () => (
    <a 
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition hover:-translate-y-1"
      title="Fale conosco no WhatsApp"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02C17.18 3.03 14.69 2 12.04 2zM12.05 19.34c-1.49 0-2.95-.39-4.24-1.16l-.3-.18-3.15.83.84-3.07-.19-.31c-.82-1.33-1.25-2.88-1.25-4.47 0-4.63 3.77-8.4 8.4-8.4 2.24 0 4.4 1.13 5.98 2.71 1.59 1.59 2.47 3.7 2.47 5.95 0 4.63-3.76 8.39-8.39 8.39l.03-.29zm4.61-6.28c-.25-.13-1.5-.74-1.73-.83-.23-.09-.39-.13-.56.13-.17.25-.67.83-.82 1-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.1-.51.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.32-.02-.45-.06-.13-.56-1.34-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.02 2.58c.13.16 1.77 2.7 4.28 3.79.6.26 1.06.41 1.42.53.6.19 1.15.16 1.59.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.22-.16-.47-.28z"/></svg>
    </a>
  );

  return (
    <div className={`min-h-screen font-sans text-gray-800 transition-colors ${darkMode ? 'dark' : ''}`}>
        <div className="bg-romance-50 dark:bg-dark-bg min-h-screen transition-colors">
            {renderHeader()}
            <main>
                {view === 'HOME' && renderHome()}
                {view === 'STANDARD_CONFIG' && renderStandardConfig()}
                {view === 'CUSTOM_BUILDER' && renderBuilder()}
                {view === 'CHECKOUT' && renderCheckout()}
                {view === 'SUCCESS' && renderSuccess()}
            </main>
            <FloatingWhatsApp />
        </div>
    </div>
  );
}

export default App;