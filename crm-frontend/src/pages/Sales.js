import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { saleService } from '../services/saleService';
import { customerService } from '../services/customerService';
import Pagination from "../components/Pagination";

const emptyForm = {
  customerId: '',
  amount: '',
  status: 'PROPOSAL',
  date: ''
};

const statusOptions = [
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST'
];

export default function Sales() {

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);

    try {

      const [salesResponse, customersResponse] = await Promise.all([
        saleService.getAll(page, 10),
        customerService.getAll(0, 1000)
      ]);
      
      setSales(salesResponse.data.content);
      setTotalPages(salesResponse.data.totalPages);
      setTotalElements(salesResponse.data.totalElements);
      
      setCustomers(customersResponse.data.content);

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

  const openEdit = (sale) => {

    setEditingId(sale.id);

    setForm({
      customerId: sale.customerId || '',
      amount: sale.amount || '',
      status: sale.status || 'PROPOSAL',
      date: sale.date || ''
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        customerId: parseInt(form.customerId, 10),
        amount: parseFloat(form.amount),
        status: form.status,
        date: form.date
      };

      if (editingId) {
        await saleService.update(editingId, payload);
      } else {
        await saleService.create(payload);
      }

      setShowModal(false);
      load();

    } catch (err) {

      alert(err.response?.data?.message || 'Failed to save sale.');

    }
  };

  const totalPipeline = sales
    .filter(
      sale =>
        sale.status === 'PROPOSAL' ||
        sale.status === 'NEGOTIATION'
    )
    .reduce(
      (sum, sale) => sum + (sale.amount || 0),
      0
    );

  return (

    <Layout>

      <div className="page-header">

        <div>

          <h1>Sales</h1>

          <p>
        Showing {sales.length} of {totalElements} Deals • $
        {totalPipeline.toLocaleString()} Active Pipeline
       </p>

        </div>

        <button
          className="btn btn-accent"
          onClick={openCreate}
        >
          + Add Sale
        </button>

      </div>

      <div className="table-wrap">

        {loading ? (

          <div className="empty-state">
            Loading...
          </div>

        ) : sales.length === 0 ? (

          <div className="empty-state">
            No sales found.
          </div>

        ) : (

          <table>

            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {sales.map((sale) => (

                <tr key={sale.id}>

                  <td>
                    <strong>{sale.customerName}</strong>
                  </td>

                  <td>
                    $
                    {(sale.amount || 0).toLocaleString()}
                  </td>

                  <td>
                    <StatusPill status={sale.status} />
                  </td>

                  <td>
                    {sale.date || '—'}
                  </td>

                  <td>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openEdit(sale)}
                    >
                      Edit
                    </button>

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

        <Modal
          title={editingId ? 'Edit Sale' : 'Add Sale'}
          onClose={() => setShowModal(false)}
        >

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Customer</label>

              <select
                value={form.customerId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerId: e.target.value
                  })
                }
                required
              >

                <option value="">
                  Select Customer
                </option>

                {customers.map(customer => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>

                ))}

              </select>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>Amount</label>

                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>Date</label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value
                    })
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>Status</label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value
                  })
                }
              >

                {statusOptions.map(status => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status.replaceAll('_', ' ')}
                  </option>

                ))}

              </select>

            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: '100%' }}
            >
              {editingId ? 'Update Sale' : 'Create Sale'}
            </button>

          </form>

        </Modal>

      )}

    </Layout>

  );

}