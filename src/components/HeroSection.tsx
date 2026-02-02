import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

interface HeroSectionProps {
  flashSaleEndTime?: Date;
}

const HeroSection = ({ flashSaleEndTime }: HeroSectionProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endTime = flashSaleEndTime || new Date(Date.now() + 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleEndTime]);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(340 82% 60% / 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(262 83% 58% / 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Flash Sale Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6"
            >
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-semibold text-primary">Flash Sale Live!</span>
              <div className="flex items-center gap-1 ml-2">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-primary">:</span>
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-primary">:</span>
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold">
                  {formatTime(timeLeft.seconds)}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Premium{" "}
              <span className="gradient-text">Products</span> for Your Lifestyle
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Shop the latest in gadgets, beauty, and sports accessories from
              trusted sellers. Get up to{" "}
              <span className="text-primary font-semibold">50% OFF</span> on your
              first order!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/category/gadgets"
                className="btn-gradient px-8 py-4 rounded-2xl text-lg flex items-center gap-2 glow-primary"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/deals"
                className="btn-glass px-8 py-4 rounded-2xl text-lg"
              >
                View Flash Deals
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "10K+", label: "Products" },
                { value: "500+", label: "Sellers" },
                { value: "50K+", label: "Happy Customers" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image / 3D Product Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating Products */}
            <div className="relative h-[600px]">
              {/* Main Product */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="glass-card-hover rounded-3xl p-6 glow-primary">
                  <img
                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"
                    alt="Featured Smartphone"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </motion.div>

              {/* Floating Small Products */}
              <motion.div
                className="absolute top-10 left-10 w-32 h-32"
                animate={{
                  y: [0, 15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="glass-card rounded-2xl p-3 glow-accent">
                  <img
                    src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300"
                    alt="AirPods"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-5 w-28 h-28"
                animate={{
                  y: [0, -10, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="glass-card rounded-2xl p-2 glow-success">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
                    alt="Nike Shoe"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                className="absolute top-20 right-10 w-24 h-24"
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              >
                <div className="glass-card rounded-2xl p-2">
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300"
                    alt="Lipstick"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 right-20 w-36 h-36"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <div className="glass-card rounded-2xl p-3">
                  <img
                    src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300"
                    alt="Smart Watch"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
