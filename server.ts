import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const dataFile = path.join(process.cwd(), "db.json");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // --- MongoDB Connection Optional Setup ---
  // Safely attempts to connect only if MONGODB_URI is provided
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✅ Successfully connected to MongoDB Atlas");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      // We do not throw error here to prevent app crash
    }
  } else {
    console.log("⚠️ No MONGODB_URI found. Defaulting to in-memory data store.");
  }

  app.get("/api/db-status", (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        statusStr: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
        hasUri: !!process.env.MONGODB_URI
    });
  });

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
      { id: "1", name: "Privacy Policy", path: "/policy/privacy", content: "This is our default privacy policy. Information is kept secure." },
      { id: "2", name: "Terms & Conditions", path: "/policy/terms", content: "These are the default terms and conditions of Almar Group." },
      { id: "3", name: "Refund Policy", path: "/policy/refund", content: "Our default refund policy states that items can be returned within 30 days." },
      { id: "4", name: "Sustainability", path: "/policy/sustainability", content: "We are committed to operating sustainably." },
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
    companyName: "Almar Group",
    tagline: "Empowering global growth",
    seoDescription: "Enterprise-grade MNC-style corporate website...",
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
    scrollingImages: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
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

  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf8");
      const savedDb = JSON.parse(raw);
      if (savedDb.products) products = savedDb.products;
      if (savedDb.news) news = savedDb.news;
      if (savedDb.jobs) jobs = savedDb.jobs;
      if (savedDb.orders) orders = savedDb.orders;
      if (savedDb.brands) brands = savedDb.brands;
      if (savedDb.coupons) coupons = savedDb.coupons;
      if (savedDb.activities) activities = savedDb.activities;
      if (savedDb.footerData) footerData = savedDb.footerData;
      if (savedDb.settings) settings = savedDb.settings;
    }
  } catch (e) {
    console.error("Error loading db.json", e);
  }

  const saveDb = () => {
    try {
      const state = { products, news, jobs, orders, brands, coupons, activities, footerData, settings };
      fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
    } catch(e) {
      console.error("Error saving db.json", e);
    }
  };

  // Helper function for sending responses
  const getById = (arr: any[], id: string) => arr.find(item => item.id === id);

  // Settings

  app.get("/api/settings", (req, res) => res.json(settings));
  app.put("/api/settings", (req, res) => {
    settings = { ...settings, ...req.body };
    saveDb();
    res.json({ success: true, settings });
  });

  // Footer
  app.get("/api/footer", (req, res) => res.json(footerData));
  app.put("/api/footer", (req, res) => {
    footerData = { ...footerData, ...req.body };
    saveDb();
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
    products.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/products/:id", (req, res) => {
    products = products.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/products/:id", (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // News
  app.get("/api/news", (req, res) => res.json(news));
  app.post("/api/news", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    news.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/news/:id", (req, res) => {
    news = news.map(n => n.id === req.params.id ? { ...n, ...req.body } : n);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/news/:id", (req, res) => {
    news = news.filter(n => n.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Jobs
  app.get("/api/jobs", (req, res) => res.json(jobs));
  app.post("/api/jobs", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    jobs.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/jobs/:id", (req, res) => {
    jobs = jobs.map(j => j.id === req.params.id ? { ...j, ...req.body } : j);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/jobs/:id", (req, res) => {
    jobs = jobs.filter(j => j.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Orders
  app.get("/api/orders", (req, res) => res.json(orders));
  app.post("/api/orders", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    orders.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/orders/:id", (req, res) => {
    orders = orders.map(o => o.id === req.params.id ? { ...o, ...req.body } : o);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/orders/:id", (req, res) => {
    orders = orders.filter(o => o.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Brands
  app.get("/api/brands", (req, res) => res.json(brands));
  app.post("/api/brands", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    brands.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/brands/:id", (req, res) => {
    brands = brands.map(b => b.id === req.params.id ? { ...b, ...req.body } : b);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/brands/:id", (req, res) => {
    brands = brands.filter(b => b.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Coupons
  app.get("/api/coupons", (req, res) => res.json(coupons));
  app.post("/api/coupons", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    coupons.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/coupons/:id", (req, res) => {
    coupons = coupons.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/coupons/:id", (req, res) => {
    coupons = coupons.filter(c => c.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Activities
  app.get("/api/activities", (req, res) => res.json(activities));
  app.post("/api/activities", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    activities.push(newItem); saveDb();
    res.json(newItem);
  });
  app.put("/api/activities/:id", (req, res) => {
    activities = activities.map(a => a.id === req.params.id ? { ...a, ...req.body } : a);
    saveDb();
    res.json({ success: true });
  });
  app.delete("/api/activities/:id", (req, res) => {
    activities = activities.filter(a => a.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  
  app.post("/api/admin/login", (req, res) => {
    // Mock JWT Auth response
    const { username, password } = req.body;
    if (username === "almar" && password === "12345A") {
      saveDb();
    res.json({ token: "mock_jwt_token_12345", user: { role: "admin", name: "Super Admin" } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard", (req, res) => {
    // Generate simple live stats from in-memory arrays
    
    // 1. By Goods
    const totalInventoryStock = products.reduce((acc, p) => acc + p.stock, 0);
    
    // 2. Orders & Revenue
    const activeOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");
    const pendingOrders = orders.filter(o => o.status === "Processing" || o.status === "Pending");
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    
    // 3. Customers
    // Assuming distinct customers by simple mapping of orders
    const customerOrders = orders.reduce((acc: any, o: any) => {
      const name = o.customer;
      if (!acc[name]) acc[name] = { id: name, name, ordersCount: 0, totalSpent: 0, orderHistory: [] };
      acc[name].ordersCount++;
      acc[name].totalSpent += o.total;
      acc[name].orderHistory.push(o);
      return acc;
    }, {});
    
    const topCustomersItems = Object.values(customerOrders)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map((c: any) => ({
        ...c,
        totalSpent: "৳ " + c.totalSpent.toFixed(2)
      }));

    // Top Products
    // Currently, orders don't have detailed items structurally mapped to products easily in dummy data,
    // so we mock a top products list using real product names
    const topProductsItems = products.slice(0, 10).map((p, i) => ({
      name: p.name,
      sales: `${1000 - i * 50} pcs`,
      revenue: `৳ ${(p.price * (1000 - i * 50)).toFixed(2)}`
    }));

    const slowMovingItems = products.filter(p => p.stock > 0).slice(0, 5).map(p => ({
      name: p.name,
      stock: `${p.stock} pcs`,
      lastSold: "Unknown"
    }));

    res.json({
      inventoryStock: totalInventoryStock,
      totalRevenue: totalRevenue,
      activeOrders: activeOrders.length,
      pendingOrders: pendingOrders.length,
      topCustomers: topCustomersItems,
      topProducts: topProductsItems,
      slowMovingItems: slowMovingItems,
      totalCustomers: Object.keys(customerOrders).length
    });
  });

  console.log('NODE_ENV:', process.env.NODE_ENV);
  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
