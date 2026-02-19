import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, MapPin, CreditCard, CheckCircle2,
  Package, Smartphone, Building2, Truck, ChevronRight, Lock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

// ---- Types ----
interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  notes: string;
}

type PaymentMethod = "bkash" | "nagad" | "sslcommerz" | "cod";

const STEPS = ["Order Summary", "Shipping", "Payment", "Confirm"];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barishal",
  "Sylhet", "Rangpur", "Mymensingh", "Gazipur", "Narayanganj",
  "Comilla", "Narsingdi", "Tangail", "Faridpur", "Jessore",
  "Cox's Bazar", "Bogra", "Dinajpur", "Pabna", "Kushtia",
];

// ---- Step 1: Order Summary ----
const OrderSummaryStep = ({
  items, subtotal, deliveryFee, total, onNext,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number; deliveryFee: number; total: number;
  onNext: () => void;
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
    <div className="space-y-4 mb-6">
      {items.map((item) => (
        <div key={item.product.id} className="flex gap-4 glass-card p-4 rounded-2xl">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold line-clamp-2">{item.product.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {item.product.brand}
              {item.selectedColor && ` • ${item.selectedColor}`}
              {item.selectedSize && ` • ${item.selectedSize}`}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
              <span className="font-bold gradient-text">
                {formatPrice(item.product.price * item.quantity, item.product.currency)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Price breakdown */}
    <div className="glass-card p-5 rounded-2xl space-y-3 mb-8">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal</span><span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Delivery</span>
        <span className={deliveryFee === 0 ? "text-green-400 font-semibold" : "text-foreground font-medium"}>
          {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
        </span>
      </div>
      {deliveryFee === 0 && (
        <p className="text-xs text-green-400">🎉 You qualify for free delivery!</p>
      )}
      <div className="flex justify-between pt-3 border-t border-border font-bold text-lg">
        <span>Total</span>
        <span className="gradient-text">{formatPrice(total)}</span>
      </div>
    </div>

    <button onClick={onNext} className="w-full btn-gradient py-4 rounded-2xl font-semibold glow-primary flex items-center justify-center gap-2">
      Continue to Shipping <ArrowRight className="h-5 w-5" />
    </button>
  </div>
);

// ---- Step 2: Shipping Address ----
const ShippingStep = ({
  address, onChange, onNext, onBack,
}: {
  address: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!address.fullName.trim()) errs.fullName = "Full name is required";
    if (!/^01[3-9]\d{8}$/.test(address.phone)) errs.phone = "Enter a valid BD phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errs.email = "Enter a valid email";
    if (!address.address.trim()) errs.address = "Address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.district) errs.district = "District is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const Field = ({ label, field, type = "text", placeholder }: {
    label: string; field: keyof ShippingAddress; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={address[field]}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`input-glass text-foreground placeholder:text-muted-foreground ${errors[field] ? "border-destructive" : ""}`}
      />
      {errors[field] && <p className="text-destructive text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *" field="fullName" placeholder="Your full name" />
          <Field label="Phone Number *" field="phone" type="tel" placeholder="01XXXXXXXXX" />
        </div>
        <Field label="Email Address *" field="email" type="email" placeholder="you@example.com" />
        <Field label="Street Address *" field="address" placeholder="House no, road, area" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City *" field="city" placeholder="Your city" />
          <div>
            <label className="block text-sm font-medium mb-1">District *</label>
            <select
              value={address.district}
              onChange={(e) => onChange("district", e.target.value)}
              className={`input-glass w-full text-foreground bg-transparent ${errors.district ? "border-destructive" : ""}`}
              style={{ background: "hsl(0 0% 100% / 0.05)" }}
            >
              <option value="" style={{ background: "#111" }}>Select district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d} style={{ background: "#111" }}>{d}</option>
              ))}
            </select>
            {errors.district && <p className="text-destructive text-xs mt-1">{errors.district}</p>}
          </div>
        </div>
        <Field label="Postal Code" field="postalCode" placeholder="e.g. 1000" />
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Notes (optional)</label>
          <textarea
            value={address.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Any special delivery instructions..."
            rows={3}
            className="input-glass w-full text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="btn-glass px-6 py-4 rounded-2xl font-medium flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={handleNext} className="flex-1 btn-gradient py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
          Continue to Payment <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// ---- Step 3: Payment ----
const paymentOptions = [
  {
    id: "bkash" as PaymentMethod,
    name: "bKash",
    description: "Pay via bKash mobile banking",
    icon: "💳",
    color: "hsl(340 82% 60%)",
    number: "01XXXXXXXXX",
  },
  {
    id: "nagad" as PaymentMethod,
    name: "Nagad",
    description: "Pay via Nagad mobile banking",
    icon: "📱",
    color: "hsl(25 95% 60%)",
    number: "01XXXXXXXXX",
  },
  {
    id: "sslcommerz" as PaymentMethod,
    name: "SSL Commerz",
    description: "Cards, net banking & more",
    icon: "🏦",
    color: "hsl(220 90% 56%)",
    number: null,
  },
  {
    id: "cod" as PaymentMethod,
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "🚚",
    color: "hsl(160 84% 45%)",
    number: null,
  },
];

const PaymentStep = ({
  method, onSelect, total, onNext, onBack,
}: {
  method: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  total: number;
  onNext: () => void;
  onBack: () => void;
}) => {
  const selected = paymentOptions.find((p) => p.id === method);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      <div className="space-y-3 mb-6">
        {paymentOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full text-left glass-card p-4 rounded-2xl border-2 transition-all duration-300 ${method === opt.id ? "border-primary" : "border-transparent hover:border-border"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${opt.color}22`, border: `1.5px solid ${opt.color}44` }}
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{opt.name}</p>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${method === opt.id ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                {method === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment instructions */}
      {selected && (selected.id === "bkash" || selected.id === "nagad") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl mb-6 border border-primary/30"
        >
          <p className="font-semibold mb-2 text-primary">How to pay with {selected.name}:</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open your {selected.name} app</li>
            <li>Go to "Send Money"</li>
            <li>Enter number: <span className="text-foreground font-mono font-bold">01712-345678</span></li>
            <li>Enter amount: <span className="text-foreground font-bold">{formatPrice(total)}</span></li>
            <li>Use your order ID as reference</li>
            <li>Enter your {selected.name} PIN to confirm</li>
          </ol>
        </motion.div>
      )}

      {selected?.id === "sslcommerz" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl mb-6 border border-accent/30"
        >
          <p className="font-semibold mb-2 text-accent">SSL Commerz Secure Payment</p>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to SSL Commerz's secure payment gateway. Accepts Visa, Mastercard, bKash, Nagad, Rocket, and all major banks.
          </p>
        </motion.div>
      )}

      {selected?.id === "cod" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl mb-6 border border-green-500/30"
        >
          <p className="font-semibold mb-2 text-green-400">Cash on Delivery</p>
          <p className="text-sm text-muted-foreground">
            Pay <span className="text-foreground font-bold">{formatPrice(total)}</span> when your order arrives at your doorstep. Please keep exact change ready.
          </p>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-glass px-6 py-4 rounded-2xl font-medium flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!method}
          className="flex-1 btn-gradient py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Review Order <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// ---- Step 4: Confirm ----
const ConfirmStep = ({
  address, method, total, deliveryFee, items, onBack, onPlaceOrder, placing,
}: {
  address: ShippingAddress;
  method: PaymentMethod;
  total: number;
  deliveryFee: number;
  items: ReturnType<typeof useCart>["items"];
  onBack: () => void;
  onPlaceOrder: () => void;
  placing: boolean;
}) => {
  const payLabel = paymentOptions.find((p) => p.id === method)?.name ?? method;
  const subtotal = total - deliveryFee;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Confirm Your Order</h2>

      {/* Delivery address */}
      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Delivery Address</h3>
        </div>
        <p className="font-medium">{address.fullName}</p>
        <p className="text-muted-foreground text-sm">{address.phone} • {address.email}</p>
        <p className="text-muted-foreground text-sm mt-1">
          {address.address}, {address.city}, {address.district} {address.postalCode}
        </p>
        {address.notes && <p className="text-muted-foreground text-sm mt-1 italic">"{address.notes}"</p>}
      </div>

      {/* Payment */}
      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Payment</h3>
        </div>
        <p className="text-muted-foreground text-sm">{payLabel}</p>
      </div>

      {/* Items */}
      <div className="glass-card p-5 rounded-2xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{items.length} Item{items.length !== 1 ? "s" : ""}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground line-clamp-1 flex-1 mr-4">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium flex-shrink-0">
                {formatPrice(item.product.price * item.quantity, item.product.currency)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Delivery</span>
            <span className={deliveryFee === 0 ? "text-green-400" : ""}>
              {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="gradient-text">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Lock className="h-4 w-4" />
        <span>Your order is protected by 256-bit SSL encryption</span>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-glass px-6 py-4 rounded-2xl font-medium flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={placing}
          className="flex-1 btn-gradient py-4 rounded-2xl font-semibold glow-primary flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {placing ? (
            <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Placing Order...</>
          ) : (
            <><CheckCircle2 className="h-5 w-5" /> Place Order</>
          )}
        </button>
      </div>
    </div>
  );
};

// ---- Main Component ----
const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "", phone: "", email: "", address: "",
    city: "", district: "", postalCode: "", notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 5000 ? 0 : 120;
  const total = subtotal + deliveryFee;

  // Redirect if cart empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-[76px]">
          <div className="section-container py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link to="/" className="btn-gradient px-8 py-4 rounded-2xl inline-flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" /> Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    // Simulate order processing
    await new Promise((res) => setTimeout(res, 2000));
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    navigate(`/order-confirmation?orderId=${orderId}&method=${paymentMethod}`);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[76px]">
        <div className="section-container py-8">
          {/* Back to cart */}
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < step
                        ? "gradient-primary text-white"
                        : i === step
                        ? "border-2 border-primary text-primary bg-primary/10"
                        : "border-2 border-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-16px] transition-all duration-300 ${i < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    {step === 0 && (
                      <OrderSummaryStep
                        items={items} subtotal={subtotal} deliveryFee={deliveryFee} total={total}
                        onNext={() => setStep(1)}
                      />
                    )}
                    {step === 1 && (
                      <ShippingStep
                        address={address} onChange={handleAddressChange}
                        onNext={() => setStep(2)} onBack={() => setStep(0)}
                      />
                    )}
                    {step === 2 && (
                      <PaymentStep
                        method={paymentMethod} onSelect={setPaymentMethod}
                        total={total} onNext={() => setStep(3)} onBack={() => setStep(1)}
                      />
                    )}
                    {step === 3 && (
                      <ConfirmStep
                        address={address} method={paymentMethod!}
                        total={total} deliveryFee={deliveryFee} items={items}
                        onBack={() => setStep(2)} onPlaceOrder={handlePlaceOrder} placing={placing}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-1 font-medium text-xs">{item.product.name}</p>
                        <p className="text-muted-foreground text-xs">× {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-xs flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity, item.product.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-400" : ""}>
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Secure SSL Checkout
                  </div>
                  <div className="flex gap-2 mt-3">
                    {["bKash", "Nagad", "SSL"].map((p) => (
                      <span key={p} className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">{p}</span>
                    ))}
                    <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">COD</span>
                  </div>
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

export default CheckoutPage;
