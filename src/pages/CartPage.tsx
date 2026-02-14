import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 120;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

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
                <ShoppingCart className="h-16 w-16 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to="/" className="btn-gradient px-8 py-4 rounded-2xl inline-flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Group items by seller
  const groupedBySeller = items.reduce((acc, item) => {
    const seller = item.product.seller.name;
    if (!acc[seller]) {
      acc[seller] = [];
    }
    acc[seller].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[76px]">
        <div className="section-container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="btn-glass px-4 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedBySeller).map(([seller, sellerItems]) => (
                <motion.div
                  key={seller}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Seller Header */}
                  <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <p className="font-semibold">🏪 {seller}</p>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-border">
                    {sellerItems.map((item) => (
                      <div key={item.product.id} className="p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <Link
                            to={`/product/${item.product.id}`}
                            className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="font-semibold hover:text-primary transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.product.brand}
                              {item.selectedColor && ` • ${item.selectedColor}`}
                              {item.selectedSize && ` • ${item.selectedSize}`}
                            </p>

                            {/* Price & Quantity */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.quantity + 1)
                                  }
                                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {formatPrice(
                                      item.product.price * item.quantity,
                                      item.product.currency
                                    )}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-sm text-muted-foreground">
                                      {formatPrice(item.product.price, item.product.currency)}{" "}
                                      each
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="input-glass pl-10"
                      />
                    </div>
                    <button onClick={() => toast({ title: "Coupon", description: "Coupon feature coming soon!" })} className="btn-glass px-4 rounded-xl">Apply</button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-500 font-semibold" : "font-semibold"}>
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold gradient-text">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button onClick={() => toast({ title: "Checkout", description: "Checkout feature coming soon!" })} className="w-full btn-gradient py-4 rounded-2xl mt-6 font-semibold glow-primary">
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="w-full btn-glass py-3 rounded-xl mt-4 font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    🔒 Secure checkout powered by SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
