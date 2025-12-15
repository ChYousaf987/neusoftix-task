# Product Management System

This is a **Product Management System** where admins can **create, view, update, and delete products**.  
The UI follows the provided Figma design: [Figma Link](https://www.figma.com/design/FCbryFtYlqAeZbgYbHPrNf/Hiring-Task?node-id=0-1&p=f&t=dvxaLBYlkITUHRpW-0)

---

## Features
- CRUD (Create, Read, Update, Delete) products
- Prevent duplicate products
- Validate required fields on backend
- Handle API failures gracefully
- Disable submit button during API requests
- Handle empty product states
- Image upload with max size 1.3 MB
- Responsive UI based on Figma design

---

## Project Structure

product-management-system/
├─ backend/
│ ├─ config/
│ ├─ controllers/
│ ├─ middleware/
│ ├─ models/
│ ├─ routes/
│ ├─ uploads/
│ ├─ index.js
│ ├─ package.json
│ └─ .env.example
├─ frontend/
│ ├─ public/
│ ├─ src/
│ ├─ package.json
│ └─ vite.config.js
└─ README.md



---

## Setup Instructions

### Backend

1. Navigate to the backend folder:
```bash
cd backend

2. Install dependencies:

npm install

3. Create a .env file (copy from .env.example) and fill in the required values:

PORT=3001
MONGO_URL=<your_mongo_connection_string>

4. Start the backend server:

npm run server




### Frontend

1. Navigate to the frontend folder:

cd frontend

2. Install dependencies:

npm install

3. Run the frontend locally:

npm run dev