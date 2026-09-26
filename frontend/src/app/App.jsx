import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes.jsx';
import { useAuth } from '../features/auth/hook/UseAuth.jsx';

const App = () => {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={router} />;
}

export default App
