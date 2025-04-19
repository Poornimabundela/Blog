import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/Endpoint';
import { removeUser } from '../redux/AuthSlice';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const request = await post("/auth/logout");
      const response = request.data;
      if (request.status === 200) {
        navigate('/login');
        dispatch(removeUser());
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar-custom d-flex justify-content-between align-items-center p-3 px-4">
      <Link to={'/'} className="text-decoration-none">
        <h1 className="brand-name m-0">TIT Blog</h1>
      </Link>


      <div className="d-flex align-items-center">
        {user && user.role === 'admin' && (
          <Link to="/dashboard" className="btn btn-warning fw-bold mx-3">Admin Panel</Link>
        )}

        {!user ? (
          <Link to={'/login'}>
            <button className="btn btn-light fw-bold px-4 py-2 mx-3">Sign In</button>
          </Link>
        ) : (
          <div className="dropdown">
            <div
              className="user-name-box fw-bold text-white px-3 py-2 rounded"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user?.FullName?.split(' ')[0] || 'User'}
            </div>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2">
              <li><Link className="dropdown-item" to={`/profile/${user._id}`}>Profile</Link></li>
              <li><span className="dropdown-item" onClick={handleLogout} style={{ cursor: "pointer" }}>Sign Out</span></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
