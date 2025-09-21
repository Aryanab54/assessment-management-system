import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reportAPI } from '../services/api';

const ReportGenerator = ({ user }) => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState(searchParams.get('session') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [reportHistory, setReportHistory] = useState([]);

  useEffect(() => {
    loadReportHistory();
  }, []);

  const loadReportHistory = () => {
    const history = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    setReportHistory(history);
  };

  const addToHistory = (sessionId, status, timestamp) => {
    const history = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    const newEntry = { sessionId, status, timestamp, user: user.email };
    history.unshift(newEntry);
    localStorage.setItem('reportHistory', JSON.stringify(history.slice(0, 10))); // Keep last 10
    loadReportHistory();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId.trim()) {
      setMessage('Please enter a session ID');
      setMessageType('danger');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await reportAPI.generateReport(sessionId.trim());

      setMessage(`Report generated successfully! File: ${response.data.data.fileName}\nPath: ${response.data.data.filePath}\nType: ${response.data.data.assessmentType}`);
      setMessageType('success');
      addToHistory(sessionId.trim(), 'Success', new Date().toISOString());
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to generate report';
      setMessage(errorMsg);
      setMessageType('danger');
      addToHistory(sessionId.trim(), 'Failed', new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  const sampleSessions = [
    { id: 'session_001', type: 'Health & Fitness Assessment (as_hr_02)' },
    { id: 'session_002', type: 'Cardiac Assessment (as_card_01)' }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">PDF Report Generator</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Generate Assessment Report</h5>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="sessionId" className="form-label">
                    Session ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sessionId"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Enter session ID (e.g., session_001)"
                    required
                  />
                  <div className="form-text">
                    Enter the unique session ID for the assessment data you want to generate a report for.
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Generating Report...
                    </>
                  ) : (
                    'Generate PDF Report'
                  )}
                </button>
              </form>
            </div>
          </div>

          {reportHistory.length > 0 && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Recent Report Generation History</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Session ID</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportHistory.map((entry, index) => (
                        <tr key={index}>
                          <td><code>{entry.sessionId}</code></td>
                          <td>
                            <span className={`badge bg-${entry.status === 'Success' ? 'success' : 'danger'}`}>
                              {entry.status}
                            </span>
                          </td>
                          <td>{new Date(entry.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Sample Session IDs</h6>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Use these sample session IDs to test the report generation:
              </p>
              {sampleSessions.map((session) => (
                <div key={session.id} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <code className="text-primary">{session.id}</code>
                      <div className="small text-muted">{session.type}</div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSessionId(session.id)}
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">How It Works</h6>
            </div>
            <div className="card-body">
              <ol className="small mb-0">
                <li>Enter a valid session ID</li>
                <li>System reads assessment data from backend</li>
                <li>Determines report type based on assessment_id</li>
                <li>Generates formatted PDF report</li>
                <li>Saves file to local filesystem</li>
                <li>Returns success confirmation</li>
              </ol>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Supported Assessment Types</h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <span className="badge bg-success me-2">as_hr_02</span>
                <small>Health & Fitness</small>
              </div>
              <div className="mb-2">
                <span className="badge bg-danger me-2">as_card_01</span>
                <small>Cardiac Assessment</small>
              </div>
              <p className="small text-muted mt-2 mb-0">
                Each assessment type uses different report templates and sections automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;