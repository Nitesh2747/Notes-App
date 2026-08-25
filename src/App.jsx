import { createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './components/Navbar';
import Home from './components/Home';
import Pastes from './components/Pastes';
import ViewPastes from './components/ViewPastes';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';


const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
        <div>
          <ProtectedRoute>
            <Navbar />
            <br />
            <Home />
          </ProtectedRoute>
        </div>
    },
    {
      path: "/pastes",
      element:
        <div>
          <ProtectedRoute>
            <Navbar />
            <Pastes />
          </ProtectedRoute>
        </div>
    },
    {
      path: "/pastes/:id",
      element:
        <div>
          <ProtectedRoute>
            <Navbar />
            <ViewPastes />
          </ProtectedRoute>
        </div>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
  ]
);

function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
