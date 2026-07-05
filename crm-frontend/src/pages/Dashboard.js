import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatusPill from "../components/StatusPill";
import { customerService } from "../services/customerService";
import { leadService } from "../services/leadService";
import { taskService } from "../services/taskService";
import { saleService } from "../services/saleService";
import { useAuth } from "../utils/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sales, setSales] = useState([]);

  const [customerCount, setCustomerCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [c, l, t, s] = await Promise.all([
          customerService.getAll(),
          leadService.getAll(),
          taskService.getAll(),
          saleService.getAll(),
        ]);

        setCustomers(c.data.content || []);
        setLeads(l.data.content || []);
        setTasks(t.data.content || []);
        setSales(s.data.content || []);

        setCustomerCount(c.data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    loadAll();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openTasks = tasks.filter(
    (t) => t.status !== "COMPLETED"
  ).length;

  const activeLeads = leads.filter(
    (l) => l.status !== "CONVERTED" && l.status !== "LOST"
  ).length;

  const wonRevenue = sales
    .filter((s) => s.status === "CLOSED_WON")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const recentTasks = [...tasks].slice(-5).reverse();
  const recentSales = [...sales].slice(-5).reverse();

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span
            style={{
              color: "#6B7280",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Pipeline CRM Dashboard
          </span>

          <h1 style={{ marginTop: "8px", marginBottom: "10px" }}>
            Welcome, {user?.fullName} 👋
          </h1>

          <p>Here's an overview of your business today.</p>
        </div>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div className="stat-grid">
        <div
          className="stat-card"
          style={{ "--rail-color": "var(--primary)" }}
        >
          <div className="stat-label">Customers</div>
          <div className="stat-value">
            {loading ? "—" : customerCount}
          </div>
        </div>

        <div
          className="stat-card"
          style={{ "--rail-color": "var(--warning)" }}
        >
          <div className="stat-label">Active Leads</div>
          <div className="stat-value">
            {loading ? "—" : activeLeads}
          </div>
        </div>

        <div
          className="stat-card"
          style={{ "--rail-color": "var(--accent)" }}
        >
          <div className="stat-label">Open Tasks</div>
          <div className="stat-value">
            {loading ? "—" : openTasks}
          </div>
        </div>

        <div
          className="stat-card"
          style={{ "--rail-color": "var(--success)" }}
        >
          <div className="stat-label">Revenue Won</div>
          <div className="stat-value">
            {loading ? "—" : `$${wonRevenue.toLocaleString()}`}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div className="table-wrap">
          <div style={{ padding: "16px 16px 0 16px" }}>
            <h3 style={{ fontSize: 15 }}>Recent Tasks</h3>
          </div>

          {recentTasks.length === 0 ? (
            <div className="empty-state">No tasks yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.priority}</td>
                    <td>
                      <StatusPill status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="table-wrap">
          <div style={{ padding: "16px 16px 0 16px" }}>
            <h3 style={{ fontSize: 15 }}>Recent Sales</h3>
          </div>

          {recentSales.length === 0 ? (
            <div className="empty-state">No sales yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentSales.map((s) => (
                  <tr key={s.id}>
                    <td>{s.customerName}</td>
                    <td>${(s.amount || 0).toLocaleString()}</td>
                    <td>
                      <StatusPill status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
