import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { leadService } from '../services/leadService';
import { useAuth } from '../utils/AuthContext';
import Pagination from "../components/Pagination";

const emptyForm = { name: '', contactInfo: '', source: 'WEB', status: 'NEW' };
const statusOptions = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
  
    try {
      const res = await leadService.getAll(page, 10);
  
      setLeads(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
  
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (l) => {
    setEditingId(l.id);
    setForm({
      name: l.name || '', contactInfo: l.contactInfo || '',
      source: l.source || 'WEB', status: l.status || 'NEW',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await leadService.update(editingId, form);
      } else {
        await leadService.create(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const handleQuickStatusChange = async (lead, status) => {
    try {
      await leadService.update(lead.id, { ...lead, status });
      load();
    } catch (err) {
      alert('Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await leadService.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredLeads = filter === 'ALL' ? leads : leads.filter((l) => l.status === filter);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p>Showing {leads.length} of {totalElements} Leads
  {filter !== 'ALL' ? ` · ${filter.toLowerCase()}` : ''}
</p>
        </div>
        <button className="btn btn-accent" onClick={openCreate}>+ Add Lead</button>
      </div>

      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="spacer" />
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-state">No leads match this filter.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Source</th><th>Status</th><th>Sales Rep</th><th></th></tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong></td>
                  <td>{l.contactInfo || '—'}</td>
                  <td>{l.source}</td>
                  <td>
                    <select
                      value={l.status}
                      onChange={(e) => handleQuickStatusChange(l, e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600 }}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{l.assignedSalesRepName || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(l)}>Edit</button>
                      {user?.role === 'ADMIN' && (
                        <button className="btn-danger-outline" onClick={() => handleDelete(l.id)}>Delete</button>
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
        <Modal title={editingId ? 'Edit Lead' : 'Add Lead'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Contact Info</label>
              <input value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} placeholder="Email or phone" />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Source</label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  <option value="REFERRAL">Referral</option>
                  <option value="ADS">Ads</option>
                  <option value="WEB">Web</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              {editingId ? 'Save Changes' : 'Add Lead'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
