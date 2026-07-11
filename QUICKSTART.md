# 🚀 Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- npm (comes with Node.js)
- MongoDB running locally or MongoDB Atlas connection string

## Step-by-Step Setup

### Terminal 1: Start the Backend

```bash
npm start
```

You should see:
```
🚀 Server running at http://localhost:5000
Connected to MongoDB
```

**✅ Backend is running on port 5000**

---

### Terminal 2: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:3000/
```

**✅ Frontend is running on port 3000**

---

## 🌐 Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the Research Paper Tracker dashboard!

---

## 📚 Try It Out

1. **Add a Paper:**
   - Click "Add Paper" tab
   - Fill in the form:
     - Title: "Deep Learning for NLP"
     - Author: "John Smith"
     - Domain: Computer Science
     - Reading Stage: Abstract Read
     - Impact Score: High Impact
   - Click "Add Paper to Library"

2. **View in Library:**
   - Click "Paper Library" tab
   - See your paper in the table
   - Try filtering by domain or stage

3. **Check Analytics:**
   - Click "Analytics" tab
   - See visualizations and metrics
   - Add more papers to see data changes

---

## ⚙️ Commands Reference

### Backend
- `npm start` - Start backend server
- `npm run dev` - Start with auto-restart on changes

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 📋 File Locations

After setup, check these files exist:

**Backend:**
- `server.js` - Main server
- `database.js` - Database setup
- `package.json` - Dependencies

**Frontend:**
- `frontend/src/App.tsx` - Main app component
- `frontend/src/components/` - UI components
- `frontend/dist/` - Built files (after build)

---

## 🆘 Need Help?

### Backend won't start?
```bash
# Make sure MongoDB is running and MONGODB_URI is set in .env
# Check the error message for details
npm start
```

### Frontend won't load?
```bash
# Make sure you're in the frontend directory
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Start again
npm run dev
```

### Port already in use?
- Backend (5000): Close other services using port 5000
- Frontend (3000): Close other services using port 3000

---

## ✨ All Set!

Your full-stack Research Paper Tracker is now running locally! 🎉

**Next Steps:**
- Start adding papers to your library
- Explore filtering and analytics features
- Customize colors/styling in `tailwind.config.js` if desired
- Share your tracker with colleagues!

---

**Happy research! 📚✨**
