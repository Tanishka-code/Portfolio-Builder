# Portfolio Builder 🚀

A full-stack web application that allows users to create, customize, save, edit, share, and download professional portfolios through a simple and responsive interface.

Portfolio Builder eliminates the need to manually edit portfolio code whenever personal information, skills, or projects change.

---

## 🌐 Live Demo

**Live Website:**  
https://portfolio-builder-rouge.vercel.app

**Backend API:**  
https://portfolio-builder-backend-8js4.onrender.com

**GitHub Repository:**  
https://github.com/Tanishka-code/Portfolio-Builder

---

## 📌 Problem Statement

Creating and maintaining a personal portfolio often requires manually editing HTML, CSS, or React components whenever new projects, skills, or personal information need to be added.

This can become time-consuming when portfolios need to be updated regularly.

### Solution

Portfolio Builder provides a simple interface where users can enter their information, add projects, upload a profile image, connect social links, preview the portfolio in real time, and download the finished portfolio as a PDF.

The application is designed to make portfolio creation and management easier without requiring users to modify source code for every update.

---

## ✨ Features

### Portfolio Builder

- Enter username, name, role, and About information
- Add comma-separated skills
- Add multiple projects
- Add project title and description
- Live portfolio preview
- Animated typing tagline

### Portfolio Management

- Create and save portfolios
- View saved portfolios
- Edit existing portfolios
- Delete portfolios
- Unique username validation
- Public portfolio pages using usernames

### Profile Image

- Upload profile images
- Supports JPG, JPEG, PNG, and WEBP
- Maximum file size of 5 MB
- Instant image preview
- Cloudinary-based image storage
- Profile image displayed in the portfolio

### Social Links

- GitHub
- LinkedIn
- Portfolio Website
- X/Twitter
- Social links displayed only when provided
- Links open in a new browser tab

### Light & Dark Mode

- Light theme
- Dark theme
- Theme preference stored using browser localStorage

### PDF Export

- Download portfolios as PDF
- Includes profile information
- Includes skills and projects
- Includes profile image when available
- Includes social links
- Supports multi-page portfolio content
- Generates the PDF directly in the browser

### Responsive Design

- Responsive portfolio builder
- Responsive preview
- Responsive saved portfolio cards
- Mobile-friendly portfolio pages

### User Experience

- Form validation
- Loading states
- Save/update feedback
- Error handling
- Responsive interface

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Type Animation

### Backend

- Node.js
- Express.js
- Mongoose
- CORS

### Database

- MongoDB Atlas

### Image Storage

- Cloudinary

### PDF Generation

- jsPDF
- html2canvas

### Deployment

- Vercel — Frontend
- Render — Backend

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React Frontend   │
                         │ Vite + Tailwind  │
                         └────────┬─────────┘
                                  │
                              REST API
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Express Backend  │
                         │     Node.js      │
                         └───────┬───┬──────┘
                                 │   │
                    ┌────────────┘   └─────────────┐
                    ▼                              ▼
             ┌──────────────┐              ┌──────────────┐
             │ MongoDB Atlas│              │  Cloudinary  │
             │   Database   │              │ Profile Img  │
             └──────────────┘              └──────────────┘

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
│   ├── Pages/
│   ├── Context/
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── vercel.json
└── README.md

🔄 Application Workflow
1. Create
Users enter their personal information, skills, projects, social links, and profile image.
2. Preview
The portfolio preview updates dynamically while the user fills out the form.
3. Upload Image
If a profile image is selected, it is uploaded through the backend to Cloudinary.
4. Save
Portfolio information is sent to the Express REST API.
5. Store
The backend stores portfolio data in MongoDB Atlas using Mongoose.
6. Manage
Saved portfolios can be viewed, edited, and deleted.
7. Share
Each portfolio can be accessed through its unique username.
8. Export
Users can download the completed portfolio as a PDF.
🔌 API Endpoints
Method	Endpoint	Description
GET	/health	Checks backend and database status
POST	/api/portfolio	Creates a portfolio
GET	/api/portfolio	Returns all portfolios
GET	/api/portfolio/:username	Fetches a portfolio by username
PUT	/api/portfolio/:id	Updates an existing portfolio
DELETE	/api/portfolio/:id	Deletes a portfolio
POST	/api/portfolio/upload-profile-image	Uploads a profile image


⚙️ Prerequisites
Before running the project, install:
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
Create:
backend/.env

Add:
MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_ORIGINS=http://localhost:5173,https://your-vercel-domain

Frontend
Set:
VITE_API_URL=http://localhost:5000/api/portfolio

For production, use:
VITE_API_URL=https://portfolio-builder-backend-8js4.onrender.com/api/portfolio

Never commit .env files, MongoDB credentials, or Cloudinary secrets to GitHub.

▶️ Run Locally
Start the backend
From the backend directory:
npm start

Backend:
http://localhost:5000

Start the frontend
Open another terminal in the project root:
npm run dev

Frontend:
http://localhost:5173

🧪 Testing
The main application flow can be tested as follows:
Portfolio Creation
1. Enter username, name, and role.
2. Add About information.
3. Add skills.
4. Add projects.
5. Add social links.
6. Upload a profile image.
7. Preview the portfolio.
8. Save the portfolio.
Portfolio Management
1. Open Saved Portfolios.
2. View a portfolio.
3. Edit the portfolio.
4. Save changes.
5. Delete the portfolio.
PDF Export
1. Open a saved portfolio.
2. Click Download PDF.
3. Verify that the generated PDF contains the portfolio information.
Theme
1. Switch between Light Mode and Dark Mode.
2. Refresh the page.
3. Verify that the selected theme is preserved.
☁️ Deployment
Frontend
The React frontend is deployed using Vercel.
Backend
The Node.js and Express backend is deployed using Render.
Production backend:
https://portfolio-builder-backend-8js4.onrender.com

Database
The application uses MongoDB Atlas for cloud database storage.
Image Storage
Profile images are stored using Cloudinary.
🔒 Security
The project uses environment variables for sensitive configuration.
Sensitive information includes:
- MongoDB connection string
- Cloudinary API secret
- Deployment-specific credentials
These values are kept outside the source code and are not committed to version control.
🧠 Learning Outcomes
This project provided practical experience in:
- React development
- Component-based architecture
- React Router
- REST API development
- Express.js
- MongoDB and Mongoose
- CRUD operations
- Cloudinary integration
- Image uploads
- FormData and multipart requests
- Axios
- CORS configuration
- Environment variables
- Responsive UI design
- Light/Dark mode implementation
- Browser-based PDF generation
- Vercel deployment
- Render deployment
- Production debugging
The project also provided hands-on experience troubleshooting real deployment issues involving DNS resolution, MongoDB Atlas connectivity, environment configuration, CORS, Cloudinary, and frontend-backend integration.
🚀 Project Highlights
The application provides a complete portfolio management workflow:
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

🔮 Future Improvements
Possible future enhancements include:
- User authentication
- Multiple portfolio templates
- Custom portfolio domains
- Portfolio analytics
- Additional customization options
These features are outside the current core scope of the project.
👩‍💻 Author
Tanishka Tawate
GitHub:
https://github.com/Tanishka-code
LinkedIn:
https://www.linkedin.com/in/tanishka-tawate-53238a3ab
⭐ Support
If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
📄 License
This project is created for learning, development, and portfolio demonstration purposes.
