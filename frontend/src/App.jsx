import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Checkout from "./pages/Checkout.jsx";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import { CartProvider } from "./context/CartContext";

import AdminOrders from "./pages/AdminOrders.jsx";
import AdminOrderDetail from "./pages/AdminOrderDetail.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";

// ⭐ Dashboard
import Dashboard from "./pages/Dashboard.jsx";
import AdminCategories from "./pages/AdminCategories";

// ⭐ NUEVAS PÁGINAS CLIENTE
import Novedades from "./pages/Novedades.jsx";
import Orders from "./pages/Orders.jsx";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        {/* PÚBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />

        {/* ⭐ CLIENTE */}
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/orders" element={<Orders />} />

        {/* ⭐ ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN PRODUCTOS */}
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <AdminProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/editar-producto/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />

        {/* ADMIN ÓRDENES */}
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <AdminOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>
              <AdminCategories />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <PrivateRoute>
              <AdminOrderDetail />
            </PrivateRoute>
          }
        />

        {/* CHECKOUT */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
      </Routes>

      <Footer />
    </CartProvider>
  );
}
