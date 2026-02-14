import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[76px]">
          <div className="section-container py-16">
            <div className="text-center max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 mx-auto mb-8 rounded-full gradient-primary flex items-center justify-center"
              >
                <Heart className="h-16 w-16 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Save items you love to your wishlist and come back to them later.
              </p>
              <Link to="/" className="btn-gradient px-8 py-4 rounded-2xl inline-flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Browse Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[76px]">
        <div className="section-container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover rounded-2xl overflow-hidden"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg">{formatPrice(product.price, product.currency)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice, product.currency)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                      className={`flex-1 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 text-sm ${
                        isInCart(product.id) ? "bg-muted text-muted-foreground" : "btn-gradient"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
