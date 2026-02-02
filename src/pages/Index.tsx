import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BrandSlider from "@/components/BrandSlider";
import FlashSaleSection from "@/components/FlashSaleSection";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { categories, getTrendingProducts, getNewArrivals } from "@/data/products";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const trendingProducts = getTrendingProducts();
  const newArrivals = getNewArrivals();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[76px]">
        {/* Hero Section */}
        <HeroSection />

        {/* Brand Slider */}
        <BrandSlider />

        {/* Categories Section */}
        <section className="py-16">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Shop by <span className="gradient-text">Category</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of categories and find exactly what you're looking for
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale Section */}
        <FlashSaleSection />

        {/* Trending Products */}
        <section className="py-16">
          <div className="section-container">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="gradient-accent p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Trending Now</h2>
                  <p className="text-muted-foreground">
                    Most popular products this week
                  </p>
                </div>
              </div>
              <Link
                to="/trending"
                className="btn-glass px-6 py-3 rounded-xl flex items-center gap-2 hover:glow-accent"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-8">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card-hover rounded-3xl overflow-hidden"
            >
              <div className="relative p-8 md:p-12 lg:p-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <p className="text-primary font-semibold mb-2">Limited Time Offer</p>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                      Get <span className="gradient-text">20% OFF</span> on Your First Order
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-lg">
                      Sign up now and receive a special discount code for your first purchase.
                      Don't miss out on this exclusive offer!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link to="/signup" className="btn-gradient px-8 py-4 rounded-xl glow-primary">
                        Sign Up Now
                      </Link>
                      <Link to="/deals" className="btn-glass px-8 py-4 rounded-xl">
                        Explore Deals
                      </Link>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="relative">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-9xl"
                      >
                        🎁
                      </motion.div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/30 rounded-full blur-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16">
          <div className="section-container">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="gradient-success p-3 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">New Arrivals</h2>
                  <p className="text-muted-foreground">
                    Fresh products just landed in store
                  </p>
                </div>
              </div>
              <Link
                to="/new"
                className="btn-glass px-6 py-3 rounded-xl flex items-center gap-2 hover:glow-success"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-16 bg-card/50">
          <div className="section-container">
            <div className="glass-card-hover rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Download Our <span className="gradient-text">Mobile App</span>
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Get exclusive app-only deals, track your orders in real-time,
                    and enjoy a seamless shopping experience on the go.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Exclusive app-only discounts",
                      "Real-time order tracking",
                      "Easy returns & refunds",
                      "Push notifications for deals",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center text-sm">
                          ✓
                        </span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-glass px-6 py-3 rounded-xl flex items-center gap-3">
                      <span className="text-2xl">🍎</span>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Download on</p>
                        <p className="font-semibold">App Store</p>
                      </div>
                    </button>
                    <button className="btn-glass px-6 py-3 rounded-xl flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Get it on</p>
                        <p className="font-semibold">Google Play</p>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="hidden lg:flex justify-center">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-64 h-[500px] rounded-[3rem] bg-gradient-to-b from-muted to-card border-4 border-border/50 shadow-2xl overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="gradient-primary rounded-2xl p-4 mb-4 inline-block">
                            <span className="text-4xl font-bold text-white">M</span>
                          </div>
                          <p className="font-bold text-lg">MarketHub</p>
                          <p className="text-sm text-muted-foreground">Shop Smarter</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/30 rounded-full blur-xl" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
