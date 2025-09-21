import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const assessmentTypes = [
    {
      id: 'as_hr_02',
      name: 'Health & Fitness Assessment',
      description: 'Comprehensive health and fitness evaluation including body composition, posture analysis, and fitness levels.',
      icon: '🏃‍♂️',
      color: 'success'
    },
    {
      id: 'as_card_01',
      name: 'Cardiac Assessment',
      description: 'Focused cardiovascular health assessment with heart rate monitoring and endurance testing.',
      icon: '❤️',
      color: 'danger'
    }
  ];

  const sampleSessions = [
    { id: 'session_001', type: 'Health & Fitness', date: '2025-02-27', status: 'Completed' },
    { id: 'session_002', type: 'Cardiac Assessment', date: '2024-09-26', status: 'Completed' }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Welcome, {user.name || user.email}!</h1>
            <Link to="/reports" className="btn btn-primary">
              Generate New Report
            </Link>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">Assessment Types</h4>
        </div>
        {assessmentTypes.map((assessment) => (
          <div key={assessment.id} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-2 me-3">{assessment.icon}</span>
                  <h5 className="card-title mb-0">{assessment.name}</h5>
                </div>
                <p className="card-text text-muted">{assessment.description}</p>
                <span className={`badge bg-${assessment.color}`}>{assessment.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Sample Assessment Sessions</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Assessment Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleSessions.map((session) => (
                      <tr key={session.id}>
                        <td>
                          <code className="text-primary">{session.id}</code>
                        </td>
                        <td>{session.type}</td>
                        <td>{session.date}</td>
                        <td>
                          <span className="badge bg-success">{session.status}</span>
                        </td>
                        <td>
                          <Link 
                            to={`/reports?session=${session.id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            Generate Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6 className="alert-heading">Quick Start Guide:</h6>
            <ol className="mb-0">
              <li>Navigate to the "Generate Reports" section</li>
              <li>Enter a session ID (use sample sessions above)</li>
              <li>Click "Generate PDF Report" to create and download the report</li>
              <li>The system automatically detects assessment type and applies appropriate formatting</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;