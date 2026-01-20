# JobSync

**Your All-in-One Job Application Platform - Search, Track & Generate**

Tired of managing job applications across multiple tabs and spreadsheets? JobSync brings everything together in one place. Search for jobs, write cover letters with AI help, and track your entire application journey - all from a single, beautiful dashboard.

## ✨ What It Does

### 🔍 Job Search
Find thousands of job openings across the globe without leaving the app. Search by keywords and location, see salary ranges, and import interesting opportunities directly to your tracker with one click.

**Countries supported:** US, UK, Canada, Australia, Germany, France, India

### 🤖 AI Cover Letter Generator  
Stop writing cover letters from scratch. Drop in the job description and let the AI generate a personalized letter tailored to the role. Completely free and runs locally on your machine - no API costs, no data sharing.

### 📋 Application Tracker
Stay organized with a visual dashboard showing all your applications. Filter by status, add notes, track important dates, and watch your progress with real-time stats. See your interview conversion rates at a glance.

### 🔐 Secure & Private
Your data stays yours. Passwords are encrypted, authentication uses JWT tokens, and everything syncs securely to MongoDB Atlas.

## � Screenshots

### Login Page
Clean and simple login interface with form validation
![Login Page](screenshots/login%20page.png)

### Dashboard & Home
Your central hub showing all available features at a glance
![Dashboard 1](screenshots/dashboard%201.png)
![Dashboard 2](screenshots/dashboard%202.png)

### Job Search
Browse thousands of job listings with instant import to tracker
![Job Search](screenshots/job%20search.png)

### Job Tracker
Manage all your applications in one organized view
![Job Tracker](screenshots/job%20tracker.png)

### AI Cover Letter Generator
Generate personalized cover letters powered by local AI
![Cover Letter](screenshots/cover%20letter.png)

## �🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | FastAPI (Python), MongoDB Atlas, Ollama AI, Adzuna Jobs API |
| **Frontend** | React 18, Vite, React Router, Modern CSS |
| **Security** | JWT, bcrypt, CORS |

## 📋 What You'll Need

Before getting started, make sure you have:

- **Node.js 16+** (for the frontend)
- **Python 3.8+** (for the backend)
- **MongoDB Atlas account** (free tier works great)
- **Ollama** installed locally ([grab it here](https://ollama.ai))
- **Adzuna API credentials** (free at [developer.adzuna.com](https://developer.adzuna.com/))

## 🚀 Getting Started

### Step 1: Backend Setup

```bash
cd Backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the Backend folder:
```env
SECRET_KEY=your-secret-key-here
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?tlsAllowInvalidCertificates=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Start the server:
```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Backend will be running at `http://127.0.0.1:8001`

### Step 2: Frontend Setup

```bash
cd Frontend

# Install packages
npm install

# Start development server
npm run dev
```

Frontend will open at `http://localhost:5173`

### Step 3: Make Sure Ollama is Running

In another terminal:
```bash
ollama serve
```

Then in a separate terminal, pull the llama3.2 model:
```bash
ollama pull llama3.2
```

That's it! You're ready to roll. 🎉

## 📖 How to Use

1. **Sign up** with your email
2. **Search for jobs** using the Job Search page
3. **Generate cover letters** powered by AI
4. **Track applications** as you apply to positions
5. **Monitor your progress** with real-time stats

## 🏗️ Project Structure

```
JobSync/
├── Backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app setup
│   │   ├── database.py            # MongoDB connection
│   │   ├── routes/
│   │   │   ├── auth.py            # Login & signup
│   │   │   ├── jobs.py            # Job CRUD + Adzuna search
│   │   │   ├── ai.py              # Cover letter generation
│   │   │   └── deps.py            # JWT token validation
│   │   └── schemas/
│   │       ├── user.py            # User data models
│   │       └── job.py             # Job data models
│   ├── requirements.txt
│   └── .env                       # Config file (create this)
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing page with features
    │   │   ├── Login.jsx           # Sign in
    │   │   ├── Signup.jsx          # Register
    │   │   ├── JobSearchPage.jsx   # Search jobs
    │   │   ├── JobTrackerPage.jsx  # Manage applications
    │   │   └── CoverLetterPage.jsx # Generate letters
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   ├── JobSearch.jsx       # Search form & results
    │   │   ├── JobForm.jsx         # Add new application
    │   │   ├── JobCard.jsx         # Application card
    │   │   ├── CoverLetterGenerator.jsx
    │   │   └── JobStats.jsx        # Dashboard stats
    │   ├── services/
    │   │   └── api.js              # API calls
    │   ├── App.jsx                 # Main component
    │   ├── main.jsx                # React entry point
    │   └── styles.css              # All styling
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🔌 API Reference

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Get JWT token |

### Jobs (all require authentication)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/jobs/` | Get your applications |
| POST | `/jobs/` | Add new application |
| PUT | `/jobs/{id}` | Update application |
| DELETE | `/jobs/{id}` | Delete application |
| GET | `/jobs/stats` | Get statistics |
| GET | `/jobs/search-external` | Search Adzuna jobs |

### AI
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/ai/generate-cover-letter` | Generate cover letter |

## 🔒 Security Features

- **Password Hashing**: Bcrypt with proper byte handling
- **JWT Tokens**: Secure token-based authentication that expires after 30 days
- **User Data Isolation**: Each user only sees their own applications
- **Input Validation**: All requests are validated before processing
- **CORS Protection**: Frontend-only access configured
- **MongoDB Security**: Using Atlas with SSL encryption

## 🐛 Troubleshooting

**MongoDB won't connect?**
- Check your IP is whitelisted in MongoDB Atlas
- Verify `.env` file has correct credentials
- Try connecting with MongoDB Compass first to test

**Getting CORS errors?**
- Make sure backend is running on `http://127.0.0.1:8001`
- Check your API calls use the correct base URL
- Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R)

**Ollama not generating cover letters?**
- Confirm `ollama serve` is running
- Check `ollama pull llama3.2` completed successfully
- Verify `OLLAMA_URL` in `.env` matches where Ollama is running

**Stuck on login?**
- Clear browser cookies and localStorage
- Check backend is running without errors
- Try signing up with a new account

## 📦 Building for Production

### Backend
Build and deploy to Heroku, Railway, or Render:
```bash
# Set MONGO_URL environment variable on your hosting platform
git push your-platform-name main
```

### Frontend
```bash
npm run build
# Deploy the 'dist/' folder to Vercel, Netlify, or any static host
```

## 📝 Notes

- This is a work in progress - features and UI may evolve
- Ollama is required for local AI - make sure it's installed and running
- Job search requires valid Adzuna API credentials
- All data is encrypted at rest in MongoDB

## 🤝 Contributing

Found a bug or have ideas? Feel free to create an issue or submit a pull request.

## 📄 License

MIT - feel free to use this however you'd like

---

**Made with ❤️ to make job hunting less painful.**

