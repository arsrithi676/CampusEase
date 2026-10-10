import React, { useMemo, useState } from "react";
import "./Marketplace.css";

const KEY = "campusease_marketplace_v1";
const FEE_RATE = 0.10;

const demoListings = [
  {
    id: "demo-1",
    title: "Poster & Social Media Design",
    category: "Design",
    type: "Student Service",
    provider: "Aarav S. · Student",
    price: 300,
    description:
      "Event posters, club creatives, and social media designs. One revision included.",
    status: "approved",
  },
  {
    id: "demo-2",
    title: "Python Basics Tutoring",
    category: "Tutoring",
    type: "Student Service",
    provider: "Meera K. · Student",
    price: 250,
    description:
      "A beginner-friendly session covering Python fundamentals and practice.",
    status: "approved",
  },
  {
    id: "demo-3",
    title: "Programming Practice Pack",
    category: "Study Material",
    type: "Faculty Resource",
    provider: "Faculty Contributor · Demo",
    price: 100,
    description:
      "Sample practice questions for introductory programming. Demonstration listing only.",
    status: "approved",
  },
  {
    id: "demo-4",
    title: "Photography for Small Events",
    category: "Photography",
    type: "Student Service",
    provider: "Rohan P. · Student",
    price: 800,
    description:
      "A short campus event photography session, subject to campus rules.",
    status: "approved",
  },
  {
    id: "demo-5",
    title: "Web Development Mentoring",
    category: "Technology",
    type: "Student Service",
    provider: "Nisha R. · Student",
    price: 400,
    description:
      "Guidance on HTML, CSS, JavaScript, and beginner project structure.",
    status: "pending",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));

    if (
      stored &&
      Array.isArray(stored.listings) &&
      Array.isArray(stored.orders)
    ) {
      return stored;
    }
  } catch {
    // Use demo data if stored data cannot be read.
  }

  return {
    listings: demoListings,
    orders: [],
  };
}

export default function Marketplace({ onBack }) {
  const [data, setData] = useState(load);
  const [tab, setTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    title: "",
    type: "Student Service",
    category: "Technology",
    provider: "",
    price: "",
    description: "",
  });

  function save(next, message = "") {
    setData(next);

    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // The current session can still use the in-memory data.
    }

    setNotice(message);
  }

  const approved = data.listings.filter(
    (item) => item.status === "approved"
  );

  const pending = data.listings.filter(
    (item) => item.status === "pending"
  );

  const orders = data.orders;

  const orderValue = orders.reduce(
    (total, order) => total + order.price,
    0
  );

  const platformShare = orders.reduce(
    (total, order) => total + order.commission,
    0
  );

  const providerShare = orders.reduce(
    (total, order) => total + order.providerShare,
    0
  );

  const categories = [
    "All",
    ...new Set(approved.map((item) => item.category)),
  ];

  const filtered = useMemo(() => {
    return approved.filter((item) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        [
          item.title,
          item.description,
          item.provider,
          item.category,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesType =
        kind === "All" || item.type === kind;

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      );
    });
  }, [approved, search, kind, category]);

  function publish(event) {
    event.preventDefault();

    const price = Number(form.price);

    if (
      !form.title.trim() ||
      !form.provider.trim() ||
      !form.description.trim() ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setNotice(
        "Complete every field and enter a price above ₹0."
      );
      return;
    }

    const listing = {
      ...form,
      id: `listing-${Date.now()}`,
      title: form.title.trim(),
      provider: form.provider.trim(),
      description: form.description.trim(),
      price,
      status: "pending",
      createdAt: new Date().toLocaleDateString("en-IN"),
    };

    save(
      {
        ...data,
        listings: [listing, ...data.listings],
      },
      "Your listing has been submitted for management review."
    );

    setForm({
      title: "",
      type: "Student Service",
      category: "Technology",
      provider: "",
      price: "",
      description: "",
    });

    setTab("mine");
  }

  function order(item) {
    const commission =
      Math.round(item.price * FEE_RATE * 100) / 100;

    const nextOrder = {
      id: `DEMO-${Date.now().toString().slice(-7)}`,
      title: item.title,
      provider: item.provider,
      price: item.price,
      commission,
      providerShare: item.price - commission,
      status: "Demo completed",
      date: new Date().toLocaleString("en-IN"),
    };

    save(
      {
        ...data,
        orders: [nextOrder, ...data.orders],
      },
      "Demo order recorded. No real payment was collected."
    );

    setSelected(null);
    setTab("orders");
  }

  function moderate(id, status) {
    save(
      {
        ...data,
        listings: data.listings.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        ),
      },
      `Listing ${status}.`
    );
  }

  function reset() {
    if (
      !window.confirm(
        "Reset all local demo listings and orders?"
      )
    ) {
      return;
    }

    save(
      {
        listings: demoListings,
        orders: [],
      },
      "Demo data reset."
    );

    setTab("discover");
  }

  const tabs = [
    ["discover", "Discover"],
    ["publish", "Publish a Listing"],
    ["mine", "My Listings"],
    ["orders", "Orders & Earnings"],
    ["management", "Management"],
  ];

  return (
    <main className="cem">
      {/* Header */}
      <header className="cem-header">
        <div className="cem-brand">
          <span className="cem-logo">C</span>

          <div>
            <b>CampusEase</b>
            <small>SKILL & KNOWLEDGE MARKETPLACE</small>
          </div>
        </div>

        <div className="cem-head-actions">
          <span className="cem-demo">
            PROTOTYPE · DEMO PAYMENTS ONLY
          </span>

          {onBack && (
            <button
              className="cem-ghost"
              onClick={onBack}
            >
              ← Back
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="cem-hero">
        <div className="cem-hero-content">
          <span className="cem-kicker">
            CAMPUS TALENT, ONE TRUSTED PLACE
          </span>

          <h1>
            Skills have value.
            <br />
            <em>Share yours on campus.</em>
          </h1>

          <p>
            Discover student services and learning resources.
            Showcase your skills, find collaborators, and explore
            knowledge shared by campus contributors.
          </p>

          <button
            className="cem-primary"
            onClick={() => {
              setTab("discover");
              document
                .querySelector(".cem-tabs")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
          >
            Explore marketplace <span>↗</span>
          </button>

          <div className="cem-hero-stats">
            <div>
              <b>{approved.length}+</b>
              <span>Available listings</span>
            </div>

            <div>
              <b>{categories.length - 1}</b>
              <span>Skill categories</span>
            </div>

            <div>
              <b>Campus</b>
              <span>Community focused</span>
            </div>
          </div>
        </div>

        <div className="cem-hero-art">
          <div className="cem-orbit cem-orbit-one" />
          <div className="cem-orbit cem-orbit-two" />

          <div className="cem-hero-tile">
            <span>✳</span>
            <b>Campus talent</b>
            <small>Skills · Services · Learning</small>
          </div>

          <div className="cem-float cem-float-a">
            <span className="cem-float-icon">✓</span>
            <span>
              <b>Reviewed listings</b>
              <small>Management approval flow</small>
            </span>
          </div>

          <div className="cem-float cem-float-b">
            <span className="cem-float-icon">↗</span>
            <span>
              <b>New opportunities</b>
              <small>Discover campus creators</small>
            </span>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="cem-tabs">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => {
              setTab(id);
              setNotice("");
            }}
          >
            {label}

            {id === "management" &&
              pending.length > 0 && (
                <i>{pending.length}</i>
              )}
          </button>
        ))}
      </nav>

      {/* Feedback */}
      {notice && (
        <div className="cem-notice" role="status">
          <span>✓</span>
          <p>{notice}</p>

          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Discover */}
      {tab === "discover" && (
        <section className="cem-section">
          <div className="cem-section-head">
            <div>
              <span className="cem-kicker">
                EXPLORE THE COMMUNITY
              </span>

              <h2>Find your next collaboration</h2>

              <p>
                Browse services and learning resources
                published by campus contributors.
              </p>
            </div>

            <span className="cem-count">
              {filtered.length} listings
            </span>
          </div>

          <div className="cem-filters">
            <div className="cem-search">
              <span>⌕</span>

              <input
                aria-label="Search listings"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search skills, services, resources..."
              />
            </div>

            <select
              aria-label="Filter by listing type"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value)
              }
            >
              <option>All</option>
              <option>Student Service</option>
              <option>Faculty Resource</option>
            </select>

            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="cem-grid">
            {filtered.map((item, index) => (
              <article
                className="cem-card"
                key={item.id}
              >
                <div
                  className={`cem-art art-${index % 4}`}
                >
                  <span className="cem-art-icon">
                    {item.type === "Faculty Resource"
                      ? "▤"
                      : ["✳", "⌘", "◉", "↗"][
                          index % 4
                        ]}
                  </span>

                  <small>{item.category}</small>
                </div>

                <div className="cem-card-body">
                  <label>{item.type}</label>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <div className="cem-provider">
                    <span className="cem-avatar">
                      {item.provider.charAt(0).toUpperCase()}
                    </span>

                    <span className="cem-provider-name">
                      {item.provider}
                    </span>

                    <span className="cem-listed">
                      ● Listed
                    </span>
                  </div>

                  <div className="cem-card-bottom">
                    <strong>
                      {money(item.price)}
                      <small> / listing</small>
                    </strong>

                    <button
                      onClick={() => setSelected(item)}
                    >
                      View details ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!filtered.length && (
            <div className="cem-empty">
              <span>⌕</span>
              <h3>No listings found</h3>
              <p>
                Try another search term or category.
              </p>

              <button
                className="cem-ghost"
                onClick={() => {
                  setSearch("");
                  setKind("All");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <p className="cem-footnote">
            Sample listings are illustrative. “Listed” does
            not mean institutionally verified.
          </p>
        </section>
      )}

      {/* Publish */}
      {tab === "publish" && (
        <section className="cem-section cem-narrow">
          <div className="cem-section-head">
            <div>
              <span className="cem-kicker">
                SHARE YOUR EXPERTISE
              </span>

              <h2>Publish a listing</h2>

              <p>
                Share a skill, service, or educational resource
                with your campus community.
              </p>
            </div>
          </div>

          <form
            className="cem-form"
            onSubmit={publish}
          >
            <div className="cem-callout">
              <span>✦</span>

              <p>
                New listings start as{" "}
                <b>Pending review</b> and become visible
                after approval.
              </p>
            </div>

            <div className="cem-form-grid">
              <label>
                Listing title

                <input
                  required
                  maxLength="80"
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. Video editing service"
                />
              </label>

              <label>
                Listing type

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type: event.target.value,
                    })
                  }
                >
                  <option>Student Service</option>
                  <option>Faculty Resource</option>
                </select>
              </label>

              <label>
                Category

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  {[
                    "Technology",
                    "Design",
                    "Tutoring",
                    "Photography",
                    "Study Material",
                    "Writing",
                    "Music",
                    "Other",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Provider display name

                <input
                  required
                  maxLength="60"
                  value={form.provider}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      provider: event.target.value,
                    })
                  }
                  placeholder="Name · Student / Faculty"
                />
              </label>

              <label>
                Price (₹)

                <input
                  required
                  type="number"
                  min="1"
                  max="1000000"
                  step="1"
                  value={form.price}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      price: event.target.value,
                    })
                  }
                  placeholder="250"
                />
              </label>

              <label className="cem-wide">
                Description

                <textarea
                  required
                  maxLength="500"
                  rows="5"
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Explain what's included, delivery time, and conditions."
                />
              </label>
            </div>

            <div className="cem-form-bottom">
              <small>Maximum 500 characters.</small>

              <button className="cem-primary" type="submit">
                Submit for review →
              </button>
            </div>
          </form>
        </section>
      )}

      {/* My Listings */}
      {tab === "mine" && (
        <section className="cem-section">
          <div className="cem-section-head">
            <div>
              <span className="cem-kicker">
                YOUR CONTRIBUTIONS
              </span>

              <h2>Listing status</h2>

              <p>
                Track listings created in this browser.
              </p>
            </div>

            <button
              className="cem-primary"
              onClick={() => setTab("publish")}
            >
              + New listing
            </button>
          </div>

          <div className="cem-status-list">
            {data.listings
              .filter(
                (item) => !item.id.startsWith("demo-")
              )
              .map((item) => (
                <article
                  key={item.id}
                  className="cem-status-row"
                >
                  <span className="cem-status-icon">
                    ▤
                  </span>

                  <div>
                    <b>{item.title}</b>

                    <small>
                      {item.type} · {money(item.price)}
                    </small>
                  </div>

                  <span
                    className={`cem-badge ${item.status}`}
                  >
                    {item.status === "pending"
                      ? "Pending review"
                      : item.status}
                  </span>
                </article>
              ))}

            {!data.listings.some(
              (item) => !item.id.startsWith("demo-")
            ) && (
              <div className="cem-empty">
                <span>＋</span>
                <h3>No personal listings yet</h3>

                <p>
                  Publish a service or resource to track
                  its status here.
                </p>

                <button
                  className="cem-primary"
                  onClick={() => setTab("publish")}
                >
                  Publish a listing
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <section className="cem-section">
          <div className="cem-section-head">
            <div>
              <span className="cem-kicker">
                TRANSACTION ACTIVITY
              </span>

              <h2>Orders & earnings</h2>

              <p>
                Orders are simulated and stored in this
                browser only.
              </p>
            </div>

            <span className="cem-demo">
              NO REAL PAYMENTS
            </span>
          </div>

          <div className="cem-metrics cem-three">
            <article>
              <small>Demo order value</small>
              <b>{money(orderValue)}</b>
              <span>Total simulated orders</span>
            </article>

            <article>
              <small>Illustrative platform share</small>
              <b>{money(platformShare)}</b>
              <span>Based on a 10% assumption</span>
            </article>

            <article>
              <small>Illustrative provider share</small>
              <b>{money(providerShare)}</b>
              <span>Not an actual payout</span>
            </article>
          </div>

          <div className="cem-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Listing / provider</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>Platform share</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>
                      <b>{order.title}</b>
                      <small>{order.provider}</small>
                    </td>

                    <td>{order.date}</td>

                    <td>{money(order.price)}</td>

                    <td className="cem-green">
                      {money(order.commission)}
                    </td>

                    <td>
                      <span className="cem-badge approved">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!orders.length && (
                  <tr>
                    <td
                      colSpan="6"
                      className="cem-empty-cell"
                    >
                      No demo orders yet. Open a listing
                      and place a demo order to test the flow.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Management */}
      {tab === "management" && (
        <section className="cem-section">
          <div className="cem-section-head">
            <div>
              <span className="cem-kicker">
                INSTITUTIONAL OVERSIGHT
              </span>

              <h2>Management overview</h2>

              <p>
                Prototype metrics, listing review, and
                transaction estimates.
              </p>
            </div>

            <button
              className="cem-ghost"
              onClick={reset}
            >
              Reset demo data
            </button>
          </div>

          <div className="cem-metrics">
            <article>
              <small>Approved listings</small>
              <b>{approved.length}</b>
              <span>Includes sample data</span>
            </article>

            <article>
              <small>Awaiting review</small>
              <b>{pending.length}</b>
              <span>Require moderation</span>
            </article>

            <article>
              <small>Demo transaction value</small>
              <b>{money(orderValue)}</b>
              <span>Simulated orders</span>
            </article>

            <article>
              <small>Illustrative college share</small>
              <b>{money(platformShare)}</b>
              <span>10% assumption, not approved policy</span>
            </article>
          </div>

          <div className="cem-admin">
            <div className="cem-admin-title">
              <div>
                <h3>Listing approval queue</h3>
                <p>
                  Review submissions before publication.
                </p>
              </div>

              <span>{pending.length} pending</span>
            </div>

            {pending.map((item) => (
              <article
                className="cem-review"
                key={item.id}
              >
                <div className="cem-review-info">
                  <label>
                    {item.type} · {item.category}
                  </label>

                  <b>{item.title}</b>

                  <p>{item.description}</p>

                  <small>
                    {item.provider} · {money(item.price)}
                  </small>
                </div>

                <div className="cem-review-actions">
                  <button
                    className="cem-approve"
                    onClick={() =>
                      moderate(item.id, "approved")
                    }
                  >
                    ✓ Approve
                  </button>

                  <button
                    className="cem-reject"
                    onClick={() =>
                      moderate(item.id, "rejected")
                    }
                  >
                    ✕ Reject
                  </button>
                </div>
              </article>
            ))}

            {!pending.length && (
              <p className="cem-empty-cell">
                All submitted listings have been reviewed.
              </p>
            )}
          </div>

          <div className="cem-policy">
            <span>ⓘ</span>

            <div>
              <b>Before real deployment</b>

              <p>
                Identity verification, role permissions,
                payment collection, commission rules,
                refunds, disputes, and faculty approvals
                must be enforced by the backend. These
                frontend controls are for demonstration only.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="cem-footer">
        <div className="cem-footer-brand">
          <span className="cem-logo">C</span>

          <div>
            <b>CampusEase</b>
            <small>Skill & Knowledge Marketplace</small>
          </div>
        </div>

        <span>Built for Genesis'26</span>

        <span>Prototype · Local browser data</span>
      </footer>

      {/* Listing details modal */}
      {selected && (
        <div
          className="cem-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            className="cem-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cem-modal-title"
          >
            <button
              className="cem-close"
              aria-label="Close listing details"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <div className="cem-modal-art">
              <span>✳</span>
            </div>

            <label>
              {selected.type} · {selected.category}
            </label>

            <h2 id="cem-modal-title">
              {selected.title}
            </h2>

            <p>{selected.description}</p>

            <div className="cem-modal-provider">
              <span className="cem-avatar">
                {selected.provider.charAt(0).toUpperCase()}
              </span>

              <b>{selected.provider}</b>
            </div>

            <div className="cem-modal-price">
              <span>Listing price</span>
              <b>{money(selected.price)}</b>
            </div>

            <div className="cem-fee">
              <span>
                Illustrative platform commission (10%)
              </span>

              <b>{money(selected.price * FEE_RATE)}</b>

              <small>
                Assumption for demonstration, not an
                approved college rate.
              </small>
            </div>

            <button
              className="cem-primary cem-buy"
              onClick={() => order(selected)}
            >
              Place demo order →
            </button>

            <small className="cem-modal-note">
              No payment is collected and no provider is paid.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}