# 🌈 Holiday Mood Tracker

A React-based web application for tracking daily mood and wellbeing during the holiday season. Users can log their daily emotions, activities, and notes, then view insights through a comprehensive dashboard.

## 📋 Project Overview

This is a collaborative project between Software Engineering, Data Science, and UX/UI teams:

- **Software Engineering**: Build the web application with mood logging and data visualization
- **Data Science**: Provide visualizations and statistical analysis of mood data
- **UX/UI**: Design intuitive interfaces for rapid data input and clear dashboard displays

## ✨ Features

### Core Features

- **Mood Logging Form**: Record daily mood with date, rating, category, activities, and notes
- **Form Validation**: Ensure data quality with client-side validation
- **Local Storage**: Persist mood entries in browser localStorage
- **Dashboard**: View mood statistics and entry history
- **Data Visualization**: Display DS-generated charts and graphs

### Planned Features (Stretch Goals)

- Filter and search entries
- Edit and delete existing entries
- Backend API with Express/MongoDB
- User authentication
- Advanced analytics and predictive models

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/roxannecodes/mood-tracker-app.git
   cd mood-tracker-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Run the development server**

   ```sh
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in your terminal)
   - The app will automatically reload when you save changes

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
mood-tracker-app/
├── public/
│   └── data/
│       └── sample-data.json      # Sample mood data
├── src/
│   ├── components/
│   │   ├── MoodLogger/
│   │   │   └── MoodForm.jsx      # Mood logging form (TODO)
│   │   ├── Dashboard/
│   │   │   └── MoodDashboard.jsx # Statistics dashboard (TODO)
│   │   └── common/
│   │       └── Layout.jsx        # Layout wrapper (TODO)
│   ├── services/
│   │   └── dataService.js        # localStorage operations (TODO)
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Helper functions
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # Main styles
│   └── main.jsx                  # App entry point
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: CSS3
- **State Management**: React useState/useEffect
- **Data Storage**: Browser localStorage
- **Linting**: ESLint

## 📊 Data Format

Mood entries follow this structure:

```json
{
  "id": "unique-id",
  "date": "2025-12-10",
  "mood_rating": 4,
  "mood_category": "happy",
  "activities": ["exercise", "friends"],
  "notes": "Had a great day!"
}
```

## 👥 Team Workflow

### For Software Engineers

- Implement components marked with `// TODO` comments
- Follow the existing folder structure
- Test with sample data from `public/data/sample-data.json`
- Ensure all changes are committed to git with meaningful messages

## 🚀 Deployment

The app can be deployed to:

- GitHub Pages
- Netlify
- Vercel

Build for production:

```sh
npm run build
```

The `dist/` folder will contain the production-ready files.

## 📝 Contributing

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make your changes
3. Commit with meaningful messages: `git commit -m "Add feature description"`
4. Push to your branch: `git push origin feat/feature-name`
5. Create a Pull Request

## 📄 License

This project is part of an academic collaboration.

## 🤝 Acknowledgments

- Daylio Mood Tracker dataset for inspiration
- SE, DS, and UX/UI teams for collaboration
