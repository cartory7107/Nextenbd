import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/category/${category.id}`} className="group block">
        <div className="category-card h-full">
          {/* Gradient Background */}
          <div
            className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${category.gradient}`}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300">
              {category.name}
            </h3>

            {/* Product Count */}
            <p className="text-muted-foreground text-sm mb-4">
              {category.productCount.toLocaleString()} products
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
