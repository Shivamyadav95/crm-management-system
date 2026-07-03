import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { customerService } from '../services/customerService';
import { useAuth } from '../utils/AuthContext';
import Pagination from "../components/Pagination";

const emptyForm = { name: '', email: '', phone: '', company: '', address: '', notes: '' };

export default function Customers() {
  const { user } = useAuth();

const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);

const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [totalElements, setTotalElements] = useState(0);

const [error, setError] = useState('');
const [showModal, setShowModal] = useState(false);
const [editingId, setEditingId] = useState(null);
const [form, setForm] = useState(emptyForm);

const load = async () => {
  setLoading(true);

  try {
    const res = await customerService.getAll(page, 10);

    setCustomers(res.data.content);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);

  } catch (err) {
    setError("Could not load customers.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  load();
}, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name || '', email: c.email || '', phone: c.phone || '',
      company: c.company || '', address: c.address || '', notes: c.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.update(editingId, form);
      } else {
        await customerService.create(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await customerService.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Showing {customers.length} of {totalElements} Customers</p>
        </div>
        <button className="btn btn-accent" onClick={openCreate}>+ Add Customer</button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">No customers yet. Add your first one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Sales Rep</th><th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.company || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.assignedSalesRepName || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      {user?.role === 'ADMIN' && (
                        <button className="btn-danger-outline" onClick={() => handleDelete(c.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
    page={page}
    totalPages={totalPages}
    totalElements={totalElements}
    pageSize={10}
    onPrevious={() => setPage(page - 1)}
    onNext={() => setPage(page + 1)}
/>

      {showModal && (
        <Modal title={editingId ? 'Edit Customer' : 'Add Customer'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              {editingId ? 'Save Changes' : 'Add Customer'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
