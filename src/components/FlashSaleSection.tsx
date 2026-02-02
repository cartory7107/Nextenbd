import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import { getFlashSaleProducts, Product } from "@/data/products";
import ProductCard from "./ProductCard";

const FlashSaleSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    setProducts(getFlashSaleProducts());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  if (products.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="gradient-primary p-4 rounded-2xl"
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Flash Sale</h2>
              <p className="text-muted-foreground">
                Limited time offers - Grab them before they're gone!
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Ends in:</span>
            <div className="flex items-center gap-2">
              <div className="glass-card px-4 py-2 rounded-xl">
                <span className="text-2xl font-bold gradient-text">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-xs text-muted-foreground block">Hrs</span>
              </div>
              <span className="text-2xl font-bold text-primary">:</span>
              <div className="glass-card px-4 py-2 rounded-xl">
                <span className="text-2xl font-bold gradient-text">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-xs text-muted-foreground block">Min</span>
              </div>
              <span className="text-2xl font-bold text-primary">:</span>
              <div className="glass-card px-4 py-2 rounded-xl">
                <span className="text-2xl font-bold gradient-text">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="text-xs text-muted-foreground block">Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
