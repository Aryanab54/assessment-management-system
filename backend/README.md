# Assessment Management System - Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
npm run migrate
npm run generate
```

3. Start server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Reports
- `POST /api/reports/generate-report` - Generate PDF report (requires authentication)

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Lead Management
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get all leads (query: ?status=NEW)
- `GET /api/leads/:id` - Get lead by ID
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Lead Distribution
- `POST /api/distributions/distribute` - Distribute single lead
- `POST /api/distributions/bulk-distribute` - Distribute multiple leads
- `GET /api/distributions` - Get distributions (query: ?agentId=1)

### Upload History
- `POST /api/uploads/upload` - Record file upload
- `GET /api/uploads/user` - Get user's upload history
- `GET /api/uploads/all` - Get all upload history

### Health Check
- `GET /api/health` - Server health check

## Usage Examples

### Register User
```bash
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Generate Report
```bash
curl -X POST http://localhost:9000/api/reports/generate-report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"session_id": "session_001"}'
```

### Create Lead
```bash
curl -X POST http://localhost:9000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"fullName": "John Smith", "email": "john@example.com", "phone": "+1234567890"}'
```

### Distribute Lead
```bash
curl -X POST http://localhost:9000/api/distributions/distribute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"leadId": 1, "agentId": 2}'
```

## Configuration System

Add new assessment types in `config.js`:

```javascript
"new_assessment_id": {
  name: "New Assessment Type",
  sections: ["Section1", "Section2"],
  fieldMappings: {
    fieldName: "jsonPath.to.field"
  },
  classifications: {
    fieldName: {
      excellent: { min: 90, max: 100 }
    }
  }
}
```

Add sample data in `data.js` with the new `assessment_id`.

## Sample Data

- `session_001`: Health & Fitness Assessment (`as_hr_02`)
- `session_002`: Cardiac Assessment (`as_card_01`)

Generated PDFs are saved in the `reports/` directory.