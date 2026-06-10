import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

dotenv.config();

const dataFile = path.join(process.cwd(), "db.json");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // --- Firebase Firestore Admin Core Setup ---
  let db: any = null;
  try {
    let firebaseConfig: any = {};
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        const app = initializeApp({
          credential: cert(serviceAccount)
        });
        const dbId = firebaseConfig.firestoreDatabaseId;
        db = dbId ? getFirestore(app, dbId) : getFirestore(app);
        console.log("✅ Successfully initialized Firebase Admin with explicit service account, DatabaseID:", dbId || "default");
      } catch (e) {
        console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT env:", e);
      }
    } else if (firebaseConfig.projectId) {
      const app = initializeApp({
        projectId: firebaseConfig.projectId
      });
      const dbId = firebaseConfig.firestoreDatabaseId;
      db = dbId ? getFirestore(app, dbId) : getFirestore(app);
      console.log("✅ Successfully initialized Firebase Admin Firestore (ADC), DatabaseID:", dbId || "default");
    }
  } catch (error) {
    console.error("⚠️ Error initializing Firebase Admin Firestore:", error);
  }

  // --- MongoDB Connection Optional Setup ---
  let isMongoConnected = false;

  // Define Mongoose Schema for persistent data
  const AppStateSchema = new mongoose.Schema({
    key: { type: String, default: "global", unique: true },
    products: Array,
    news: Array,
    jobs: Array,
    orders: Array,
    brands: Array,
    coupons: Array,
    activities: Array,
    footerData: Object,
    settings: Object
  }, { minimize: false, timestamps: true });

  const AppState = mongoose.models.AppState || mongoose.model("AppState", AppStateSchema);

  app.get("/api/db-status", (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        statusStr: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
        hasUri: !!process.env.MONGODB_URI,
        isMongoConnected
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

  let contacts: any[] = [];

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
    corpProfileTag: "Corporate Profile",
    globalTeamLabel: "Global Team",
    globalTeamSublabel: "10,000+ experts",
    globalTeamAvatars: [
      "https://i.pravatar.cc/100?img=12",
      "https://i.pravatar.cc/100?img=24",
      "https://i.pravatar.cc/100?img=36",
      "https://i.pravatar.cc/100?img=48"
    ],
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

  // Load state from Firestore first (highest priority for Cloud Run), then MongoDB, then db.json fallback
  const loadState = async () => {
    // 1. Try Firestore via firebase-admin
    if (db) {
      try {
        const docRef = db.collection("states").doc("global");
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          console.log("📥 Successfully loaded primary state from Firestore Cloud Database!");
          const data = docSnap.data();
          if (data) {
            if (data.products) products = data.products;
            if (data.news) news = data.news;
            if (data.jobs) jobs = data.jobs;
            if (data.orders) orders = data.orders;
            if (data.brands) brands = data.brands;
            if (data.coupons) coupons = data.coupons;
            if (data.activities) activities = data.activities;
            if (data.footerData) footerData = data.footerData;
            if (data.settings) settings = { ...settings, ...data.settings };
            if (data.contacts) contacts = data.contacts;
            
            // Sync to local file fallback
            try {
              const state = { products, news, jobs, orders, brands, coupons, activities, footerData, settings, contacts };
              fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
            } catch (fsErr) {
              // Ignore disk-write errors
            }
            return;
          }
        } else {
          console.log("📝 No state found in Firestore. Creating initial state...");
          const state = { products, news, jobs, orders, brands, coupons, activities, footerData, settings, contacts };
          await docRef.set(state);
        }
      } catch (err) {
        console.error("❌ Error loading state from Firestore:", err);
      }
    }

    // 2. Try MongoDB Atlas if connected
    if (isMongoConnected) {
      try {
        const stateDoc = await (AppState as any).findOne({ key: "global" });
        if (stateDoc) {
          console.log("📥 Loading state from MongoDB Atlas...");
          if (stateDoc.products) products = stateDoc.products;
          if (stateDoc.news) news = stateDoc.news;
          if (stateDoc.jobs) jobs = stateDoc.jobs;
          if (stateDoc.orders) orders = stateDoc.orders;
          if (stateDoc.brands) brands = stateDoc.brands;
          if (stateDoc.coupons) coupons = stateDoc.coupons;
          if (stateDoc.activities) activities = stateDoc.activities;
          if (stateDoc.footerData) footerData = stateDoc.footerData;
          if (stateDoc.settings) settings = { ...settings, ...stateDoc.settings };
          return;
        } else {
          console.log("📝 No state found in MongoDB Atlas. Initializing with defaults...");
          const newState = new AppState({
            key: "global",
            products,
            news,
            jobs,
            orders,
            brands,
            coupons,
            activities,
            footerData,
            settings
          });
          await newState.save();
        }
      } catch (err) {
        console.error("❌ Error loading state from MongoDB:", err);
      }
    }

    // 3. Fallback to local db.json
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
        if (savedDb.settings) settings = { ...settings, ...savedDb.settings };
        if (savedDb.contacts) contacts = savedDb.contacts;
        console.log("📥 Loaded state from local db.json fallback");
      }
    } catch (e) {
      console.error("Error loading db.json", e);
    }
  };

  const initDbAndState = async () => {
    // Connect to MongoDB if MONGODB_URI is provided
    if (process.env.MONGODB_URI) {
      try {
        console.log("🔌 Connecting to MongoDB Atlas (background)...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Successfully connected to MongoDB Atlas");
        isMongoConnected = true;
      } catch (err) {
        console.error("❌ MongoDB connection error:", err);
      }
    } else {
      console.log("⚠️ No MONGODB_URI found. Defaulting to in-memory/Firestore data store.");
    }
    // Load state from Firestore, MongoDB, or local json file (background)
    await loadState();
  };

  // Run database connection and state loading in the background (non-blocking)
  initDbAndState().then(() => {
    console.log("✨ Non-blocking database and state loading completed!");
  }).catch(err => {
    console.error("⚠️ Background initialization error:", err);
  });

  const saveDb = async () => {
    try {
      const state = { products, news, jobs, orders, brands, coupons, activities, footerData, settings, contacts };
      
      // 1. Save to local fallback file
      try {
        fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
      } catch (fsWriteErr) {
        console.error("Fail writing to local db.json:", fsWriteErr);
      }

      // 2. Save to temp-repo/db.json if temp-repo exists so GitHub commits capture it
      try {
        const tempRepoDir = path.join(process.cwd(), "temp-repo");
        if (fs.existsSync(tempRepoDir)) {
          fs.writeFileSync(path.join(tempRepoDir, "db.json"), JSON.stringify(state, null, 2));
          console.log("💾 Also saved state to temp-repo/db.json for GitHub commit sync");
        }
      } catch (errSync) {
        // Safe to ignore
      }

      // 3. Save to Firestore asynchronously
      if (db) {
        try {
          await db.collection("states").doc("global").set(state);
          console.log("💾 Successfully updated state in Firestore Cloud Database!");
        } catch (err) {
          console.error("❌ Error updating state in Firestore:", err);
        }
      }

      // 4. Save to MongoDB asynchronously if connected
      if (isMongoConnected) {
        try {
          await (AppState as any).updateOne(
            { key: "global" },
            { $set: state },
            { upsert: true }
          );
          console.log("💾 Successfully updated state in MongoDB Atlas!");
        } catch (err) {
          console.error("❌ Error updating state in MongoDB:", err);
        }
      }
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

  // --- Contact Us Send Message Feature ---
  // Helper to dispatch email (SMTP with standard console fallback)
  const sendContactEmail = async (data: {
    name: string;
    address: string;
    mobile: string;
    email?: string;
    description: string;
    attachmentName?: string;
    attachmentData?: string;
  }) => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "paragondff@gmail.com";

    console.log(`✉️ Dispatching contact email for ${data.name} to receiver: ${toEmail}`);

    const mailOptions: any = {
      from: `"Almar Inquiry Portal" <${user || "support@almargroup.com"}>`,
      to: toEmail,
      subject: `New Corporate Inquiry: ${data.name}`,
      text: `
Almar Group Corporate Contact Form Submitted:

Name: ${data.name}
Mobile: ${data.mobile}
Address: ${data.address}
Email: ${data.email || "Not provided"}

Inquiry Message:
------------------------------------------
${data.description}
------------------------------------------
${data.attachmentName ? `Attachment: ${data.attachmentName}` : ""}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #2d3748; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="background-color: #0b1a30; padding: 15px; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">ALMAR GROUP CONTACT PORTAL</h2>
          </div>
          <div style="padding-top: 20px;">
            <p style="font-size: 15px; font-weight: 600; color: #0b1a30; margin-top: 0;">New Support inquiry details below:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f7fafc;">
                <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #4a5568; width: 30%; border: 1px solid #edf2f7;">Full Name</td>
                <td style="padding: 10px; font-size: 13px; color: #1a202c; border: 1px solid #edf2f7;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #4a5568; border: 1px solid #edf2f7;">Mobile Number</td>
                <td style="padding: 10px; font-size: 13px; color: #1a202c; border: 1px solid #edf2f7;">${data.mobile}</td>
              </tr>
              <tr style="background-color: #f7fafc;">
                <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #4a5568; border: 1px solid #edf2f7;">Address</td>
                <td style="padding: 10px; font-size: 13px; color: #1a202c; border: 1px solid #edf2f7;">${data.address}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; font-size: 13px; color: #4a5568; border: 1px solid #edf2f7;">Email</td>
                <td style="padding: 10px; font-size: 13px; color: #1a202c; border: 1px solid #edf2f7;">${data.email || `<span style="color: #a0aec0; font-style: italic;">Not provided</span>`}</td>
              </tr>
            </table>

            <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #edc531; margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px;">Message Description:</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2d3748; white-space: pre-wrap;">${data.description}</p>
            </div>

            ${data.attachmentName ? `
              <div style="font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; padding-top: 15px; display: flex; align-items: center; gap: 6px;">
                📎 <strong>Attached:</strong> <span style="color: #4a5568;">${data.attachmentName}</span>
              </div>
            ` : ""}
          </div>
          <div style="margin-top: 25px; border-top: 1px solid #edf2f7; padding-top: 15px; text-align: center; font-size: 11px; color: #a0aec0;">
            © ${new Date().getFullYear()} Almar Group Inc. Sent from website contact footer widget.
          </div>
        </div>
      `
    };

    if (data.attachmentName && data.attachmentData) {
      try {
        const commaIdx = data.attachmentData.indexOf(",");
        if (commaIdx !== -1) {
          const base64Content = data.attachmentData.slice(commaIdx + 1);
          mailOptions.attachments = [{
            filename: data.attachmentName,
            content: base64Content,
            encoding: "base64"
          }];
        }
      } catch (err) {
        console.error("❌ Error attaching file to nodemailer:", err);
      }
    }

    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        await transporter.sendMail(mailOptions);
        console.log("🚀 Nodemailer: Email sent successfully via SMTP!");
      } catch (smtpErr) {
        console.error("❌ SMTP Nodemailer delivery failed:", smtpErr);
      }
    } else {
      console.log("⚠️ SMTP_HOST/USER/PASS configuration missing in .env. Falling back to log stream verification.");
      console.log("📧 Simulated mail body detail:\n", mailOptions.text);
    }
  };

  app.post("/api/contact", async (req, res) => {
    const { name, address, mobile, email, description, attachmentName, attachmentData } = req.body;
    
    if (!name || !address || !mobile || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const newInquiryId = Date.now().toString();
    const newContact = {
      id: newInquiryId,
      name,
      address,
      mobile,
      email: email || null,
      description,
      attachmentName: attachmentName || null,
      attachmentData: attachmentData || null,
      read: false,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Permanently store the message in Firestore
      if (db) {
        try {
          await db.collection("contacts").add({
            name,
            address,
            mobile,
            email: email || null,
            description,
            attachmentName: attachmentName || null,
            attachmentData: attachmentData || null,
            read: false,
            createdAt: FieldValue.serverTimestamp()
          });
          console.log("💾 Successfully logged inquiry to Firestore 'contacts' collection.");
        } catch (dbErr) {
          console.error("❌ Firestore failed logging inquiry:", dbErr);
        }
      }

      // Also append to local memory array
      contacts.unshift(newContact);
      await saveDb();

      // 2. We DO NOT send email, as requested by the user ("seta mail na asey website a akta notification asbe")
      console.log(`✉️ Onsite notification received for: ${name}. SMTP email delivery bypassed.`);
      
      res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (err: any) {
      console.error("❌ Error handling contact message:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to process inquiry request." });
    }
  });

  // --- Real-Time Onsite Inquiry Notifications API ---
  app.get("/api/contacts", async (req, res) => {
    if (db) {
      try {
        const snapshot = await db.collection("contacts").orderBy("createdAt", "desc").get();
        const list = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          const createdAtDoc = data.createdAt;
          let createdAt = new Date().toISOString();
          if (createdAtDoc) {
            if (typeof createdAtDoc.toDate === "function") {
              createdAt = createdAtDoc.toDate().toISOString();
            } else if (createdAtDoc._seconds) {
              createdAt = new Date(createdAtDoc._seconds * 1000).toISOString();
            } else {
              createdAt = createdAtDoc;
            }
          }
          return {
            id: doc.id,
            ...data,
            createdAt
          };
        });
        return res.json(list);
      } catch (err) {
        console.error("Firestore contacts retrieval failed, using fallback:", err);
      }
    }
    // Return sorted local contacts
    const sorted = [...contacts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    res.json(sorted);
  });

  app.put("/api/contacts/:id/read", async (req, res) => {
    const { id } = req.params;
    if (db) {
      try {
        // First try finding if the document ID matches directly
        const docRef = db.collection("contacts").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update({ read: true });
          console.log(`💾 Marked contact ${id} as read in Firestore`);
          return res.json({ success: true });
        } else {
          // Fallback search by client-generated ID field if the firestore key is autogenerated
          const querySnap = await db.collection("contacts").where("id", "==", id).get();
          if (!querySnap.empty) {
            for (const d of querySnap.docs) {
              await d.ref.update({ read: true });
            }
            console.log(`💾 Marked contact with query ID ${id} as read in Firestore`);
            return res.json({ success: true });
          }
        }
      } catch (err) {
        console.error("Firestore contacts read update failed:", err);
      }
    }
    // Mark local in-memory contact as read
    contacts = contacts.map(c => c.id === id ? { ...c, read: true } : c);
    await saveDb();
    res.json({ success: true });
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    const { id } = req.params;
    if (db) {
      try {
        // Try deleting by document key
        const docRef = db.collection("contacts").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.delete();
          console.log(`💾 Deleted contact ${id} from Firestore`);
          return res.json({ success: true });
        } else {
          // Fallback search by custom ID is needed
          const querySnap = await db.collection("contacts").where("id", "==", id).get();
          if (!querySnap.empty) {
            for (const d of querySnap.docs) {
              await d.ref.delete();
            }
            console.log(`💾 Deleted contact field ID ${id} from Firestore`);
            return res.json({ success: true });
          }
        }
      } catch (err) {
        console.error("Firestore contacts delete failed:", err);
      }
    }
    // Delete in-memory contact
    contacts = contacts.filter(c => c.id !== id);
    await saveDb();
    res.json({ success: true });
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

  // Render-safe robust production detection.
  // In many production environments (like Render), NODE_ENV might not be set to "production",
  // but if the 'dist' directory and 'index.html' exists, we are definitely running the built production app.
  const distPath = path.join(process.cwd(), "dist");
  const hasBuiltAssets = fs.existsSync(path.join(distPath, "index.html"));
  const isProduction = process.env.NODE_ENV === "production" || hasBuiltAssets;

  console.log('Detected Mode - isProduction:', isProduction, '| NODE_ENV:', process.env.NODE_ENV);

  // --- Vite Middleware for Development ---
  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("🎮 Server running in development mode (Vite middleware active)");
    } catch (viteErr: any) {
      console.warn("⚠️ Failed to load Vite development middleware, falling back to static serving:", viteErr?.message || viteErr);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    // Static serving for production
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, "utf8");
          const companyNameStr = settings.companyName || "Almar Group";
          const taglineStr = settings.tagline || "Empowering Global Growth";
          const descStr = settings.aboutDesc || "A diversified conglomerate committed to excellence, innovation, and sustainable growth across multiple industries.";
          const titleStr = `${companyNameStr} | ${taglineStr}`;
          
          // Replace title tag
          html = html.replace(/<title>.*?<\/title>/, `<title>${titleStr}</title>`);
          
          // Inject/replace Og / Open graph and standard meta tags to match custom settings
          const metaTags = `
    <!-- Dynamic Metatags -->
    <meta name="description" content="${descStr.replace(/"/g, '&quot;')}" />
    <meta property="og:title" content="${titleStr.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${descStr.replace(/"/g, '&quot;')}" />
    <meta property="og:site_name" content="${companyNameStr.replace(/"/g, '&quot;')}" />
    <meta name="twitter:title" content="${titleStr.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${descStr.replace(/"/g, '&quot;')}" />
          `;
          
          html = html.replace("</head>", `${metaTags}\n  </head>`);
          res.send(html);
        } else {
          res.sendFile(indexPath);
        }
      } catch (err) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
