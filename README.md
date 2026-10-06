# Portfolio Builder 🚀

A full-stack web application that allows users to create, customize, save, edit, share, and download professional portfolios through a simple and responsive interface.

Instead of manually editing portfolio code whenever information changes, users can enter their details, add projects, upload a profile image, connect social links, preview the portfolio in real time, and export it as a PDF.

---

## 🌐 Live Demo

**Frontend:**  
[Add your Vercel URL here]

**Backend API:**  
https://portfolio-builder-backend-8js4.onrender.com

**GitHub Repository:**  
https://github.com/Tanishka-code/Portfolio-Builder

---

## 📌 Problem Statement

Creating and maintaining a personal portfolio often requires manually editing HTML, CSS, or React components whenever new projects, skills, or personal information need to be added.

This process can be time-consuming, especially when a portfolio needs to be updated frequently.

### Solution

Portfolio Builder provides a simple interface where users can:

- Enter their personal information
- Add skills and projects
- Upload a profile image
- Add social links
- Preview the portfolio while editing
- Save and manage portfolios
- Access a public portfolio using a unique username
- Download the portfolio as a PDF

The goal is to make portfolio creation and maintenance simpler without requiring users to modify source code every time their information changes.

---

## ✨ Features

### 🧑‍💻 Portfolio Builder

- Enter username, name, role, and About information
- Add comma-separated skills
- Add multiple projects
- Add project title and description
- Live preview while editing
- Animated typing tagline in the preview

### 📂 Portfolio Management

- Create and save portfolios
- View saved portfolios
- Edit existing portfolios
- Delete portfolios
- Unique username validation
- Fetch portfolio using username
- Public portfolio details page

### 🖼️ Profile Image

- Upload a profile image
- Supports JPG, JPEG, PNG, and WEBP
- Maximum file size of 5 MB
- Image preview before saving
- Cloudinary-based image storage
- Profile image displayed in the portfolio

### 🔗 Social Links

- GitHub
- LinkedIn
- Portfolio Website
- X/Twitter
- Social icons are displayed only when a link is provided
- Links open in a new tab

### 🎨 Themes

- Light mode
- Dark mode
- Theme preference stored using browser `localStorage`

### 📄 PDF Export

- Download portfolio as a PDF
- Includes portfolio information, skills, projects, profile image, and social links
- Supports longer portfolios across multiple pages
- Generates the PDF directly from the browser

### 📱 Responsive Design

- Responsive builder layout
- Responsive portfolio preview
- Responsive saved portfolio cards
- Works across desktop, tablet, and mobile screen sizes

### ⚙️ User Experience

- Loading states
- Error handling
- Form validation
- Save and update feedback
- Clean and simple interface

---

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **react-type-animation**
- **jsPDF**
- **html2canvas**

### Backend

- **Node.js**
- **Express.js**
- **Mongoose**
- **CORS**

### Database

- **MongoDB Atlas**

### Image Storage

- **Cloudinary**

### Deployment

- **Vercel** — Frontend
- **Render** — Backend

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  Vite + Tailwind    │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │    Node.js + API    │
                    └───────┬───────┬─────┘
                            │       │
                            │       │
                            ▼       ▼
                 ┌─────────────┐  ┌─────────────┐
                 │  MongoDB    │  │  Cloudinary │
                 │    Atlas     │  │   Images    │
                 └─────────────┘  └─────────────┘

📂 Project Structure
Portfolio-Builder/
│
├── backend/
│   ├── models/
│   │   └── Portfolio.js
│   │
│   ├── routes/
│   │   └── portfolioRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── src/
│   ├── Components/
│   │   ├── PortfolioForm.jsx
│   │   └── ...
│   │
│   ├── Pages/
│   │   ├── Builder.jsx
│   │   ├── Portfolios.jsx
│   │   ├── PortfolioDetails.jsx
│   │   └── ...
│   │
│   ├── Context/
│   │   ├── ThemeProvider.jsx
│   │   └── ...
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── screenshots/
│
├── package.json
├── vite.config.js
├── vercel.json
└── README.md

🔄 How It Works
1. Create a Portfolio
The user fills in:
- Username
- Name
- Role
- About
- Skills
- Projects
- Social links
- Profile image
2. Live Preview
The preview updates dynamically as the user enters information.
3. Upload Profile Image
The selected image is uploaded to Cloudinary through the backend.
The resulting secure image URL is then associated with the portfolio.
4. Save Portfolio
Portfolio information is sent from the React frontend to the Express backend using REST APIs.
5. Store Data
The backend stores portfolio information in MongoDB Atlas using Mongoose.
6. Manage Portfolios
Users can:
- View saved portfolios
- Edit portfolios
- Delete portfolios
7. Public Portfolio
Each portfolio can be viewed through its unique username.
8. Export Portfolio
Users can download their portfolio as a PDF directly from the application.
🔌 API Endpoints
Health Check
GET /health

Checks whether the backend is running and whether MongoDB is connected.
Create Portfolio
POST /api/portfolio

Creates and stores a new portfolio.
Get All Portfolios
GET /api/portfolio

Returns all saved portfolios.
Get Portfolio by Username
GET /api/portfolio/:username

Fetches a portfolio using its unique username.
Update Portfolio
PUT /api/portfolio/:id

Updates an existing portfolio.
Delete Portfolio
DELETE /api/portfolio/:id

Deletes a portfolio using its MongoDB document ID.
Upload Profile Image
POST /api/portfolio/upload-profile-image

Uploads a profile image to Cloudinary and returns the stored image URL.
⚙️ Getting Started
Prerequisites
Make sure you have installed:
- Node.js
- npm
- MongoDB Atlas account
- Cloudinary account
📥 Installation
1. Clone the repository
git clone https://github.com/Tanishka-code/Portfolio-Builder.git

cd Portfolio-Builder

2. Install frontend dependencies
npm install

3. Install backend dependencies
cd backend
npm install

🔐 Environment Variables
Backend
Create a file:
backend/.env

Add:
MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_ORIGINS=http://localhost:5173,https://your-vercel-domain

Frontend
If required by your deployment configuration, create:
.env

with:
VITE_API_URL=https://portfolio-builder-backend-8js4.onrender.com/api/portfolio

Never commit .env files or secret credentials to GitHub.

▶️ Running the Project Locally
Start the Backend
From the backend directory:
npm start

The backend normally runs on:
http://localhost:5000

Start the Frontend
Open another terminal in the project root:
npm run dev

The frontend normally runs on:
http://localhost:5173

🧪 Testing the Application
After starting both frontend and backend:
Test Portfolio Creation
1. Open the frontend
2. Enter username, name, and role
3. Add skills
4. Add projects
5. Add social links
6. Upload a profile image
7. Preview the portfolio
8. Click Save Portfolio
Test Portfolio Management
1. Open Saved Portfolios
2. View a portfolio
3. Edit the portfolio
4. Save changes
5. Delete the portfolio
Test PDF Export
1. Open a saved portfolio
2. Select Download PDF
3. Verify the generated PDF contains the portfolio information
Test Themes
1. Switch between Light and Dark mode
2. Refresh the page
3. Verify the selected theme is preserved
☁️ Deployment
Frontend — Vercel
The React frontend is deployed using Vercel.
The Vercel configuration includes support for client-side React Router routes.
Backend — Render
The Express backend is deployed using Render.
Production backend:
https://portfolio-builder-backend-8js4.onrender.com

Database — MongoDB Atlas
Portfolio data is stored in MongoDB Atlas.
Image Storage — Cloudinary
Profile images are stored in Cloudinary, while the resulting secure image URL is saved with the portfolio data.
🔒 Security and Configuration
The project uses environment variables for sensitive configuration.
Sensitive values include:
- MongoDB connection string
- Cloudinary API secret
- Other deployment-specific credentials
These values are kept outside the source code.
The .env file is excluded from version control.
🧠 Key Learning Outcomes
Building this project provided practical experience with:
- React component development
- React Router
- State management
- REST API design
- Express.js
- MongoDB and Mongoose
- CRUD operations
- Cloudinary integration
- File uploads
- FormData and multipart requests
- Axios
- CORS configuration
- Environment variables
- Responsive UI design
- Light/Dark theme implementation
- Browser-based PDF generation
- Vercel deployment
- Render deployment
- Production debugging
A major part of the learning process involved solving real deployment and integration problems across the frontend, backend, database, and external services.
🚧 Current Project Scope
The current version focuses on the core portfolio-building workflow:
Create
   ↓
Preview
   ↓
Save
   ↓
View
   ↓
Edit
   ↓
Delete
   ↓
Customize
   ↓
Share
   ↓
Download PDF

The project is intentionally focused on portfolio creation and management without adding unnecessary complexity.
🔮 Future Improvements
Possible future enhancements include:
- User authentication
- Multiple portfolio templates
- Custom portfolio domains
- Portfolio analytics
- Additional customization options
These are outside the current core scope.
👩‍💻 Author
Tanishka Tawate
GitHub:
https://github.com/Tanishka-code
LinkedIn:
https://www.linkedin.com/in/tanishka-tawate-53238a3ab
⭐ Support
If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
