import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (Mock Backend for Prototype) ---
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // In-memory data store
  let products = [
    { id: "1", name: "Almar Premium Desk", price: 299, discountPrice: 249, rating: 4.8, isDiscount: true, image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Furniture", brand: "Almar Home", stock: 10 },
    { id: "2", name: "Corporate Chair Alpha", price: 199, isDiscount: false, rating: 4.5, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Furniture", brand: "Almar Workspace", stock: 5 },
    { id: "3", name: "Almar Steel Tumbler", price: 29, discountPrice: 19, rating: 4.9, isDiscount: true, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Accessories", brand: "Almar Lifestyle", stock: 0 },
  ];

  let news = [
    { id: "1", title: "Almar Group Expands to Southeast Asia", date: "2026-05-15", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "In a monumental move, Almar Group announces its expansion into 5 new countries." },
    { id: "2", title: "Annual Corporate Sustainability Report", date: "2026-04-22", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Committing to a greener future with 100% renewable energy goals by 2030." }
  ];

  let jobs = [
    { id: "1", title: "Senior Marketing Manager", department: "Sales & Marketing", location: "Global (Remote)", type: "Full-Time", salary: "$90k - $120k", experience: "5+ Years", date: "Closes Jun 30, 2026" },
    { id: "2", title: "Production Supervisor", department: "Production", location: "Manufacturing Hub", type: "Full-Time", salary: "$60k - $80k", experience: "3+ Years", date: "Closes Jul 15, 2026" }
  ];
  
  let orders = [
    { id: "ORD-001", customer: "John Doe", date: "2026-06-08", total: 249.00, status: "Processing" },
    { id: "ORD-002", customer: "Jane Smith", date: "2026-06-07", total: 49.00, status: "Shipped" },
  ];
  
  let brands = [
    { id: "1", name: "Almar Home", logo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", status: "Active" },
    { id: "2", name: "Almar Workspace", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", status: "Active" },
  ];
  
  let coupons = [
    { id: "1", code: "ALMAR10", discount: 10, type: "percentage" },
    { id: "2", code: "WELCOME50", discount: 50, type: "flat" },
  ];
  
  let activities = [
    { id: "1", title: "Global Expansion Strategy", category: "Sales & Marketing", date: "2026-06-01", description: "Driving global reach through strategic market penetration.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: "2", title: "Sustainability Initiative Q3", category: "Promotion", date: "2026-05-20", description: "Building strong brand equity through sustainability initiatives.", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ];

  let footerData = {
    aboutText: "Empowering global growth through innovative solutions and enterprise management across multifaceted industries.",
    contactInfo: [
      { id: "1", icon: "MapPin", text: "123 Corporate Ave, NY 10001, USA" },
      { id: "2", icon: "Phone", text: "+1 (800) 123-4567" },
      { id: "3", icon: "Mail", text: "contact@almargroup.com" },
    ],
    policies: [
      { id: "1", name: "Privacy Policy", path: "/privacy" },
      { id: "2", name: "Terms & Conditions", path: "/terms" },
      { id: "3", name: "Refund Policy", path: "/refund" },
      { id: "4", name: "Sustainability", path: "/sustainability" },
    ],
    socialLinks: [
      { id: "1", name: "Facebook", href: "#" },
      { id: "2", name: "Linkedin", href: "#" },
      { id: "3", name: "Twitter", href: "#" },
      { id: "4", name: "Instagram", href: "#" },
      { id: "5", name: "Youtube", href: "#" },
    ]
  };

  let settings = {
    mainLogo: "",
    favicon: "",
    heroCover: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    heroTitle: "SHAPING THE FUTURE OF GLOBAL COMMERCE",
    heroSubtitle: "A diversified conglomerate committed to excellence, innovation, and sustainable growth across multiple industries.",
    aboutImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Years Experience", value: 25, suffix: "+" },
      { label: "Global Employees", value: 10, suffix: "k+" },
      { label: "Active Brands", value: 15, suffix: "" },
      { label: "Countries", value: 32, suffix: "" },
    ],
    aboutTitle: "SHAPING THE FUTURE OF GLOBAL COMMERCE",
    aboutDesc: "A diversified conglomerate committed to excellence, innovation, and sustainable growth across multiple industries.",
    corpTitle: "Shaping the Future of Global Enterprise",
    corpDesc: "At Almar Group, we vision a future where enterprise solutions drive sustainable growth. With over two decades of excellence, we have built an ecosystem of brands that deliver unparalleled value to our consumers worldwide.",
    mission: "To innovate and lead across major industries while maintaining the highest standards of corporate responsibility.",
    vision: "Becoming the most trusted multinational conglomerate, driving prosperity in every community we touch.",
    corpImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    navLinks: [
      { name: "Home", path: "/" },
      { name: "Our Brands", path: "/brands" },
      { name: "Activities", path: "/activities" },
      { name: "News & Events", path: "/news" },
      { name: "Shop", path: "/shop" },
      { name: "Career", path: "/career" },
      { name: "About Us", path: "/about" },
    ]
  };

  // Helper function for sending responses
  const getById = (arr: any[], id: string) => arr.find(item => item.id === id);

  // Settings

  app.get("/api/settings", (req, res) => res.json(settings));
  app.put("/api/settings", (req, res) => {
    settings = { ...settings, ...req.body };
    res.json({ success: true, settings });
  });

  // Footer
  app.get("/api/footer", (req, res) => res.json(footerData));
  app.put("/api/footer", (req, res) => {
    footerData = { ...footerData, ...req.body };
    res.json({ success: true, footerData });
  });

  // Products
  app.get("/api/products", (req, res) => res.json(products));
  app.get("/api/products/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    res.json(filtered);
  });
  app.post("/api/products", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    products.push(newItem);
    res.json(newItem);
  });
  app.put("/api/products/:id", (req, res) => {
    products = products.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
    res.json({ success: true });
  });
  app.delete("/api/products/:id", (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // News
  app.get("/api/news", (req, res) => res.json(news));
  app.post("/api/news", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    news.push(newItem);
    res.json(newItem);
  });
  app.put("/api/news/:id", (req, res) => {
    news = news.map(n => n.id === req.params.id ? { ...n, ...req.body } : n);
    res.json({ success: true });
  });
  app.delete("/api/news/:id", (req, res) => {
    news = news.filter(n => n.id !== req.params.id);
    res.json({ success: true });
  });

  // Jobs
  app.get("/api/jobs", (req, res) => res.json(jobs));
  app.post("/api/jobs", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    jobs.push(newItem);
    res.json(newItem);
  });
  app.put("/api/jobs/:id", (req, res) => {
    jobs = jobs.map(j => j.id === req.params.id ? { ...j, ...req.body } : j);
    res.json({ success: true });
  });
  app.delete("/api/jobs/:id", (req, res) => {
    jobs = jobs.filter(j => j.id !== req.params.id);
    res.json({ success: true });
  });

  // Orders
  app.get("/api/orders", (req, res) => res.json(orders));
  app.post("/api/orders", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    orders.push(newItem);
    res.json(newItem);
  });
  app.put("/api/orders/:id", (req, res) => {
    orders = orders.map(o => o.id === req.params.id ? { ...o, ...req.body } : o);
    res.json({ success: true });
  });
  app.delete("/api/orders/:id", (req, res) => {
    orders = orders.filter(o => o.id !== req.params.id);
    res.json({ success: true });
  });

  // Brands
  app.get("/api/brands", (req, res) => res.json(brands));
  app.post("/api/brands", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    brands.push(newItem);
    res.json(newItem);
  });
  app.put("/api/brands/:id", (req, res) => {
    brands = brands.map(b => b.id === req.params.id ? { ...b, ...req.body } : b);
    res.json({ success: true });
  });
  app.delete("/api/brands/:id", (req, res) => {
    brands = brands.filter(b => b.id !== req.params.id);
    res.json({ success: true });
  });

  // Coupons
  app.get("/api/coupons", (req, res) => res.json(coupons));
  app.post("/api/coupons", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    coupons.push(newItem);
    res.json(newItem);
  });
  app.put("/api/coupons/:id", (req, res) => {
    coupons = coupons.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
    res.json({ success: true });
  });
  app.delete("/api/coupons/:id", (req, res) => {
    coupons = coupons.filter(c => c.id !== req.params.id);
    res.json({ success: true });
  });

  // Activities
  app.get("/api/activities", (req, res) => res.json(activities));
  app.post("/api/activities", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    activities.push(newItem);
    res.json(newItem);
  });
  app.put("/api/activities/:id", (req, res) => {
    activities = activities.map(a => a.id === req.params.id ? { ...a, ...req.body } : a);
    res.json({ success: true });
  });
  app.delete("/api/activities/:id", (req, res) => {
    activities = activities.filter(a => a.id !== req.params.id);
    res.json({ success: true });
  });

  
  app.post("/api/admin/login", (req, res) => {
    // Mock JWT Auth response
    const { username, password } = req.body;
    if (username === "almar" && password === "12345A") {
      res.json({ token: "mock_jwt_token_12345", user: { role: "admin", name: "Super Admin" } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  console.log('NODE_ENV:', process.env.NODE_ENV);
  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static serving for production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
