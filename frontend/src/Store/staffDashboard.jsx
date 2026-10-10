
import { useEffect, useState } from "react";
import {
  getProducts,
  saveProducts,
  getOrders,
  saveOrders,
  formatPrice,
} from "./storeData";
import "./store.css";

export default function StaffDashboard() {
  const [products, setProducts] = useState(getProducts);
  const [orders, setOrders] = useState(getOrders);

  const emptyForm = {
    name: "",
    category: "Snacks",
    price: "",
    stock: "",
    emoji: "📦",
  };

  const [form, setForm] = useState(emptyForm);

  function refresh() {
    setProducts(getProducts());
    setOrders(getOrders());
  }

  useEffect(() => {
    window.addEventListener("store-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("store-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function addProduct(event) {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(stock) || stock < 0) {
      alert("Enter a name, positive price and valid stock quantity.");
      return;
    }

    const product = {
      id: Date.now(),
      name,
      category: form.category,
      price,
      stock,
      emoji: form.emoji || "📦",
    };

    saveProducts([...getProducts(), product]);
    setForm(emptyForm);
    refresh();
  }

  function editProduct(product) {
    const name = prompt("Product name:", product.name);
    if (name === null) return;

    const priceInput = prompt("Price:", String(product.price));
    if (priceInput === null) return;

    const stockInput = prompt("Stock quantity:", String(product.stock));
    if (stockInput === null) return;

    const price = Number(priceInput);
    const stock = Number(stockInput);

    if (!name.trim() || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(stock) || stock < 0) {
      alert("Invalid product details.");
      return;
    }

    const updated = getProducts().map((p) =>
      p.id === product.id
        ? { ...p, name: name.trim(), price, stock }
        : p
    );

    saveProducts(updated);
    refresh();
  }

  function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    saveProducts(getProducts().filter((p) => p.id !== id));
    refresh();
  }

  function updateStatus(orderId, status) {
    const updated = getOrders().map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(updated);
    refresh();
  }

  const collectedValue = orders
    .filter((order) => order.status === "Collected")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="store-page">
      <header className="store-header">
        <div>
          <p className="store-eyebrow">CAMPUSEASE</p>
          <h1>Store Staff Dashboard</h1>
          <p>Manage inventory and Customers orders.</p>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Products</span><strong>{products.length}</strong>
        </article>
        <article className="stat-card">
          <span>Total Orders</span><strong>{orders.length}</strong>
        </article>
        <article className="stat-card">
          <span>Pending Orders</span>
          <strong>{orders.filter((o) => o.status === "Pending").length}</strong>
        </article>
        <article className="stat-card">
          <span>Collected Order Value</span>
          <strong>{formatPrice(collectedValue)}</strong>
        </article>
      </section>

      <section className="store-panel">
        <h2>Add New Product</h2>
        <form className="product-form" onSubmit={addProduct}>
          <label>
            Product Name
            <input required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label>
            Category
            <select value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Snacks", "Beverages", "Stationery", "Essentials", "Groceries"]
                .map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Price (₹)
            <input required type="number" min="0.01" step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>

          <label>
            Stock
            <input required type="number" min="0" step="1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </label>

          <label>
            Emoji
            <input value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
          </label>

          <button className="primary-button" type="submit">Add Product</button>
        </form>
      </section>

      <section className="store-panel">
        <h2>Inventory</h2>
        <div className="table-wrap">
          <table className="store-table">
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th>
                <th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.emoji} {p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => editProduct(p)}>Edit</button>{" "}
                    <button className="danger-button"
                      onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="store-panel">
        <h2>Customer Orders</h2>
        {orders.length === 0 && <p>No orders received yet.</p>}

        {orders.map((order) => (
          <article className="order-row" key={order.id}>
            <div>
              <strong>{order.token}</strong>
              <p>{order.createdAt}</p>
              <p>{order.items.map((i) =>
                `${i.name} × ${i.quantity}`).join(", ")}</p>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div className="order-actions">
              <span className="status-pill">{order.status}</span>
              <select value={order.status}
                aria-label={`Status for ${order.token}`}
                onChange={(e) => updateStatus(order.id, e.target.value)}>
                {["Pending", "Preparing", "Ready", "Collected"].map((s) =>
                  <option key={s}>{s}</option>)}
              </select>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
