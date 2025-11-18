
import React, { useEffect, useState } from 'react';

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchUsers = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log('Users API endpoint:', API_URL);
        console.log('Fetched users:', data);
        setUsers(data.results || data);
      })
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setShowForm(true);
    setEditId(null);
    setFormData({ username: '', email: '' });
  };

  const handleEdit = user => {
    setShowForm(true);
    setEditId(user.id);
    setFormData({ username: user.username, email: user.email });
  };

  const handleDelete = id => {
    fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(err => console.error('Error deleting user:', err));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}${editId}/` : API_URL;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => {
        setShowForm(false);
        fetchUsers();
      })
      .catch(err => console.error('Error saving user:', err));
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Users</h2>
        <button className="btn btn-success btn-add" onClick={handleAdd} title="Add User">
          <span className="bi bi-plus-lg"></span> Add
        </button>
      </div>
      <div className="card-body">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.username || '-'}</td>
                <td>{user.email || JSON.stringify(user)}</td>
                <td>
                  <button className="btn btn-outline-dark btn-edit me-2" onClick={() => handleEdit(user)} title="Edit">
                    <span className="bi bi-pencil"></span>
                  </button>
                  <button className="btn btn-outline-danger btn-delete" onClick={() => handleDelete(user.id)} title="Delete">
                    <span className="bi bi-trash"></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showForm && (
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-success me-2">{editId ? 'Update' : 'Add'} User</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Users;
