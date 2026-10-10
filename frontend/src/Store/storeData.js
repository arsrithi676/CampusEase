
const PRODUCTS_KEY = "campusease_store_products";
const ORDERS_KEY = "campusease_store_orders";
const TOKEN_KEY = "campusease_store_token";

const initialProducts = [
  { id: 1, name: "Biscuit Pack", category: "Snacks", price: 20, stock: 30, emoji: "🍪" },
  { id: 2, name: "Potato Chips", category: "Snacks", price: 25, stock: 20, emoji: "🥔" },
  { id: 3, name: "Water Bottle", category: "Beverages", price: 20, stock: 40, emoji: "💧" },
  { id: 4, name: "Fruit Juice", category: "Beverages", price: 35, stock: 15, emoji: "🧃" },
  { id: 5, name: "Notebook", category: "Stationery", price: 50, stock: 25, emoji: "📓" },
  { id: 6, name: "Pen", category: "Stationery", price: 10, stock: 50, emoji: "🖊️" },
  { id: 7, name: "Toothpaste", category: "Essentials", price: 60, stock: 12, emoji: "🪥" },
  { id: 8, name: "Soap", category: "Essentials", price: 35, stock: 18, emoji: "🧼" },
];

function readData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function getProducts() {
  const saved = readData(PRODUCTS_KEY, null);
  if (saved !== null) return saved;

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("store-updated"));
}

export function getOrders() {
  return readData(ORDERS_KEY, []);
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("store-updated"));
}

export function createToken() {
  const next = Number(localStorage.getItem(TOKEN_KEY) || "0") + 1;
  localStorage.setItem(TOKEN_KEY, String(next));
  return `CS-${String(next).padStart(4, "0")}`;
}

export function formatPrice(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}
