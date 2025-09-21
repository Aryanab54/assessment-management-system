# Assessment Management System

A full-stack web application with user authentication and PDF report generation system that handles different assessment types through a flexible, configuration-driven approach.

## 🚀 Features

### ✅ User Authentication System
- User registration with validation
- Secure login with JWT tokens
- Protected routes and API endpoints
- Session management

### ✅ PDF Report Generation System
- Configuration-driven report templates
- Support for multiple assessment types
- Dynamic field mapping from JSON data
- Automatic value classification
- Local filesystem storage
- No code changes needed for new assessment types

### ✅ Flexible Configuration System
- JSON-based configuration for assessment types
- Dynamic section configuration
- Configurable field mappings with nested object support
- Customizable classification ranges
- Easy addition of new assessment types

## 🏗️ Architecture

### Backend (Node.js + Express + Prisma + MySQL)
- **Port**: 9000
- **Database**: MySQL with Prisma ORM
- **PDF Generation**: Puppeteer
- **Authentication**: JWT with bcrypt

### Frontend (React + Bootstrap)
- **Port**: 3000
- **UI Framework**: React with React Bootstrap
- **Routing**: React Router DOM
- **API Communication**: Axios

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Setup

1. Create MySQL database named `assessment-management-system-db`
2. Update `backend/.env` with your database credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/assessment-management-system-db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
PORT=9000
```

3. Run database migrations:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 3. Start the System

#### Option 1: Use the startup script
```bash
./start-system.sh
```

#### Option 2: Start manually
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000/api
- **Health Check**: http://localhost:9000/api/health

## 📊 Testing the System

### 1. User Registration/Login
1. Go to http://localhost:3000
2. Register a new account or login
3. Navigate to the dashboard

### 2. Generate PDF Reports
1. Go to Reports section
2. Use sample session IDs:
   - `session_001` - Health & Fitness Assessment
   - `session_002` - Cardiac Assessment
3. Click "Generate PDF Report"
4. Check `backend/reports/` folder for generated PDFs

### 3. API Testing

#### Register User
```bash
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Generate Report
```bash
curl -X POST http://localhost:9000/api/reports/generate-report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"session_id":"session_001"}'
```

## 🔧 Configuration System

### Adding New Assessment Types

1. **Add Assessment Data** in `backend/data.js`:
```javascript
{
  "session_id": "session_003",
  "assessment_id": "as_new_01",
  "accuracy": 85,
  // ... your assessment data
}
```

2. **Add Configuration**:
```javascript
"as_new_01": {
  "name": "New Assessment Type",
  "sections": ["Key Metrics", "Analysis"],
  "fieldMappings": {
    "Score": "accuracy",
    "Heart Rate": "vitals.heart_rate"
  },
  "classifications": {
    "Score": {
      "Poor": [0, 50],
      "Good": [50, 80],
      "Excellent": [80, 100]
    }
  }
}
```

### Field Mapping Examples
- Simple field: `"accuracy"`
- Nested object: `"vitalsMap.vitals.heart_rate"`
- Array access: `"exercises[0].name"`
- Deep nesting: `"vitalsMap.metadata.heart_scores.stress_index"`

## 📁 Project Structure

```
assessment-management-system/
├── backend/
│   ├── src/
│   │   ├── login/           # Authentication logic
│   │   ├── pdf_reports/     # PDF generation
│   │   ├── user_management/ # User operations
│   │   └── utils/           # Utilities
│   ├── config/              # Configuration files
│   ├── reports/             # Generated PDF files
│   ├── data.js              # Assessment data & config
│   └── app.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   └── public/
├── CONFIGURATION_SYSTEM.md  # Detailed config docs
└── README.md
```

## 🎯 Sample Assessment Types

### Health & Fitness Assessment (as_hr_02)
- **Sections**: Key Body Vitals, Heart Health, Stress Level, Fitness Levels, Posture, Body Composition
- **Key Metrics**: Heart Rate, Blood Pressure, BMI, Stress Index, Posture Analysis

### Cardiac Assessment (as_card_01)
- **Sections**: Key Body Vitals, Cardiovascular Endurance, Body Composition
- **Key Metrics**: Heart Rate, Blood Pressure, Endurance Test Results

## 🔍 Generated PDF Reports

Reports are saved in `backend/reports/` with naming format:
`{assessment_id}_{session_id}_{timestamp}.pdf`

Example: `as_hr_02_session_001_1758452541386.pdf`

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration

## 📚 Documentation

- [Configuration System Guide](CONFIGURATION_SYSTEM.md) - Detailed guide on adding/modifying assessment types
- [API Documentation](backend/API_TEST_RESULTS.md) - API endpoint documentation

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify DATABASE_URL in .env
   - Run `npx prisma migrate dev`

2. **PDF Generation Fails**
   - Check reports directory exists
   - Verify Puppeteer installation
   - Check file permissions

3. **Authentication Issues**
   - Verify JWT_SECRET in .env
   - Check token format in requests
   - Ensure user exists in database

4. **Frontend API Errors**
   - Check backend is running on port 9000
   - Verify REACT_APP_API_URL in frontend/.env
   - Check CORS configuration

## 🎥 Demo Video Requirements

Record a screen capture showing:
1. ✅ User registration and login process
2. ✅ API call to report generation endpoint with session_id
3. ✅ Generated PDF file appearing in local filesystem
4. ✅ Opening and viewing the generated PDF report
5. ✅ Configuration flexibility demonstration

## 🏆 Success Criteria Met

### Functional Requirements ✅
- ✅ Working user authentication system
- ✅ API endpoint that successfully generates PDFs from session data
- ✅ Proper file storage in local filesystem
- ✅ Correct handling of provided sample data

### Flexibility Requirements ✅
- ✅ System handles different assessment types through configuration only
- ✅ Data field mappings are configurable without code changes
- ✅ Classification ranges are configurable without code changes
- ✅ New assessment types can be added through configuration alone

### Technical Implementation ✅
- ✅ Node.js backend with Express
- ✅ React frontend with Bootstrap
- ✅ MySQL database with Prisma ORM
- ✅ Puppeteer for PDF generation
- ✅ JWT authentication
- ✅ Configuration-driven report system

## 📞 Support

For issues or questions, check the troubleshooting section or review the configuration documentation.