
import { useEffect, useState } from "react";
import { getOrders } from "./storeData";
import "./store.css";

export default function PickupDisplay() {
  const [orders, setOrders] = useState(getOrders);

  useEffect(() => {
    const refresh = () => setOrders(getOrders());

    window.addEventListener("store-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("store-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const readyOrders = orders.filter((order) => order.status === "Ready");

  return (
    <main className="pickup-page">
      <p className="store-eyebrow">CAMPUSEASE</p>
      <h1>Order Pickup</h1>
      <p className="pickup-subtitle">
        Collect your order when your token appears below.
      </p>

      <div className="pickup-count">
        {readyOrders.length} order{readyOrders.length === 1 ? "" : "s"} ready
      </div>

      {readyOrders.length === 0 ? (
        <section className="pickup-empty">
          <div>🛍️</div>
          <h2>No orders ready yet</h2>
          <p>Please wait for your token to appear.</p>
        </section>
      ) : (
        <section className="token-grid">
          {readyOrders.map((order) => (
            <article className="token-card" key={order.id}>
              <span>READY FOR PICKUP</span>
              <h2>{order.token}</h2>
              <p>{order.items.map((item) =>
                `${item.name} × ${item.quantity}`).join(", ")}</p>
            </article>
          ))}
        </section>
      )}

      <p className="pickup-footer">Thank you for using CampusEase!</p>
    </main>
  );
}
