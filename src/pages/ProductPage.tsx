import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Minus,
  Plus,
  Check,
  Share2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductById, products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "reviews">("specs");

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to="/" className="btn-gradient px-6 py-3 rounded-xl">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[76px]">
        <div className="section-container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Back Button (Mobile) */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                className="glass-card rounded-3xl overflow-hidden aspect-square relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="badge-new">NEW</span>}
                  {product.isFlashSale && <span className="badge-sale">⚡ FLASH</span>}
                  {product.discount > 0 && (
                    <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Share Button */}
                <button className="absolute top-4 right-4 btn-glass p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 className="h-5 w-5" />
                </button>
              </motion.div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                        selectedImage === i
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              <div className="flex items-center justify-between">
                <p className="text-primary font-semibold uppercase tracking-wider">
                  {product.brand}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 star-filled fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

              {/* Seller */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Sold by</span>
                <span className="font-semibold text-foreground">
                  {product.seller.name}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 star-filled fill-current" />
                  <span>{product.seller.rating}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-4xl font-bold text-gradient-teal">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                    <span className="badge-gradient">Save {product.discount}%</span>
                  </>
                )}
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold">
                    Color: <span className="text-muted-foreground">{selectedColor}</span>
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-primary scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check
                            className={`h-5 w-5 mx-auto ${
                              color.hex === "#ffffff" || color.hex === "#c0c0c0"
                                ? "text-black"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground"
                            : "glass-card hover:bg-muted"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <p className="font-semibold">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center glass-card rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors rounded-l-xl"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="px-6 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-muted transition-colors rounded-r-xl"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <span className="text-muted-foreground">
                    {product.stock} units available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    inCart ? "bg-muted text-muted-foreground" : "btn-gradient glow-primary"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-2xl transition-all ${
                    inWishlist
                      ? "bg-primary text-primary-foreground"
                      : "btn-glass hover:glow-primary"
                  }`}
                >
                  <Heart className={`h-6 w-6 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                {[
                  { icon: Truck, label: "Free Delivery", desc: "On orders over ৳5,000" },
                  { icon: Shield, label: "Warranty", desc: product.warranty || "1 Year" },
                  { icon: RotateCcw, label: "Easy Return", desc: "7-day return policy" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            {/* Tab Headers */}
            <div className="flex gap-4 border-b border-border mb-8 overflow-x-auto no-scrollbar">
              {[
                { id: "specs", label: "Specifications" },
                { id: "description", label: "Description" },
                { id: "reviews", label: `Reviews (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-4 px-4 font-semibold whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "specs" && product.specs && (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between p-4 bg-muted/30 rounded-xl"
                        >
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "description" && (
                  <div className="glass-card rounded-2xl p-6">
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <h4 className="font-semibold mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center text-sm">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-8 mb-8">
                      <div className="text-center">
                        <p className="text-5xl font-bold gradient-text">{product.rating}</p>
                        <div className="flex items-center gap-1 justify-center my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(product.rating)
                                  ? "star-filled fill-current"
                                  : "star-empty"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          {product.reviewCount} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="w-3">{stars}</span>
                            <Star className="h-4 w-4 star-filled fill-current" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-primary"
                                style={{
                                  width: `${
                                    stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 3
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground">
                      Review section coming soon...
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
