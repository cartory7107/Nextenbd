import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getFlashSaleProducts, products } from "@/data/products";

const DealsPage = () => {
  const flashSaleProducts = getFlashSaleProducts();
  const discountedProducts = products.filter(p => p.discount > 0 && !p.isFlashSale);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[76px]">
        <div className="section-container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="gradient-primary p-3 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Flash Deals & Offers</h1>
                <p className="text-muted-foreground">Grab the best deals before they expire!</p>
              </div>
            </div>
          </motion.div>

          {flashSaleProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 gradient-text">⚡ Flash Sale</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {flashSaleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}

          {discountedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">🏷️ More Deals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {discountedProducts.map((product, index) => (
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

export default DealsPage;
