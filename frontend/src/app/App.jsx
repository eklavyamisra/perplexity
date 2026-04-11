import React from 'react'
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes.jsx';
import { useEffect } from 'react';
import { useAuth } from '../features/auth/hook/UseAuth.jsx';

const App = () => {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App