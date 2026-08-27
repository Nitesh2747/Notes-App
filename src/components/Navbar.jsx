import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { logout } from '../redux/authSlice';
import { resetAllPastes } from '../redux/pasteSlice';


const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetAllPastes());
    navigate('/login');
  };

  return (
    <nav className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-8 py-3 sm:py-4 bg-ink-soft border-b border-brass-dark/40'>
      <span className='font-display text-lg sm:text-xl tracking-tight text-paper'>
        Notes<span className='text-brass'>.</span>
      </span>

      <div className='flex flex-row flex-wrap items-center gap-3 sm:gap-8'>

        <NavLink
          to='/'
          className={({ isActive }) =>
            `text-xs sm:text-sm tracking-wide uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-brass border-brass' : 'text-graphite border-transparent hover:text-paper'
            }`
          }
        >
          Create
        </NavLink>

        <NavLink
          to='/pastes'
          className={({ isActive }) =>
            `text-xs sm:text-sm tracking-wide uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-brass border-brass' : 'text-graphite border-transparent hover:text-paper'
            }`
          }
        >
          View
        </NavLink>

        {username && (
          <div className='flex items-center gap-2 sm:gap-4 pl-3 sm:pl-6 ml-0 sm:ml-2 border-l border-brass-dark/40'>
             <span className='hidden sm:inline text-sm text-graphite'>
              {username}
            </span>
            <button
              onClick={handleLogout}
              className='text-xs sm:text-sm tracking-wide uppercase text-graphite border-b-2 border-transparent hover:text-brass hover:border-brass transition-colors'
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar
