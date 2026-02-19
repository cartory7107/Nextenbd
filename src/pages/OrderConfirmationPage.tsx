import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Home, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const paymentLabels: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  sslcommerz: "SSL Commerz",
  cod: "Cash on Delivery",
};

const paymentInstructions: Record<string, { icon: string; steps: string[] }> = {
  bkash: {
    icon: "💳",
    steps: [
      "Open your bKash app",
      'Go to "Send Money"',
      "Send to: 01712-345678",
      "Use your Order ID as reference",
      "We'll confirm within 1-2 hours",
    ],
  },
  nagad: {
    icon: "📱",
    steps: [
      "Open your Nagad app",
      'Go to "Send Money"',
      "Send to: 01712-345678",
      "Use your Order ID as reference",
      "We'll confirm within 1-2 hours",
    ],
  },
  sslcommerz: {
    icon: "🏦",
    steps: ["Payment was processed via SSL Commerz", "You'll receive a confirmation email shortly"],
  },
  cod: {
    icon: "🚚",
    steps: [
      "Your order is confirmed!",
      "Delivery in 2–5 business days",
      "Please have exact cash ready",
      "Our delivery partner will call before arrival",
    ],
  },
};

const OrderConfirmationPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") ?? "ORD-UNKNOWN";
  const method = params.get("method") ?? "cod";

  const info = paymentInstructions[method] ?? paymentInstructions.cod;
  const label = paymentLabels[method] ?? "Unknown";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[76px]">
        <div className="section-container py-16">
          <div className="max-w-xl mx-auto text-center">
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-28 h-28 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center glow-success"
            >
              <CheckCircle2 className="h-14 w-14 text-white" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-3xl font-bold mb-2">Order Placed! 🎉</h1>
              <p className="text-muted-foreground mb-1">
                Thank you for your order. We've received it successfully.
              </p>
              <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-muted text-sm font-mono">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Order ID:</span>
                <span className="text-foreground font-bold">{orderId}</span>
              </div>
            </motion.div>

            {/* Payment instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 mt-8 text-left"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{info.icon}</span>
                <div>
                  <h2 className="font-bold">Payment: {label}</h2>
                  <p className="text-sm text-muted-foreground">Next steps</p>
                </div>
              </div>
              <ol className="space-y-2">
                {info.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Estimated delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="glass-card rounded-2xl p-5 mt-4 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">2–5 business days within Bangladesh</p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 mt-8"
            >
              <Link
                to="/"
                className="flex-1 btn-glass py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" /> Continue Shopping
              </Link>
              <Link
                to="/account"
                className="flex-1 btn-gradient py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                View Orders <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
