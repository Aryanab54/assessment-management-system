# Assessment Management System - Frontend

A React.js frontend application for the Assessment Management System with user authentication and PDF report generation interface.

## Features

- **User Authentication**: Login and registration with form validation
- **Dashboard**: Overview of assessment types and sample sessions
- **Report Generator**: Interface to generate PDF reports from session data
- **Responsive Design**: Bootstrap-based responsive UI
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: User-friendly loading indicators

## Technology Stack

- React.js 19.1.1
- React Router DOM 7.9.1
- Bootstrap 5.3.8
- Axios 1.12.2
- React Bootstrap 2.10.10

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Login.js         # Login form
│   ├── Register.js      # Registration form
│   ├── ReportGenerator.js # Report generation interface
│   ├── Navbar.js        # Navigation bar
│   ├── Footer.js        # Footer component
│   ├── ErrorBoundary.js # Error handling
│   └── LoadingSpinner.js # Loading component
├── services/            # API services
│   └── api.js          # Axios configuration and API calls
├── data/               # Sample data
│   └── sampleData.js   # Assessment sample data
├── App.js              # Main app component
├── App.css             # Custom styles
└── index.js            # App entry point
```

## Key Components

### Authentication
- **Login**: Email/password authentication with validation
- **Register**: User registration with password confirmation
- **Protected Routes**: Automatic redirection based on auth state

### Dashboard
- Overview of available assessment types
- Sample session data display
- Quick navigation to report generation

### Report Generator
- Session ID input with validation
- Sample session ID suggestions
- Report generation history
- Real-time status updates

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` by default. This can be configured using the `REACT_APP_API_URL` environment variable.

### API Endpoints Used
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/generate-report` - PDF report generation

## Sample Data

The application includes sample assessment data for testing:
- `session_001` - Health & Fitness Assessment (as_hr_02)
- `session_002` - Cardiac Assessment (as_card_01)

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## User Interface Features

### Responsive Design
- Mobile-first approach using Bootstrap
- Collapsible navigation for mobile devices
- Responsive tables and cards

### User Experience
- Loading spinners for async operations
- Form validation with error messages
- Success/error notifications
- Breadcrumb navigation
- Dropdown menus with user actions

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

## Development

### Code Structure
- Functional components with React Hooks
- Centralized state management for authentication
- Modular component architecture
- Reusable utility functions

### Styling
- Bootstrap 5 for base styling
- Custom CSS for enhanced appearance
- Consistent color scheme and typography
- Hover effects and transitions

## Testing

Run tests with:
```bash
npm test
```

## Building for Production

Create a production build:
```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure responsive design compatibility