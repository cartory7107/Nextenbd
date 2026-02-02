import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories, getProductsByCategory } from "@/data/products";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);
  const products = getProductsByCategory(id || "");
  const [sortBy, setSortBy] = useState("featured");

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[76px] section-container py-16 text-center">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[76px]">
        {/* Category Header */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <span className="text-6xl mb-4 block">{category.icon}</span>
              <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
              <p className="text-muted-foreground">
                {category.productCount.toLocaleString()} products available
              </p>
            </motion.div>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-4">
              <button className="btn-glass px-4 py-2 rounded-xl flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </button>
              <button className="btn-glass px-4 py-2 rounded-xl flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Price Range
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-glass px-4 py-2 rounded-xl"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
