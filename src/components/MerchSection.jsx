import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, ExternalLink, X, Check, Plus, Minus, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { MERCH_PRODUCTS } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function MerchSection({
  cart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  cartOpen,
  setCartOpen,
  cartTotal
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [addedNotice, setAddedNotice] = useState(null);

  const categories = ['All', 'Hoodies', 'T-Shirts', 'Vinyl & Music', 'Headwear'];

  const filteredProducts = selectedCategory === 'All'
    ? MERCH_PRODUCTS
    : MERCH_PRODUCTS.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleAddToCart = (product, size) => {
    addToCart(product, size || product.sizes[0]);
    setAddedNotice(product.name);
    setTimeout(() => setAddedNotice(null), 2500);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  return (
    <section id="store" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Toast Notice */}
      <AnimatePresence>
        {addedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 sm:top-24 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 px-5 py-2.5 rounded-full bg-purple-600 text-white font-semibold text-xs shadow-2xl shadow-purple-600/50 flex items-center justify-center gap-2 border border-purple-400"
          >
            <Check className="w-4 h-4 shrink-0" /> <span className="truncate">Added "{addedNotice}" to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Tag className="w-3.5 h-3.5" /> OFFICIAL ATELIER
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            OFFICIAL MERCH & VINYL
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl">
            Custom heavyweight garments, limited 180g vinyl pressings, and hand-pulled screen prints.
          </p>
        </div>

        {/* Category Filter Pills (Scrollable horizontally on mobile) */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto no-scrollbar max-w-full pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Cart Opener Pill */}
          <button
            onClick={() => setCartOpen(true)}
            className="px-3.5 sm:px-4 py-2 rounded-full bg-purple-500/15 hover:bg-purple-600 text-xs font-semibold text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Grid (1-col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => (
          <SpotlightCard
            key={product.id}
            tilt={false}
            spotlightColor="rgba(168, 85, 247, 0.16)"
            className="p-4 sm:p-5 flex flex-col justify-between group"
          >
            <div>
              
              {/* Product Image Container */}
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d15] mb-4 sm:mb-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] sm:text-[11px] font-mono font-bold text-purple-300 border border-purple-500/30">
                  {product.badge}
                </span>

                {/* Quick View Button */}
                <button
                  onClick={() => {
                    setQuickViewProduct(product);
                    setSelectedSize(product.sizes[0]);
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/80 hover:bg-purple-600 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick View</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {product.name}
                </h3>
                <span className="font-mono text-sm sm:text-base font-bold text-purple-300 shrink-0">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Bottom Actions: Add to Cart & Buy Link */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
              <button
                onClick={() => handleAddToCart(product, product.sizes[0])}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add To Cart</span>
              </button>

              <button
                onClick={() => {
                  setQuickViewProduct(product);
                  setSelectedSize(product.sizes[0]);
                }}
                className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] flex items-center justify-center transition-colors active:scale-95"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* QUICK VIEW MODAL (Mobile Bottom Sheet / Desktop Modal) */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0e0f18] border-t sm:border border-white/[0.15] rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center">
                <div className="aspect-square rounded-2xl overflow-hidden border border-white/[0.1] max-w-[260px] mx-auto sm:max-w-none">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 block mb-1">
                    {quickViewProduct.category} • {quickViewProduct.badge}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                    {quickViewProduct.name}
                  </h3>
                  <div className="font-mono text-lg sm:text-xl font-bold text-purple-300 mb-3">
                    ${quickViewProduct.price.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {quickViewProduct.description}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <span className="text-xs font-mono text-slate-400 block mb-1.5">
                      Available Sizing / Options:
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {quickViewProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            selectedSize === sz
                              ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30'
                              : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleAddToCart(quickViewProduct, selectedSize)}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart ({selectedSize || quickViewProduct.sizes[0]})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART SLIDE-OUT DRAWER (Mobile Safe Bottom Sheet) */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-end"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md h-full bg-[#0c0d15] border-l border-white/[0.1] p-5 sm:p-6 flex flex-col justify-between shadow-2xl safe-bottom"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <h3 className="font-display text-xl font-bold text-white">Your Cart</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center active:scale-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Your cart is currently empty.</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-4 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold active:scale-95"
                    >
                      Browse Merch Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedSize}`}
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/[0.08]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                          <p className="text-[10px] text-purple-300 font-mono">Size: {item.selectedSize}</p>
                          <p className="text-xs font-bold text-slate-300 mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center text-xs active:scale-90"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center text-xs active:scale-90"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-white/[0.08] space-y-3 mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-mono font-bold text-white text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Worldwide shipping available. Taxes calculated at checkout.
                  </p>
                  <a
                    href="https://unnoticed.shop"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
