# 🏗️ Architecture & Technical Documentation

## Application Overview

The Research Paper Reading Tracker is a full-stack web application with a clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         React Frontend (Port 3000)          │
│  - Add Paper Form                          │
│  - Paper Library with Filters              │
│  - Analytics Dashboard with Charts         │
└──────────────┬──────────────────────────────┘
               │ HTTP Requests (Fetch API)
               ▼
┌─────────────────────────────────────────────┐
│       Node.js Express API (Port 5000)       │
│  - REST Endpoints                          │
│  - Request Validation                      │
│  - Business Logic                          │
└──────────────┬──────────────────────────────┘
               │ Database Queries
               ▼
┌─────────────────────────────────────────────┐
│         MongoDB (via Mongoose)              │
│  - Papers collection                       │
│  - Aggregation pipelines for analytics     │
└─────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Build tool (instant HMR)
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Project Structure
```
frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main component with routing
│   ├── index.css             # Global styles + Tailwind
│   ├── types.ts              # TypeScript interfaces
│   ├── api.ts                # API client functions
│   └── components/
│       ├── AddPaper.tsx      # Add paper form
│       ├── PaperLibrary.tsx  # Library with filters
│       └── AnalyticsDashboard.tsx  # Charts & analytics
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Component Details

#### App.tsx (Main Container)
- Manages global state (papers array)
- Tab navigation between views
- Fetches initial data from API
- Handles paper lifecycle events (add, delete)
- Server health check

#### AddPaper.tsx (Form View)
- Controlled form with React state
- Field validation (title, author required)
- Citation count defaults to 0
- Proper error handling with toast notifications
- Auto-reset on successful submission

#### PaperLibrary.tsx (Table View)
- Displays papers in sortable table
- Multi-filter system with checkboxes
- Date range filtering (relative dates)
- Delete functionality with confirmation
- Responsive horizontal scroll on mobile
- Empty state message when filters return 0 results

#### AnalyticsDashboard.tsx (Visualizations)
- Summary cards with KPIs
- Stage breakdown grid
- Average citations per domain table
- Funnel chart (bar chart horizontal)
- Scatter plot (citations vs impact score)
- Stacked bar chart (domains by reading stage)
- All data fetched from `/api/analytics/*` endpoints

### State Management
- Uses React hooks (useState, useEffect)
- Paper data stored in parent (App) component
- Props drilled down to child components
- Callback functions bubble events up
- No external state management needed (simple app)

### API Communication (api.ts)
- `fetchPapers()` - GET all papers
- `createPaper()` - POST new paper
- `deletePaper()` - DELETE paper
- `fetchAnalyticsSummary()` - GET analytics summary
- `fetchFunnelData()` - GET funnel chart data
- `fetchScatterData()` - GET scatter plot data
- `fetchStackedBarData()` - GET stacked bar chart data
- `healthCheck()` - Verify backend is online

---

## Backend Architecture

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express** - HTTP server framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin support
- **UUID** - Generate unique IDs
- **dotenv** - Environment variable management

### Project Structure
```
backend/
├── server.js           # Express app & routes
├── database.js         # Mongoose schema & connection
└── package.json
```

### Database Schema

#### Papers Collection
```javascript
{
  id: String (UUID, unique, required),
  title: String (required),
  firstAuthor: String (required),
  domain: String (required),
  readingStage: String (required),
  citationCount: Number (default: 0),
  impactScore: String (required),
  dateAdded: String (required),
  createdAt: String (default: current timestamp)
}
```

**Constraints:**
- domain: Must be one of 6 predefined values
- readingStage: Must be one of 6 sequential stages
- impactScore: Must be one of 4 values
- citationCount: Minimum 0

### API Endpoints

#### Papers CRUD
```
GET    /api/papers           - List all papers
GET    /api/papers/:id       - Get specific paper
POST   /api/papers           - Create new paper
PUT    /api/papers/:id       - Update paper
DELETE /api/papers/:id       - Delete paper
```

#### Analytics
```
GET    /api/analytics/summary     - Summary stats
GET    /api/analytics/funnel      - Reading stage progression
GET    /api/analytics/scatter     - Citation vs Impact data
GET    /api/analytics/stacked-bar - Domain breakdown
```

#### Health
```
GET    /api/health           - Server status
```

### Request/Response Flow

#### Example: Create Paper
```
Frontend: POST /api/papers
  Body: {
    title: "AI Ethics",
    firstAuthor: "Jane Doe",
    domain: "Computer Science",
    readingStage: "Abstract Read",
    citationCount: 45,
    impactScore: "High Impact",
    dateAdded: "2026-07-10"
  }

Backend:
  1. Parse JSON body
  2. Validate all fields
  3. Check domain/stage/score are valid enums
  4. Generate UUID
  5. Insert into MongoDB via Mongoose
  6. Return created paper with ID

Frontend: 201 Created
  Body: {
    id: "uuid-123",
    title: "AI Ethics",
    firstAuthor: "Jane Doe",
    ...
    createdAt: "2026-07-10T12:00:00Z"
  }
```

#### Example: Get Analytics Summary
```
Frontend: GET /api/analytics/summary

Backend:
  1. Count total papers
  2. Group by readingStage, count each
  3. Calculate AVG citationCount per domain
  4. Count papers where readingStage = "Fully Read"
  5. Calculate completion rate: (fullyRead / total) * 100

Frontend: 200 OK
  Body: {
    totalCount: 25,
    stageBreakdown: [
      { readingStage: "Abstract Read", count: 10 },
      { readingStage: "Fully Read", count: 8 },
      ...
    ],
    avgCitationsByDomain: [
      { domain: "Computer Science", avgCitations: 156.3, paperCount: 12 },
      ...
    ],
    completionRate: 32.0,
    fullyReadCount: 8
  }
```

### Error Handling
- Validation errors return 400 Bad Request
- Not found errors return 404 Not Found
- Server errors return 500 Internal Server Error
- All errors include descriptive message

---

## Data Flow Diagrams

### Adding a Paper
```
User fills form
    ↓
Submit button clicked
    ↓
AddPaper validates form
    ↓
Call createPaper API
    ↓
Backend validates & inserts to MongoDB
    ↓
Return created paper with ID
    ↓
Frontend calls onPaperAdded callback
    ↓
App state updated with new paper
    ↓
Library & Analytics views re-render
    ↓
Toast success notification shown
```

### Filtering Papers
```
User checks/unchecks filter checkbox
    ↓
Component state updated
    ↓
useMemo recalculates filteredPapers
    ↓
Papers array filtered based on all active filters
    ↓
Table re-renders with filtered results
    ↓
"Showing X of Y papers" counter updates
```

### Loading Analytics
```
Analytics tab clicked
    ↓
useEffect triggered
    ↓
Parallel API calls (all 4 analytics endpoints)
    ↓
Data arrives and state updated
    ↓
Charts re-render with new data
    ↓
Loading spinner disappears
```

---

## Key Features Implementation

### Multi-Filter System
- **Checkboxes:** Each filter option is independent
- **Date Range:** Single select with relative date calculation
- **useMemo:** Prevents unnecessary recalculations
- **Combination:** All selected filters apply with AND logic

### Completion Rate Calculation
```
completionRate = (papersWithStage "Fully Read" / totalPapers) * 100
Rounded to 1 decimal place
Example: 8 fully read out of 25 total = 32.0%
```

### Scatter Plot Color Coding
- High Impact → Red (#dc2626)
- Medium Impact → Orange (#ea580c)
- Low Impact → Gray (#94a3b8)
- Unknown → Light Gray (#cbd5e1)

### Reading Funnel
- Bar chart (horizontal) showing count per stage
- Visualizes "drop-off" as papers progress
- Sequential stages in reading flow

### Stacked Bar Chart
- X-axis: All unique domains
- Y-axis: Total paper count
- Stack: Colored by reading stage
- Shows breakdown of reading progress per domain

---

## Performance Considerations

### Optimizations
- **useEffect dependencies:** Prevents infinite loops
- **useMemo filtering:** Caches filtered results
- **Parallel API calls:** Promise.all for analytics
- **Client-side filtering:** No backend calls needed
- **MongoDB aggregation:** Efficient server-side computations

### Scalability
- MongoDB suitable for large datasets
- For very large datasets, add pagination
- Implement backend filtering for large datasets
- Add caching layer (Redis)

---

## Security Considerations

### Currently Implemented
- Input validation on backend
- Type safety with TypeScript
- CORS configured
- Environment variables for secrets

### For Production
- Add authentication (JWT)
- Add authorization (role-based)
- Use HTTPS
- Validate/sanitize all inputs
- Add rate limiting
- Add CSRF protection

---

## Testing

### Manual Testing Checklist
- ✅ Add paper with all required fields
- ✅ Add paper with missing required field (should fail)
- ✅ Filter by single stage
- ✅ Filter by multiple stages simultaneously
- ✅ Filter by domain
- ✅ Filter by impact score
- ✅ Filter by date range
- ✅ Combination filter (all active)
- ✅ Delete paper
- ✅ Delete paper with cancel
- ✅ View analytics with 0 papers
- ✅ View analytics with 1 paper
- ✅ View analytics with many papers
- ✅ Check responsive design on mobile
- ✅ Check error handling (backend down)

---

## Deployment

### Backend Deployment (Railway, Render, Heroku)
```bash
# Configure environment
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string

# Deploy
npm install
npm start
```

### Frontend Deployment (Vercel, Netlify)
```bash
# Build
npm run build

# Output in dist/
# Deploy dist/ folder
```

### Vercel Configuration
This project includes a `vercel.json` that configures:
- Backend as a serverless Node function
- Frontend as a static build
- API routes proxied to backend

### Database
- MongoDB (local or Atlas) ✅
- Connection string in `.env`
- Mongoose handles schema and queries

---

## Future Enhancements

### Short Term
- [ ] Edit paper functionality
- [ ] Bulk import papers
- [ ] Export to CSV/PDF
- [ ] Paper tagging system
- [ ] Search papers

### Medium Term
- [ ] User authentication
- [ ] Multiple user support
- [ ] Share libraries with others
- [ ] Paper notes/annotations
- [ ] Reading goals/progress

### Long Term
- [ ] AI-powered recommendations
- [ ] Integration with academic APIs
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics/ML

---

## Support & Resources

- **Frontend Framework:** https://react.dev
- **UI Library:** https://tailwindcss.com
- **Charts:** https://recharts.org
- **Backend:** https://expressjs.com
- **Database ODM:** https://mongoosejs.com
- **Database:** https://www.mongodb.com
- **TypeScript:** https://www.typescriptlang.org

---

**Last Updated:** July 11, 2026
