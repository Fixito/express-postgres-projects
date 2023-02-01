import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Home,
  Error,
  Register,
  Login,
  Verify,
  Dashboard,
  ProtectedRoute,
  ForgotPassword,
  ResetPassword
} from './pages';
import { useGlobalContext } from './context.jsx';
import NavbarSharedLayout from './components/NavSharedLayout.jsx';

const App = () => {
  const { isLoading } = useGlobalContext();

  if (isLoading) {
    return (
      <section className='page page-center'>
        <div className='loading'></div>
      </section>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<NavbarSharedLayout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/user/verify-email' element={<Verify />} />
          <Route path='/user/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
