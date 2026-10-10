
import { useState } from "react";
import "./Canteens.css";

const FOOD_CATEGORIES = [
  "Tiffins",
  "Snacks",
  "Meals",
  "Curries",
  "Rice & Biryani",
  "Rotis & Breads",
  "Fast Food",
  "Beverages",
  "Desserts",
  "Other",
];

const initialMenus = {
  "Main Canteen": [
    { id: 1, name: "Veg Meals", price: 60, emoji: "🍛", category: "Meals", available: true },
    { id: 2, name: "Masala Dosa", price: 40, emoji: "🥞", category: "Tiffins", available: true },
    { id: 3, name: "Idli (2 pcs)", price: 25, emoji: "🥘", category: "Tiffins", available: true },
    { id: 4, name: "Veg Fried Rice", price: 70, emoji: "🍚", category: "Rice & Biryani", available: true },
    { id: 5, name: "Paneer Roll", price: 50, emoji: "🌯", category: "Snacks", available: true },
    { id: 6, name: "Fresh Lime Juice", price: 25, emoji: "🍋", category: "Beverages", available: true },
    { id: 13, name: "Paneer Butter Masala", price: 90, emoji: "🥘", category: "Curries", available: true },
    { id: 14, name: "Chapati", price: 15, emoji: "🫓", category: "Rotis & Breads", available: true },
    { id: 15, name: "Gulab Jamun", price: 30, emoji: "🍮", category: "Desserts", available: true },
  ],
  "Night Canteen": [
    { id: 7, name: "Veg Sandwich", price: 40, emoji: "🥪", category: "Snacks", available: true },
    { id: 8, name: "Maggi", price: 35, emoji: "🍜", category: "Fast Food", available: true },
    { id: 9, name: "Egg Fried Rice", price: 70, emoji: "🍳", category: "Rice & Biryani", available: true },
    { id: 10, name: "French Fries", price: 45, emoji: "🍟", category: "Snacks", available: true },
    { id: 11, name: "Chicken Roll", price: 65, emoji: "🌯", category: "Snacks", available: true },
    { id: 12, name: "Hot Coffee", price: 20, emoji: "☕", category: "Beverages", available: true },
    { id: 16, name: "Chicken Curry", price: 100, emoji: "🍗", category: "Curries", available: true },
    { id: 17, name: "Chicken Biryani", price: 120, emoji: "🍛", category: "Rice & Biryani", available: true },
    { id: 18, name: "Brownie", price: 45, emoji: "🍫", category: "Desserts", available: true },
  ],
};

const ORDER_STATUSES = [
  "New",
  "Preparing",
  "Ready for Collection",
  "Collected",
  "Cancelled",
];

const emptyForm = {
  name: "",
  price: "",
  emoji: "🍽️",
  category: "Tiffins",
};

function getStatusClass(status) {
  switch (status) {
    case "Preparing":
      return "status-preparing";
    case "Ready for Collection":
      return "status-ready";
    case "Collected":
      return "status-collected";
    case "Cancelled":
      return "status-cancelled";
    default:
      return "status-available";
  }
}

function Canteens({ canteenName = "Main Canteen", onBack }) {
  const [menus, setMenus] = useState(initialMenus);
  const [quantities, setQuantities] = useState({});
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("menu");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [staffId, setStaffId] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffLoggedIn, setStaffLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Demo payment state
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const currentCanteen =
    canteenName === "Night Canteen" ? "Night Canteen" : "Main Canteen";

  const currentMenu = menus[currentCanteen] || [];

  const visibleMenu = currentMenu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory && item.available;
  });

  const cartItems = currentMenu.filter(
    (item) => (quantities[item.id] || 0) > 0
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + quantities[item.id],
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * quantities[item.id],
    0
  );

  const currentOrders = orders.filter(
    (order) => order.canteen === currentCanteen
  );

  const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

  const updateQuantity = (itemId, amount) => {
    const item = currentMenu.find((menuItem) => menuItem.id === itemId);
    if (!item || !item.available) return;

    setQuantities((previous) => ({
      ...previous,
      [itemId]: Math.max(0, (previous[itemId] || 0) + amount),
    }));
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      setMessage("Add items to your cart before placing your order.");
      return;
    }

    setMessage("");

    if (paymentMethod === "Cash at Canteen") {
      completeCheckout("Pending");
      return;
    }

    setShowPaymentModal(true);
  };

  const completeCheckout = (paymentStatus) => {
    const token = `CE${Date.now().toString().slice(-6)}`;

    const newOrder = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      token,
      canteen: currentCanteen,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id],
        emoji: item.emoji,
      })),
      total: cartTotal,
      status: "New",
      paymentMethod,
      paymentStatus,
      createdAt: new Date().toLocaleString(),
    };

    setOrders((previous) => [newOrder, ...previous]);
    setQuantities({});
    setShowPaymentModal(false);
    setMessage(
      paymentStatus === "Paid"
        ? `Demo payment successful! Your order token is ${token}.`
        : `Cash payment selected. Please pay at the canteen. Your token is ${token}.`
    );
    setActiveTab("orders");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const simulatePaymentFailure = () => {
    setShowPaymentModal(false);
    setMessage("Demo payment failed. Your cart has been saved. Please try again.");
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    setMessage("Order status updated successfully.");
  };

  const handleStaffLogin = (event) => {
    event.preventDefault();

    if (staffId.trim() === "STAFF001" && staffPassword === "staff123") {
      setStaffLoggedIn(true);
      setRole("staff");
      setLoginError("");
      setStaffPassword("");
      setMessage("");
      setActiveTab("manage");
    } else {
      setLoginError("Invalid Staff ID or Password.");
    }
  };

  const handleStaffLogout = () => {
    setStaffLoggedIn(false);
    setRole("customer");
    setStaffId("");
    setStaffPassword("");
    setLoginError("");
    setMessage("");
    setActiveTab("menu");
  };

  const changeRole = (nextRole) => {
    setRole(nextRole);
    setMessage("");
    setLoginError("");

    if (nextRole === "customer") {
      setStaffLoggedIn(false);
      setStaffPassword("");
      setActiveTab("menu");
    } else {
      setActiveTab("manage");
    }
  };

  const updateFormField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveMenuItem = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      setMessage("Enter a valid item name and price.");
      return;
    }

    if (editingId !== null) {
      setMenus((previous) => ({
        ...previous,
        [currentCanteen]: previous[currentCanteen].map((item) =>
          item.id === editingId
            ? {
                ...item,
                name,
                price,
                emoji: form.emoji.trim() || "🍽️",
                category: form.category,
              }
            : item
        ),
      }));
      setMessage("Menu item updated successfully.");
    } else {
      const newItem = {
        id: Date.now(),
        name,
        price,
        emoji: form.emoji.trim() || "🍽️",
        category: form.category,
        available: true,
      };

      setMenus((previous) => ({
        ...previous,
        [currentCanteen]: [...previous[currentCanteen], newItem],
      }));
      setMessage(`${name} added to ${form.category} successfully.`);
    }

    setSelectedCategory("All");
    resetForm();
  };

  const editMenuItem = (item) => {
    setForm({
      name: item.name,
      price: String(item.price),
      emoji: item.emoji,
      category: item.category,
    });
    setEditingId(item.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMenuItem = (itemId) => {
    if (!window.confirm("Are you sure you want to remove this menu item?")) {
      return;
    }

    setMenus((previous) => ({
      ...previous,
      [currentCanteen]: previous[currentCanteen].filter(
        (item) => item.id !== itemId
      ),
    }));

    setQuantities((previous) => {
      const next = { ...previous };
      delete next[itemId];
      return next;
    });

    if (editingId === itemId) resetForm();
    setMessage("Menu item removed successfully.");
  };

  const toggleAvailability = (itemId) => {
    setMenus((previous) => ({
      ...previous,
      [currentCanteen]: previous[currentCanteen].map((item) =>
        item.id === itemId
          ? { ...item, available: !item.available }
          : item
      ),
    }));
  };

  return (
    <div className="canteen-module">
      <header className="canteen-module-header">
        <div className="canteen-header-left">
          {onBack && (
            <button
              type="button"
              className="canteen-back"
              onClick={onBack}
            >
              ← Back
            </button>
          )}

          <div>
            <span className="canteen-label">CAMPUSEASE</span>
            <h1>{currentCanteen}</h1>
            <p>Order your favourites, skip the queue.</p>
          </div>
        </div>
        <div className="canteen-header-badge">🍽️</div>
      </header>

      <div className="canteen-role-panel">
        <span className="canteen-label">Select your role</span>
        <div className="canteen-role-buttons">
          <button
            type="button"
            className={role === "customer" ? "active" : ""}
            onClick={() => changeRole("customer")}
          >
            🎒 Customer
          </button>
          <button
            type="button"
            className={role === "staff" ? "active" : ""}
            onClick={() => changeRole("staff")}
          >
            🧑‍🍳 Staff
          </button>
        </div>
      </div>

      {message && (
        <div className="canteen-feedback" role="status">
          <span>{message}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {role === "staff" && !staffLoggedIn && (
        <section className="canteen-staff-login">
          <div className="canteen-login-icon">🔐</div>
          <h2>Staff Login</h2>
          <p>Enter your staff credentials to continue.</p>

          <form onSubmit={handleStaffLogin}>
            <label htmlFor="staffId">Staff ID</label>
            <input
              id="staffId"
              type="text"
              placeholder="Enter Staff ID"
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="staffPassword">Password</label>
            <input
              id="staffPassword"
              type="password"
              placeholder="Enter Password"
              value={staffPassword}
              onChange={(event) => setStaffPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            {loginError && <p className="canteen-login-error">{loginError}</p>}

            <button type="submit" className="canteen-primary-button">
              Login
            </button>
            <button
              type="button"
              className="canteen-secondary-button"
              onClick={() => changeRole("customer")}
            >
              Back to Customer
            </button>
          </form>
        </section>
      )}

      {role === "customer" && (
        <>
          <nav className="canteen-tabs">
            <button
              type="button"
              className={activeTab === "menu" ? "active" : ""}
              onClick={() => setActiveTab("menu")}
            >
              🍴 Menu
            </button>
            <button
              type="button"
              className={activeTab === "cart" ? "active" : ""}
              onClick={() => setActiveTab("cart")}
            >
              🛒 Cart {cartCount > 0 && <span className="canteen-tab-count">{cartCount}</span>}
            </button>
            <button
              type="button"
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              📋 My Orders
            </button>
          </nav>

          <main className="canteen-content">
            {activeTab === "menu" && (
              <>
                <div className="canteen-section-heading">
                  <div>
                    <h2>Explore the Menu</h2>
                    <p>Freshly prepared campus favourites.</p>
                  </div>
                  <span className="canteen-item-count">{visibleMenu.length} items</span>
                </div>

                <input
                  className="canteen-search"
                  type="search"
                  placeholder="Search food or category..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <div className="canteen-category-filters">
                  <button
                    type="button"
                    className={selectedCategory === "All" ? "active" : ""}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All Items
                  </button>
                  {FOOD_CATEGORIES.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={selectedCategory === category ? "active" : ""}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="canteen-food-grid">
                  {visibleMenu.map((item) => (
                    <article className="canteen-food-card" key={item.id}>
                      <div className="canteen-food-top">
                        <span className="canteen-food-emoji">{item.emoji}</span>
                        <span className="canteen-category">{item.category}</span>
                      </div>
                      <h3>{item.name}</h3>
                      <div className="canteen-food-bottom">
                        <strong>{formatPrice(item.price)}</strong>
                        <div className="canteen-quantity">
                          <button
                            type="button"
                            aria-label={`Remove one ${item.name}`}
                            disabled={!quantities[item.id]}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            −
                          </button>
                          <span>{quantities[item.id] || 0}</span>
                          <button
                            type="button"
                            aria-label={`Add one ${item.name}`}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {visibleMenu.length === 0 && (
                  <div className="canteen-empty">
                    <span>🔎</span>
                    <h3>No items found</h3>
                    <p>Try another category or search term.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "cart" && (
              <>
                <div className="canteen-section-heading">
                  <div>
                    <h2>Your Cart</h2>
                    <p>Review your items before placing your order.</p>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="canteen-empty">
                    <span>🛒</span>
                    <h3>Your cart is empty</h3>
                    <p>Add something delicious from the menu.</p>
                    <button
                      type="button"
                      className="canteen-primary-button"
                      onClick={() => setActiveTab("menu")}
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="canteen-cart-list">
                      {cartItems.map((item) => (
                        <div className="canteen-cart-item" key={item.id}>
                          <span className="canteen-cart-emoji">{item.emoji}</span>
                          <div className="canteen-cart-info">
                            <h3>{item.name}</h3>
                            <p>{formatPrice(item.price)} × {quantities[item.id]}</p>
                          </div>
                          <div className="canteen-quantity">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              −
                            </button>
                            <span>{quantities[item.id]}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <strong className="canteen-cart-subtotal">
                            {formatPrice(item.price * quantities[item.id])}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <section className="canteen-payment-methods">
                      <h3>Choose Payment Method</h3>

                      <label className={`canteen-payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="UPI"
                          checked={paymentMethod === "UPI"}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <span className="canteen-payment-emoji">📱</span>
                        <span className="canteen-payment-copy">
                          <strong>UPI</strong>
                          <small>Google Pay, PhonePe, Paytm (demo)</small>
                        </span>
                      </label>

                      <label className={`canteen-payment-option ${paymentMethod === "Card" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Card"
                          checked={paymentMethod === "Card"}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <span className="canteen-payment-emoji">💳</span>
                        <span className="canteen-payment-copy">
                          <strong>Debit / Credit Card</strong>
                          <small>Simulated card payment</small>
                        </span>
                      </label>

                      <label className={`canteen-payment-option ${paymentMethod === "Cash at Canteen" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash at Canteen"
                          checked={paymentMethod === "Cash at Canteen"}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <span className="canteen-payment-emoji">💵</span>
                        <span className="canteen-payment-copy">
                          <strong>Cash at Canteen</strong>
                          <small>Pay when collecting your order</small>
                        </span>
                      </label>
                    </section>

                    <div className="canteen-checkout">
                      <div className="canteen-total-row">
                        <span>Total</span>
                        <strong>{formatPrice(cartTotal)}</strong>
                      </div>
                      <button
                        type="button"
                        className="canteen-primary-button"
                        onClick={checkout}
                      >
                        {paymentMethod === "Cash at Canteen"
                          ? `Place Order · ${formatPrice(cartTotal)}`
                          : `Pay ${formatPrice(cartTotal)} · Demo`}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "orders" && (
              <>
                <div className="canteen-section-heading">
                  <div>
                    <h2>My Orders</h2>
                    <p>Track your order and collection status.</p>
                  </div>
                </div>

                {currentOrders.length === 0 ? (
                  <div className="canteen-empty">
                    <span>📋</span>
                    <h3>No orders yet</h3>
                    <p>Your placed orders will appear here.</p>
                    <button
                      type="button"
                      className="canteen-primary-button"
                      onClick={() => setActiveTab("menu")}
                    >
                      Order Now
                    </button>
                  </div>
                ) : (
                  <div className="canteen-orders-list">
                    {currentOrders.map((order) => (
                      <article className="canteen-order-card" key={order.id}>
                        <div className="canteen-order-top">
                          <div>
                            <span className="canteen-label">ORDER TOKEN</span>
                            <h3>{order.token}</h3>
                          </div>
                          <span className={`canteen-status ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <p className="canteen-order-date">{order.createdAt}</p>

                        <div className="canteen-order-items">
                          {order.items.map((item) => (
                            <div className="canteen-order-item" key={item.id}>
                              <span>{item.emoji} {item.name} × {item.quantity}</span>
                              <strong>{formatPrice(item.price * item.quantity)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="canteen-order-total">
                          <span>Total</span>
                          <strong>{formatPrice(order.total)}</strong>
                        </div>

                        <div className="canteen-order-payment">
                          <span>Payment method</span>
                          <strong>{order.paymentMethod || "Not specified"}</strong>
                          <span>Payment status</span>
                          <strong className={order.paymentStatus === "Paid" ? "payment-paid" : "payment-pending"}>
                            {order.paymentStatus || "Not specified"}
                          </strong>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {role === "staff" && staffLoggedIn && (
        <>
          <div className="canteen-staff-welcome">
            <div>
              <span className="canteen-label">STAFF WORKSPACE</span>
              <h2>Welcome, Staff!</h2>
              <p>Manage menu items and customer orders.</p>
            </div>
            <button
              type="button"
              className="canteen-secondary-button"
              onClick={handleStaffLogout}
            >
              Logout
            </button>
          </div>

          <nav className="canteen-tabs">
            <button
              type="button"
              className={activeTab === "manage" ? "active" : ""}
              onClick={() => setActiveTab("manage")}
            >
              ⚙️ Manage Menu
            </button>
            <button
              type="button"
              className={activeTab === "staffOrders" ? "active" : ""}
              onClick={() => setActiveTab("staffOrders")}
            >
              📋 Customer Orders
              {currentOrders.filter(
                (order) => !["Collected", "Cancelled"].includes(order.status)
              ).length > 0 && (
                <span className="canteen-tab-count">
                  {currentOrders.filter(
                    (order) => !["Collected", "Cancelled"].includes(order.status)
                  ).length}
                </span>
              )}
            </button>
          </nav>

          <main className="canteen-content">
            {activeTab === "manage" && (
              <>
                <div className="canteen-section-heading">
                  <div>
                    <h2>Menu Management</h2>
                    <p>Add, edit, remove, or update item availability.</p>
                  </div>
                </div>

                <form className="canteen-menu-form" onSubmit={saveMenuItem}>
                  <h3>{editingId !== null ? "Edit Menu Item" : "Add Menu Item"}</h3>

                  <div className="canteen-form-grid">
                    <div className="canteen-form-field">
                      <label htmlFor="itemName">Item Name</label>
                      <input
                        id="itemName"
                        type="text"
                        placeholder="e.g. Veg Burger"
                        value={form.name}
                        onChange={(event) => updateFormField("name", event.target.value)}
                        required
                      />
                    </div>

                    <div className="canteen-form-field">
                      <label htmlFor="itemPrice">Price (₹)</label>
                      <input
                        id="itemPrice"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 50"
                        value={form.price}
                        onChange={(event) => updateFormField("price", event.target.value)}
                        required
                      />
                    </div>

                    <div className="canteen-form-field">
                      <label htmlFor="itemEmoji">Food Emoji</label>
                      <input
                        id="itemEmoji"
                        type="text"
                        placeholder="🍔"
                        value={form.emoji}
                        onChange={(event) => updateFormField("emoji", event.target.value)}
                      />
                    </div>

                    <div className="canteen-form-field">
                      <label htmlFor="itemCategory">Food Category</label>
                      <select
                        id="itemCategory"
                        value={form.category}
                        onChange={(event) => updateFormField("category", event.target.value)}
                      >
                        {FOOD_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="canteen-form-actions">
                    <button type="submit" className="canteen-primary-button">
                      {editingId !== null ? "Save Changes" : "Add Item"}
                    </button>
                    {editingId !== null && (
                      <button
                        type="button"
                        className="canteen-secondary-button"
                        onClick={resetForm}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <div className="canteen-admin-heading">
                  <h3>Current Menu</h3>
                  <span>{currentMenu.length} items</span>
                </div>

                <div className="canteen-admin-category-filter">
                  <label htmlFor="staffCategoryFilter">Filter by category</label>
                  <select
                    id="staffCategoryFilter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {FOOD_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {currentMenu.filter(
                  (item) => selectedCategory === "All" || item.category === selectedCategory
                ).length === 0 ? (
                  <div className="canteen-empty">
                    <span>🍽️</span>
                    <h3>No items in this category</h3>
                    <p>Add an item or select another category.</p>
                  </div>
                ) : (
                  <div className="canteen-admin-list">
                    {currentMenu
                      .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                      .map((item) => (
                        <article className="canteen-admin-row" key={item.id}>
                          <span className="canteen-admin-emoji">{item.emoji}</span>
                          <div className="canteen-admin-item">
                            <h4>{item.name}</h4>
                            <p>{formatPrice(item.price)} · {item.category}</p>
                          </div>
                          <span className={`canteen-status ${item.available ? "status-available" : "status-sold-out"}`}>
                            {item.available ? "Available" : "Sold Out"}
                          </span>
                          <div className="canteen-admin-actions">
                            <button
                              type="button"
                              className={`canteen-availability-button ${item.available ? "" : "sold-out"}`}
                              onClick={() => toggleAvailability(item.id)}
                            >
                              {item.available ? "Mark Sold Out" : "Make Available"}
                            </button>
                            <button
                              type="button"
                              className="canteen-edit-button"
                              onClick={() => editMenuItem(item)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="canteen-delete-button"
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "staffOrders" && (
              <>
                <div className="canteen-section-heading">
                  <div>
                    <h2>Customer Orders</h2>
                    <p>Update orders as they move through preparation.</p>
                  </div>
                </div>

                {currentOrders.length === 0 ? (
                  <div className="canteen-empty">
                    <span>📋</span>
                    <h3>No customer orders yet</h3>
                    <p>New orders will appear here.</p>
                  </div>
                ) : (
                  <div className="canteen-orders-list">
                    {currentOrders.map((order) => (
                      <article className="canteen-order-card" key={order.id}>
                        <div className="canteen-order-top">
                          <div>
                            <span className="canteen-label">ORDER TOKEN</span>
                            <h3>{order.token}</h3>
                          </div>
                          <span className={`canteen-status ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <p className="canteen-order-date">Placed: {order.createdAt}</p>

                        <div className="canteen-order-items">
                          {order.items.map((item) => (
                            <div className="canteen-order-item" key={item.id}>
                              <span>{item.emoji} {item.name} × {item.quantity}</span>
                              <strong>{formatPrice(item.price * item.quantity)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="canteen-order-total">
                          <span>Total</span>
                          <strong>{formatPrice(order.total)}</strong>
                        </div>

                        <div className="canteen-order-payment">
                          <span>Payment</span>
                          <strong>{order.paymentMethod || "Not specified"}</strong>
                          <span>Payment status</span>
                          <strong>{order.paymentStatus || "Not specified"}</strong>
                        </div>

                        <div className="canteen-status-control">
                          <label htmlFor={`status-${order.id}`}>Update Status</label>
                          <select
                            id={`status-${order.id}`}
                            value={order.status}
                            onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {showPaymentModal && (
        <div
          className="canteen-payment-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="canteen-payment-title"
        >
          <div className="canteen-payment-modal">
            <button
              type="button"
              className="canteen-payment-close"
              aria-label="Close payment"
              onClick={() => setShowPaymentModal(false)}
            >
              ×
            </button>

            <div className="canteen-payment-icon">🔒</div>
            <h2 id="canteen-payment-title">Demo Payment</h2>
            <p>This is a simulated payment. No money will be charged.</p>

            <div className="canteen-payment-summary">
              <span>Payment method</span>
              <strong>{paymentMethod}</strong>
              <span>Order total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <button
              type="button"
              className="canteen-primary-button"
              onClick={() => completeCheckout("Paid")}
            >
              ✓ Simulate Successful Payment
            </button>

            <button
              type="button"
              className="canteen-secondary-button"
              onClick={simulatePaymentFailure}
            >
              ✕ Simulate Failed Payment
            </button>

            <small className="canteen-demo-notice">
              Demo mode only · No real transaction occurs
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default Canteens;
