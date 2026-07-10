# 📚 Research Paper Reading Tracker

A full-stack web application for academics and researchers to organize, track, and analyze their research paper reading progress. Built with React, TypeScript, Node.js, Express, and SQLite.

## 🎯 Features

### ✅ Add Research Paper
- Clean form interface with all required fields
- Validation for required fields
- Success notifications upon submission
- Auto-reset form after successful addition

### 📖 Paper Library
- Clean, scannable table view of all papers
- **Multi-filter System:**
  - Filter by Reading Stage (checkbox multi-select)
  - Filter by Research Domain (checkbox multi-select)
  - Filter by Impact Score (checkbox multi-select)
  - Filter by Date Added (This Week, This Month, Last 3 Months, All Time)
- Delete papers with confirmation
- "No papers found" state for empty filters
- Responsive design with horizontal scroll on mobile

### 📊 Reading Analytics Dashboard
- **Summary Cards:**
  - Total paper count
  - Reading stage breakdown
  - Completion rate (% of "Fully Read" papers)
  - Average citations per domain
- **Visualizations:**
  - **Funnel Chart:** Paper count through each reading stage
  - **Scatter Plot:** Citation count vs Impact Score (color-coded)
  - **Stacked Bar Chart:** Papers by domain and reading stage

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, React Hot Toast
- **Backend:** Node.js, Express, CORS
- **Database:** SQLite (better-sqlite3)
- **Icons:** Lucide React

## 📋 Database Schema

### Research Paper Model
```javascript
{
  id: UUID,
  title: String (required),
  firstAuthor: String (required),
  domain: Enum ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'],
  readingStage: Enum ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'],
  citationCount: Integer (default: 0),
  impactScore: Enum ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'],
  dateAdded: ISO Date String,
  createdAt: Timestamp
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The backend will start on **http://localhost:5000**

You should see:
```
🚀 Server running at http://localhost:5000
📚 Paper Tracker API ready!
```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

4. Open your browser and navigate to **http://localhost:3000**

## 📡 API Endpoints

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get single paper
- `POST /api/papers` - Create new paper
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/funnel` - Get funnel data (reading stages)
- `GET /api/analytics/scatter` - Get scatter plot data
- `GET /api/analytics/stacked-bar` - Get stacked bar chart data

### Health
- `GET /api/health` - Server health check

## 🎨 UI/UX Features

- **Professional Design:** Slate/Zinc color palette with clean typography
- **Responsive Layout:** Fully responsive on desktop and mobile
- **Real-time Updates:** Adding/deleting papers immediately updates all views
- **Toast Notifications:** Success and error feedback
- **Accessible Inputs:** Proper labels, placeholders, and validation
- **Loading States:** Smooth loading indicators
- **Empty States:** Helpful messages when no data available

## 📊 Data Visualizations

### Funnel Chart
Shows the progression of papers through each reading stage, visualizing the "drop-off" at each stage.

### Scatter Plot
X-axis: Citation Count
Y-axis: Individual papers
Colors: Impact Score categories
- Red: High Impact
- Orange: Medium Impact
- Gray: Low Impact / Unknown

### Stacked Bar Chart
X-axis: Research Domains
Y-axis: Number of papers
Stacked by: Reading stages

## 🔧 Configuration

### Backend Port
To change the backend port, edit `backend/server.js`:
```javascript
const PORT = 5000; // Change this
```

### Frontend Proxy
To change the API base URL, edit `frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000', // Change this
    changeOrigin: true
  }
}
```

## 📦 Project Structure

```
Assignment/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server
│   ├── database.js        # SQLite setup
│   └── .gitignore
│
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── types.ts
    │   ├── api.ts
    │   ├── index.css
    │   └── components/
    │       ├── AddPaper.tsx
    │       ├── PaperLibrary.tsx
    │       └── AnalyticsDashboard.tsx
    └── .gitignore
```

## 🎯 Usage Guide

### Adding a Paper
1. Click the "Add Paper" tab
2. Fill in all required fields
3. Optionally set citation count (defaults to 0)
4. Click "Add Paper to Library"
5. Success notification appears and form clears

### Filtering Papers
1. Click the "Paper Library" tab
2. Click the filters section to expand
3. Select any combination of:
   - Reading stages (multi-select)
   - Research domains (multi-select)
   - Impact scores (multi-select)
   - Date ranges (single select)
4. Table updates in real-time
5. Click "Clear All Filters" to reset

### Viewing Analytics
1. Click the "Analytics" tab
2. View summary cards with key metrics
3. Scroll to see:
   - Reading stage breakdown
   - Average citations per domain
   - Funnel chart (reading progression)
   - Scatter plot (citations vs impact)
   - Stacked bar chart (domains by stage)

### Deleting a Paper
1. In the Paper Library view, find the paper
2. Click the trash icon in the Action column
3. Confirm deletion
4. Paper is removed and views update

## 🧪 Test Data

To test the application with sample data, you can manually add papers or use the API directly:

```bash
curl -X POST http://localhost:5000/api/papers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deep Learning for NLP",
    "firstAuthor": "John Smith",
    "domain": "Computer Science",
    "readingStage": "Fully Read",
    "citationCount": 150,
    "impactScore": "High Impact",
    "dateAdded": "2026-07-01"
  }'
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure Node.js is installed: `node --version`
- Check port 5000 isn't already in use
- Delete `research_papers.db` and try again

### Frontend shows "Backend server is not running"
- Ensure backend is started on port 5000
- Check browser console for CORS errors
- Verify both servers are running on correct ports

### Charts not displaying
- Check that papers have been added to the database
- Open browser DevTools to check for console errors
- Refresh the page

### Styling looks broken
- Run `npm install` in frontend directory
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` exists

## 📝 Future Enhancements

- Export papers to PDF/CSV
- Add paper tagging system
- Implement paper notes/annotations
- Add collaboration features
- Export analytics reports
- Integration with Google Scholar/arXiv
- Full-text search capability
- Paper recommendation engine

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a comprehensive full-stack research tracker for academics and researchers.

---

**Happy Reading! 📚**

For any issues or questions, please check the troubleshooting section above.
