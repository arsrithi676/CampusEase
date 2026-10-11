import { useEffect, useState } from "react";
import StaffLogin from "./StaffLogin";
import StaffDashboard from "./staffDashboard";
import {
  getProducts,
  getOrders,
  saveProducts,
  saveOrders,
  createToken,
  formatPrice,
} from "./storeData";
import "./store.css";

export default function StorePage() {
  const [products, setProducts] = useState(getProducts);
  const [orders, setOrders] = useState(getOrders);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [paymentStep, setPaymentStep] = useState("cart");
  const [isStaff, setIsStaff] = useState(null);

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

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return (
      matchesSearch &&
      (category === "All" || product.category === category)
    );
  });

  const cartItems = products
    .filter((product) => (cart[product.id] || 0) > 0)
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function changeQuantity(product, amount) {
    const next = (cart[product.id] || 0) + amount;

    if (next < 0) return;

    if (next > product.stock) {
      setMessage(
        `Only ${product.stock} units of ${product.name} are available.`
      );
      return;
    }

    setCart((previous) => ({
      ...previous,
      [product.id]: next,
    }));

    setMessage("");
  }

  function checkout() {
    if (cartItems.length === 0) {
      setMessage("Add products to your cart before checkout.");
      return;
    }

    const latestProducts = getProducts();

    const unavailable = cartItems.find((item) => {
      const latest = latestProducts.find((p) => p.id === item.id);
      return !latest || latest.stock < item.quantity;
    });

    if (unavailable) {
      refresh();
      setMessage(
        "Stock changed. Please check your cart and try again."
      );
      return;
    }

    setMessage("");
    setPaymentStep("payment");
  }

  // FRONTEND DEMO ONLY.
  // This does not verify a real Razorpay payment.
  function confirmDemoPayment() {
    if (cartItems.length === 0) {
      setPaymentStep("cart");
      setMessage("Your cart is empty.");
      return;
    }

    const latestProducts = getProducts();

    const unavailable = cartItems.find((item) => {
      const latest = latestProducts.find((p) => p.id === item.id);
      return !latest || latest.stock < item.quantity;
    });

    if (unavailable) {
      refresh();
      setPaymentStep("cart");
      setMessage(
        "Stock changed. Please check your cart and try again."
      );
      return;
    }

    const updatedProducts = latestProducts.map((product) => ({
      ...product,
      stock: product.stock - (cart[product.id] || 0),
    }));

    const token = createToken();

    const order = {
      id: `${Date.now()}-${token}`,
      token,
      items: cartItems.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      })),
      total,
      status: "Pending",
      paymentStatus: "demo-unverified",
      paymentMethod: "UPI QR (DEMO ONLY)",
      createdAt: new Date().toLocaleString(),
    };

    saveProducts(updatedProducts);
    saveOrders([order, ...getOrders()]);

    setCart({});
    setPaymentStep("cart");
    setMessage(
      `DEMO ONLY: Order ${token} created. No real payment was verified.`
    );

    refresh();
  }
if (isStaff === "login") {
  return (
    <StaffLogin
      onLogin={() => setIsStaff("dashboard")}
    />
  );
}

if (isStaff === "dashboard") {
  return <StaffDashboard />;
}

if (isStaff === "dashboard") {
  return <StaffDashboard />;
}

  return (
    <main className="store-page">
      <header className="store-header">
        <div>
          <p className="store-eyebrow">CAMPUSEASE</p>
          <h1>Campus Store</h1>
          <p>Groceries and daily essentials for campus life.</p>
        </div>

        <a className="store-cart-link" href="#my-cart">
          🛒 Cart (
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </a>
      </header>
      <div className="store-staff-access">
          <button onClick={() => setIsStaff("login")}>
              Staff Login
  </button>
</div>

      {message && <p className="store-message">{message}</p>}

      <div className="store-toolbar">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <h2>Available Products</h2>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-emoji">{product.emoji}</div>

            <span className="product-category">
              {product.category}
            </span>

            <h3>{product.name}</h3>

            <p className="product-price">
              {formatPrice(product.price)}
            </p>

            <p className="product-stock">
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>

            <button
              disabled={product.stock === 0}
              onClick={() => changeQuantity(product, 1)}
            >
              Add to Cart
            </button>
          </article>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p>No matching products found.</p>
      )}

      {paymentStep === "cart" ? (
        <section className="store-panel" id="my-cart">
          <h2>Your Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{formatPrice(item.price)} each</p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() => changeQuantity(item, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => changeQuantity(item, 1)}
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}

              <h3 className="cart-total">
                Total: {formatPrice(total)}
              </h3>

              <button
                className="primary-button"
                onClick={checkout}
              >
                Proceed to Payment
              </button>
            </>
          )}
        </section>
      ) : (
        <section className="store-panel" id="my-cart">
          <h2>UPI QR Payment</h2>

          <p>Review your order total before proceeding.</p>

          <h3 className="cart-total">
            Amount to Pay: {formatPrice(total)}
          </h3>

          <div className="upi-demo-notice">
            <h3>QR Payment Preview</h3>

            <div className="upi-qr-placeholder">
              <span>QR</span>
              <p>Razorpay QR will appear here</p>
            </div>

            <p>
              This is a frontend preview only. No real payment
              can be made using this placeholder. A real QR code
              will be provided after Razorpay backend integration.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={confirmDemoPayment}
          >
            Simulate Payment (Demo Only)
          </button>

          <button
            onClick={() => {
              setPaymentStep("cart");
              setMessage("");
            }}
          >
            ← Back to Cart
          </button>
        </section>
      )}

      <section className="store-panel">
        <h2>My Recent Orders</h2>

        {orders.length === 0 && <p>No orders placed yet.</p>}

        {orders.map((order) => (
          <article className="order-row" key={order.id}>
            <div>
              <strong>{order.token}</strong>

              <p>{order.createdAt}</p>

              <p>
                {order.items
                  .map((item) => `${item.name} × ${item.quantity}`)
                  .join(", ")}
              </p>

              {order.paymentMethod && (
                <p>Payment: {order.paymentMethod}</p>
              )}

              {order.paymentStatus && (
                <p>
                  Payment status:{" "}
                  {order.paymentStatus === "demo-unverified"
                    ? "Demo — not verified"
                    : order.paymentStatus}
                </p>
              )}
            </div>

            <div className="order-summary">
              <strong>{formatPrice(order.total)}</strong>
              <span className="status-pill">{order.status}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}