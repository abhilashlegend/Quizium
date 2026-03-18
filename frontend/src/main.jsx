import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './routes/RootLayout.jsx';
import Home, { action as signinAction } from './routes/Home.jsx';
import Signup, { action as signupAction } from './routes/Signup.jsx';
import { action as logoutAction } from './routes/Logout.js';
import ErrorHandler from './components/ErrorHandler.jsx';
import Dashboard from './routes/Dashboard.jsx';
import { loader as TokenLoader, checkAuthLoader } from './util/auth.js';
import Profile, { action as profileUpdateAction } from './routes/Profile.jsx';
import Settings, { action as passwordUpdateAction } from './routes/Settings.jsx';
import AdminRoute from './routes/admin/AdminRoute.jsx';
import Users from './routes/admin/Users.jsx';

const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, id: 'root', loader: TokenLoader, errorElement: <ErrorHandler />, children: [
    { path: '/', element: <Home />, action: signinAction },
    { path: '/signup', element: <Signup />, action: signupAction },
    { path: '/dashboard', element: <Dashboard />, loader: checkAuthLoader },
    { path: '/profile', element: <Profile />, loader: checkAuthLoader, action: profileUpdateAction },
    { path: '/settings', element: <Settings />, action:  passwordUpdateAction },
    { path: '/logout', action: logoutAction },

    // Admin-only route
    {
      path: '/admin/users', element: (
      <AdminRoute>
        <Users />
      </AdminRoute>
      ), loader: checkAuthLoader 
    }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
