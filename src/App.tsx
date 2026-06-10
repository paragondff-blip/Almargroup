/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/Home";
import Brands from "./pages/Brands";
import Activities from "./pages/Activities";
import News from "./pages/News";
import Careers from "./pages/Careers";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import Policy from "./pages/Policy";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminSettings from "./pages/admin/Settings";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import TrackOrder from "./pages/TrackOrder";
import AdminBrands from "./pages/admin/Brands";
import AdminActivities from "./pages/admin/Activities";
import AdminCareers from "./pages/admin/Careers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminNews from "./pages/admin/News";
import AdminFooterSettings from "./pages/admin/FooterSettings";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.corpTitle) {
           document.title = data.corpTitle;
        }
        if (data.mainLogo) {
           let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
           if (!link) {
             link = document.createElement('link');
             link.rel = 'icon';
             document.head.appendChild(link);
           }
           link.href = data.mainLogo;
        }
      });
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="brands" element={<Brands />} />
          <Route path="activities" element={<Activities />} />
          <Route path="news" element={<News />} />
          <Route path="shop" element={<Shop />} />
          <Route path="career" element={<Careers />} />
          <Route path="about" element={<About />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="policy/:slug" element={<Policy />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="footer" element={<AdminFooterSettings />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
