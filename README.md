# 📚 AI Study Planner

An AI-powered full-stack web application that generates personalized day-by-day study schedules based on your subjects, exam dates, and available study hours.

🔗 **Live Demo:** https://ai-study-planner-bice.vercel.app/

---

## ✨ Features

- 🔐 **Google Authentication** — secure login with your Google account
- ➕ **Add Subjects** — enter subject name, exam date, study hours per day and topics
- 🤖 **AI Study Plan Generation** — generates a personalized day-by-day schedule using Groq AI (LLaMA 3)
- ✅ **Track Progress** — mark topics as complete with a visual progress bar
- 🗑️ **Delete Subjects** — remove subjects you no longer need
- 👤 **Per-user Data** — each user only sees their own subjects and plans
- 📱 **Responsive UI** — works on both desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas + Mongoose |
| Authentication | NextAuth.js (Google OAuth) |
| AI | Groq API (LLaMA 3.3 70B) |
| Deployment | Vercel |

---

## 📸 Screenshots

> Add screenshots of your app here!

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- Groq API key

### Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/study-planner.git
cd study-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## 🔮 Future Improvements

- [ ] Edit existing subjects
- [ ] Save generated plans to database
- [ ] Email reminders before exam dates
- [ ] Dark mode
- [ ] Mobile app version with React Native

---

