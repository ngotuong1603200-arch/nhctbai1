import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';

const STATUS_OPTIONS = [
  { value: 'Hoàn thành', label: 'Hoàn thành' },
  { value: 'Đang giao', label: 'Đang giao' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đã hủy', label: 'Đã hủy' },
];

const emptyForm = () => ({
  id: '',
  id_customer: '',
  id_employee: '',
  orderDate: '',
  totalAmount: '',
  status: 'Hoàn thành',
});

function rowToForm(b) {
  const d = String(b.orderDate || '').slice(0, 10);
  return {
    id: String(b.id),
    id_customer: b.id_customer != null ? String(b.id_customer) : '',
    id_employee: b.id_employee != null ? String(b.id_employee) : '',
    orderDate: d,
    totalAmount: b.totalAmount != null ? String(b.totalAmount) : '',
    status: String(b.status || 'Hoàn thành'),
  };
}

function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    id_customer: Number(form.id_customer),
    id_employee: Number(form.id_employee),
    orderDate: form.orderDate.trim(),
    totalAmount: Number(form.totalAmount),
    status: String(form.status || 'Hoàn thành').trim(),
  };
}

function validateRow(built) {
  if (!Number.isFinite(built.id_customer)) return 'ID Khách hàng phải là số';
  if (!Number.isFinite(built.id_employee)) return 'ID Nhân viên phải là số';
  if (!Number.isFinite(built.totalAmount)) return 'Tổng tiền phải là số';
  if (!built.orderDate) return 'Vui lòng chọn ngày';
  return null;
}

function AdminBill({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [appliedSearchId, setAppliedSearchId] = useState('');

  const displayedRows = useMemo(() => {
    const q = appliedSearchId.trim();
    if (!q) return rows;
    return rows.filter((r) => String(r.id) === q);
  }, [rows, appliedSearchId]);

  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/bill', nextList, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRows(nextList);
      setView('list');
      setForm(emptyForm());
      setIsNew(false);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK' || err.response?.status === 404
          ? 'Chỉ lưu được khi chạy npm run dev hoặc npm run preview (API Vite).'
          : null) ||
        'Không lưu được dữ liệu.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (embedded) {
      setAllowed(true);
      return;
    }
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'staff') {
        navigate('/');
        return;
      }
      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate, embedded]);

  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await fetch(`${jsonBase}bill.json`);
        if (!res.ok) throw new Error('Không tải được bill.json');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setLoadError(e.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);

  const goHome = () => navigate('/');
  
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
  };

  const openCreate = () => {
    setIsNew(true);
    setForm(emptyForm());
    setView('form');
    setSaveError('');
  };

  const openEdit = (b) => {
    setIsNew(false);
    setForm(rowToForm(b));
    setView('form');
    setSaveError('');
  };

  const cancelForm = () => {
    setView('list');
    setForm(emptyForm());
    setIsNew(false);
    setSaveError('');
  };

  const handleFormChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const built = formToRow(form, nextId);
    const invalid = validateRow(built);
    
    if (invalid) {
      setSaveError(invalid);
      return;
    }
    
    let nextList;
    if (isNew) {
      nextList = [...rows, built];
    } else {
      const idx = rows.findIndex((r) => String(r.id) === String(form.id));
      if (idx === -1) {
        setSaveError('Không tìm thấy bản ghi để cập nhật');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa hóa đơn này?')) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };

  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };

  const statusLabel = (v) => STATUS_OPTIONS.find((o) => String(o.value).toLowerCase() === String(v).toLowerCase())?.label ?? v;

  const bodyContent = (
    <>
      {loadError && <div className="admin-msg admin-msg--error">{loadError}</div>}
      {saveError && <div className="admin-msg admin-msg--error">{saveError}</div>}
      
      {loading ? (
        <p>Đang tải...</p>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar admin-toolbar--row">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              + Thêm hóa đơn
            </button>
            <div className="admin-toolbar-search">
              <label htmlFor="admin-bill-search-id">Tìm kiếm: </label>
              <input
                id="admin-bill-search-id"
                type="text"
                inputMode="numeric"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyIdSearch();
                  }
                }}
              />
              <button type="button" className="admin-btn" onClick={applyIdSearch} disabled={saving}>
                Tìm
              </button>
              {appliedSearchId.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearIdSearch} disabled={saving}>
                  Hiện tất cả
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>KH</th>
                  <th>NV</th>
                  <th>Ngày</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody className="admin-table_empty">
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table_empty">
                      {appliedSearchId.trim()
                        ? `Không có hóa đơn với ID "${appliedSearchId.trim()}".`
                        : 'Chưa có hóa đơn.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.id_customer}</td>
                      <td>{r.id_employee}</td>
                      <td>{r.orderDate}</td>
                      <td>{r.totalAmount}</td>
                      <td>{statusLabel(String(r.status || ''))}</td>
                      <td>
                        <div className="admin-table_actions">
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id)}
                            disabled={saving}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className="admin-form-card admin-form-card--wide" onSubmit={handleSubmitForm}>
          <h2>{isNew ? 'Thêm hóa đơn' : 'Sửa hóa đơn'}</h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                ID
                <input value={form.id} readOnly />
              </label>
            )}
            <label>
              Khách (id_customer)
              <input
                type="number"
                min="1"
                value={form.id_customer}
                onChange={(e) => handleFormChange('id_customer', e.target.value)}
                required
              />
            </label>
            <label>
              Nhân viên (id_employee)
              <input
                type="number"
                min="1"
                value={form.id_employee}
                onChange={(e) => handleFormChange('id_employee', e.target.value)}
                required
              />
            </label>
            <label>
              Ngày
              <input
                type="date"
                value={form.orderDate}
                onChange={(e) => handleFormChange('orderDate', e.target.value)}
                required
              />
            </label>
            <label>
              Tổng tiền
              <input
                type="number"
                min="0"
                value={form.totalAmount}
                onChange={(e) => handleFormChange('totalAmount', e.target.value)}
                required
              />
            </label>
            <label className="admin-form-grid_full">
              Trạng thái
              <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              Hủy
            </button>
          </div>
        </form>
      )}
    </>
  );

  if (embedded) return <div className="admin-product-embed">{bodyContent}</div>;
  if (!allowed) return <div className="admin-page" />;

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <h1 className="admin-topbar_title">Quản trị hóa đơn</h1>
        <div className="admin-topbar_actions">
          <button type="button" className="admin-topbar_btn" onClick={goHome}>
            Trang chủ
          </button>
          <button type="button" className="admin-topbar_btn admin-topbar_btn--primary" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <div className="admin-body">{bodyContent}</div>
    </div>
  );
}

export default AdminBill;