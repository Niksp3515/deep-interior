# Deep Interior - Portfolio CMS

This is a Full-Stack application for an interior design portfolio featuring a Vite/React frontend and a Node.js/Express backend. 
It includes a public portfolio facing side and a secure Admin Dashboard for uploading projects, categories, 3D designs, and real project media.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Query, React Router Dom
- **Backend**: Node.js, Express, MongoDB/Mongoose, JSON Web Tokens
- **Media**: Cloudflare R2 (for image and video delivery), Multer

---

## Local Development Setup

### 1. Database Requirements
Before starting, ensure you have:
- A MongoDB cluster (e.g., MongoDB Atlas) - get your Connection URI.

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=super_secret_jwt_string
R2_ACCESS_KEY=your_r2_key
R2_SECRET_KEY=your_r2_secret
R2_BUCKET=your_r2_bucket
R2_ACCOUNT_ID=your_r2_account_id
```

Start the backend development server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
# Client will run on http://localhost:8080.
# API requests mapped to /api will proxy to localhost:5000 automatically.
```

---

## Application Usage & Admin Access
- The public site is viewable at the root URL (`/`).
- The **Admin Login** is located at `/admin/login`.
- To create your very first admin user, you can send a `POST` request (via Postman or Curl) to `http://localhost:5000/api/auth/register` with a JSON body:
  `{ "username": "admin", "password": "password123" }`
- Log in to manage projects, add categories, and upload media directly to Cloudflare R2.

---

## Deployment Instructions

### Deploying the Backend
We recommend platforms like Render, Railway, or Heroku for the Node.js backend.
1. Connect your GitHub repository to your chosen service.
2. Set the Root Directory to `backend` (if supported) or customize the build/start command to `cd backend && npm start`.
3. Add all your `.env` variables (MONGO_URI, R2_*, JWT_SECRET) in the hosting provider's environment variables section.
4. Ensure the backend starts correctly. Make note of the live URL (e.g., `https://api.deepinterior.com`).

### Deploying the Frontend (Vercel)
We recommend Vercel or Netlify for the frontend.
1. Import your repository to Vercel.
2. Set the **Framework Preset** to Vite.
3. Set the **Root Directory** to `frontend`.
4. *Important*: Because the frontend currently proxies to `localhost:5000` in dev mode, you need to tell Axios to use the live backend URL in production. 
   - Option A: Update `frontend/src/lib/api.ts` to use `import.meta.env.VITE_API_URL` instead of `/api`.
   - Option B: Use Vercel's `vercel.json` rewrites to proxy `/api` to your live backend URL.

Example `vercel.json` to place in `frontend`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-live-backend-url.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
