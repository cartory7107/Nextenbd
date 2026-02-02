import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="glass-card-hover rounded-2xl overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-background">
            {/* Product Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="badge-new">NEW</span>
              )}
              {product.isTrending && (
                <span className="badge-gradient">🔥 HOT</span>
              )}
              {product.isFlashSale && (
                <span className="badge-sale">⚡ FLASH</span>
              )}
              {product.discount > 0 && (
                <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <motion.div
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-xl backdrop-blur-sm transition-all ${
                  inWishlist
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/50 hover:bg-background/80"
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all"
              >
                <Eye className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div
              className="absolute bottom-3 left-3 right-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  inCart
                    ? "bg-muted text-muted-foreground"
                    : "btn-gradient"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {inCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "star-filled fill-current"
                        : "star-empty"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="price-current">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice > product.price && (
                <span className="price-original">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            {/* Seller */}
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                by {product.seller.name}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 star-filled fill-current" />
                <span>{product.seller.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
