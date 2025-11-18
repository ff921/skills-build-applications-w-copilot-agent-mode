
import React, { useEffect, useState } from 'react';

const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', details: '' });
  const [editId, setEditId] = useState(null);

  const fetchActivities = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log('Activities API endpoint:', API_URL);
        console.log('Fetched activities:', data);
        setActivities(data.results || data);
      })
      .catch(err => console.error('Error fetching activities:', err));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setShowForm(true);
    setEditId(null);
    setFormData({ name: '', details: '' });
  };

  const handleEdit = activity => {
    setShowForm(true);
    setEditId(activity.id);
    setFormData({ name: activity.name, details: activity.details });
  };

  const handleDelete = id => {
    fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      .then(() => fetchActivities())
      .catch(err => console.error('Error deleting activity:', err));
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
        fetchActivities();
      })
      .catch(err => console.error('Error saving activity:', err));
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Activities</h2>
        <button className="btn btn-success btn-add" onClick={handleAdd} title="Add Activity">
          <span className="bi bi-plus-lg"></span> Add
        </button>
      </div>
      <div className="card-body">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <tr key={idx}>
                <td>{activity.name || '-'}</td>
                <td>{activity.details || JSON.stringify(activity)}</td>
                <td>
                  <button className="btn btn-outline-dark btn-edit me-2" onClick={() => handleEdit(activity)} title="Edit">
                    <span className="bi bi-pencil"></span>
                  </button>
                  <button className="btn btn-outline-danger btn-delete" onClick={() => handleDelete(activity.id)} title="Delete">
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
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Details</label>
              <input type="text" className="form-control" name="details" value={formData.details} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-success me-2">{editId ? 'Update' : 'Add'} Activity</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Activities;
