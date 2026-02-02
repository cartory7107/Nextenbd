import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { categories } from "@/data/products";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="gradient-primary py-1.5">
        <div className="section-container">
          <p className="text-center text-xs font-medium text-white">
            🎉 Grand Opening Sale! Up to 50% OFF on selected items | Free Shipping on orders over ৳5,000
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="glass-card border-b border-border/50">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary rounded-xl p-2">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="hidden font-display text-xl font-bold gradient-text sm:block">
                MarketHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className="nav-link">Home</Link>
              <div className="group relative">
                <button className="nav-link flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="glass-card w-64 p-4 rounded-xl shadow-xl">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/deals" className="nav-link">Flash Deals</Link>
              <Link to="/brands" className="nav-link">Brands</Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass w-full pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="btn-glass p-2.5 rounded-xl md:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="btn-glass p-2.5 rounded-xl relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary flex items-center justify-center text-xs font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="btn-glass p-2.5 rounded-xl relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-accent flex items-center justify-center text-xs font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Account */}
              <Link to="/account" className="hidden sm:flex btn-glass p-2.5 rounded-xl">
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn-glass p-2.5 rounded-xl lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden pb-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass-card border-b border-border/50"
          >
            <nav className="section-container py-4 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-muted transition-colors"
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
              <Link
                to="/deals"
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-muted transition-colors"
              >
                Flash Deals 🔥
              </Link>
              <Link
                to="/account"
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-muted transition-colors sm:hidden"
              >
                My Account
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
