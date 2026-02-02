import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Send, Phone, Mail, MapPin } from "lucide-react";
import { categories } from "@/data/products";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="section-container py-12">
        <div className="glass-card-hover rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground">
                Get exclusive deals, new arrivals & special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-glass flex-1 md:w-80"
              />
              <button className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2">
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-12 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="gradient-primary rounded-xl p-2">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="font-display text-xl font-bold gradient-text">
                MarketHub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your one-stop destination for premium gadgets, cosmetics, and sports accessories. Quality guaranteed.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="btn-glass p-2.5 rounded-xl hover:glow-primary transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Contact Us", "FAQs", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {[
                "Track Order",
                "Shipping Policy",
                "Return Policy",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>House 42, Road 11, Banani, Dhaka 1213</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>+880 1XX-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>support@markethub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="section-container py-8 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "✓", title: "100% Authentic", desc: "Genuine Products" },
            { icon: "🔒", title: "Secure Payment", desc: "SSL Encrypted" },
            { icon: "↩️", title: "Easy Returns", desc: "7-Day Policy" },
            { icon: "🚚", title: "Fast Delivery", desc: "Nationwide" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/30"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold text-sm">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 MarketHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png"
                alt="Stripe"
                className="h-6 opacity-60 invert"
              />
              <span className="text-lg font-bold text-muted-foreground">bKash</span>
              <span className="text-lg font-bold text-muted-foreground">Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
