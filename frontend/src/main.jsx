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
import ErrorHandler from './components/ErrorHandler.jsx';
import Dashboard from './routes/Dashboard.jsx';

const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, errorElement: <ErrorHandler />, children: [
    { path: '/', element: <Home />, action: signinAction },
    { path: '/signup', element: <Signup />, action: signupAction },
    { path: '/dashboard', element: <Dashboard /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
