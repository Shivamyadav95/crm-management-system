import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { taskService } from '../services/taskService';
import { useAuth } from '../utils/AuthContext';
import Pagination from "../components/Pagination";

const emptyForm = { title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'OPEN' };
const statusOptions = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
  
    try {
  
      const res = await taskService.getAll(page, 10);
     setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
  
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

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title || '', description: t.description || '',
      dueDate: t.dueDate || '', priority: t.priority || 'MEDIUM', status: t.status || 'OPEN',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await taskService.update(editingId, form);
      } else {
        await taskService.create(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const markDone = async (t) => {
    try {
      await taskService.update(t.id, { ...t, status: 'COMPLETED' });
      load();
    } catch (err) {
      alert('Could not update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const visibleTasks = myTasksOnly
    ? tasks.filter((t) => t.assignedToName === user?.fullName)
    : tasks;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>
  Showing {visibleTasks.length} of {totalElements} Tasks
  {myTasksOnly ? " · assigned to me" : ""}
</p>
        </div>
        <button className="btn btn-accent" onClick={openCreate}>+ Add Task</button>
      </div>

      <div className="toolbar">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={myTasksOnly} onChange={(e) => setMyTasksOnly(e.target.checked)} />
          My tasks only
        </label>
        <div className="spacer" />
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-state">No tasks found.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Title</th><th>Due Date</th><th>Priority</th><th>Assigned To</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {visibleTasks.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.title}</strong></td>
                  <td>{t.dueDate || '—'}</td>
                  <td>{t.priority}</td>
                  <td>{t.assignedToName || '—'}</td>
                  <td><StatusPill status={t.status} /></td>
                  <td>
                    <div className="row-actions">
                      {t.status !== 'COMPLETED' && (
                        <button className="btn btn-outline btn-sm" onClick={() => markDone(t)}>Mark Done</button>
                      )}
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(t)}>Edit</button>
                      {user?.role === 'ADMIN' && (
                        <button className="btn-danger-outline" onClick={() => handleDelete(t.id)}>Delete</button>
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
        <Modal title={editingId ? 'Edit Task' : 'Add Task'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              {editingId ? 'Save Changes' : 'Add Task'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
