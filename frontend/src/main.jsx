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
import Users, { loader as usersLoader } from './routes/admin/Users.jsx';
import EditUser, { loader as userDetailLoader, action as updateUserAction } from './routes/admin/EditUser.jsx';
import NewUser, { action as addUserAction } from './routes/admin/NewUser.jsx';
import Quizzes, { loader as quizzesLoader } from './routes/admin/Quizzes.jsx';
import NewQuiz, { action as addQuizAction } from './routes/admin/NewQuiz.jsx';
import EditQuiz, { loader as quizLoader, action as editQuizAction } from './routes/admin/EditQuiz.jsx';
import Questions from './routes/admin/Questions.jsx';


const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, id: 'root', loader: TokenLoader, errorElement: <ErrorHandler />, children: [
    { path: '/', element: <Home />, action: signinAction },
    { path: '/signup', element: <Signup />, action: signupAction },
    { path: '/dashboard', element: <Dashboard />, loader: checkAuthLoader },
    { path: '/profile', element: <Profile />, loader: checkAuthLoader, action: profileUpdateAction },
    { path: '/settings', element: <Settings />, loader: checkAuthLoader, action:  passwordUpdateAction },
    { path: '/logout', action: logoutAction },

    // Admin-only route
    {
      path: '/admin/users', element: (
      <AdminRoute>
        <Users />
      </AdminRoute>
      ), loader: usersLoader,  
    }, 
    {
      path: '/admin/edit-user/:id',
      element : (
        <AdminRoute>
          <EditUser />
        </AdminRoute>
      ), loader: userDetailLoader, action: updateUserAction
    },
    {
      path: '/admin/new-user/',
      element: (
        <AdminRoute>
          <NewUser />
        </AdminRoute>
      ), action: addUserAction
    },
    {
      path: '/admin/quizzes', element: (
        <AdminRoute>
          <Quizzes />
        </AdminRoute>
      ), loader: quizzesLoader 
    },
    {
      path: '/admin/quizzes/:quizId/questions',
        element: (
          <AdminRoute>
            <Questions />
          </AdminRoute>
        )
    },
    {
      path: '/admin/new-quiz/',
      element: (
        <AdminRoute>
          <NewQuiz />
        </AdminRoute>
      ), action: addQuizAction
    }, 
    {
      path: '/admin/edit-quiz/:id',
      element: (
        <AdminRoute>
          <EditQuiz />
        </AdminRoute>
      ), loader: quizLoader, action: editQuizAction
    }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
