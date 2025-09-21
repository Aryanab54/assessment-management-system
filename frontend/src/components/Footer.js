import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-primary">Assessment Management System</h6>
            <p className="text-muted small mb-0">
              Flexible PDF report generation system with configurable assessment types.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted small mb-0">
              Built with React.js & Bootstrap
            </p>
            <p className="text-muted small mb-0">
              © 2025 Assessment Management System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;