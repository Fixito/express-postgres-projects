import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const NavSharedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default NavSharedLayout;
