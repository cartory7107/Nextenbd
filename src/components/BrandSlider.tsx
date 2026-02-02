import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brands } from "@/data/products";

const BrandSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-card/50">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Shop by Brand</h2>
            <p className="text-muted-foreground">
              Explore products from your favorite brands
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="btn-glass p-3 rounded-xl hover:glow-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="btn-glass p-3 rounded-xl hover:glow-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <button className="glass-card-hover rounded-2xl px-8 py-6 min-w-[160px] flex flex-col items-center gap-3 group">
                <div className="text-3xl font-bold gradient-text group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <p className="text-xs text-muted-foreground">
                  {brand.productCount} products
                </p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
