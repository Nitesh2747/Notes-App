import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { logout, deleteAccount } from '../redux/authSlice';
import { resetAllPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const Navbar = () => {

  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { username } = useSelector((state) => state.auth);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetAllPastes());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setConfirmPassword('');
    setShowConfirmPassword(false);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const result = await dispatch(deleteAccount(confirmPassword));
    setDeleting(false);

    if (deleteAccount.fulfilled.match(result)) {
      dispatch(logout());
      dispatch(resetAllPastes());
      toast.success('Account deleted');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Failed to delete account');
    }
  }

  return (
    <nav className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-8 py-3 sm:py-4 bg-ink-soft border-b border-brass-dark/40'>
      <div>
        <NavLink
          to='/'
        >
          <span className='font-display text-lg sm:text-xl tracking-tight text-paper'>
            Notes<span className='text-brass'>.</span>
          </span>
        </NavLink>
      </div>

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
          <div className='relative pl-3 sm:pl-6 ml-0 sm:ml-2 border-l border-brass-dark/40' ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className='flex items-center gap-1.5 text-sm text-graphite hover:text-paper transition-colors'
            >
              <span>{username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform ${showMenu ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showMenu && (
              <div className='absolute right-0 mt-2 w-44 rounded-lg bg-paper border border-brass-dark/20 shadow-lg overflow-hidden z-20'>
                <button
                  onClick={() => { setShowMenu(false); handleLogout(); }}
                  className='w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors'
                >
                  Logout
                </button>
                <div className='border-t border-brass-dark/10' />
                <button
                  onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                  className='w-full text-left px-4 py-2.5 text-sm text-rust hover:bg-rust/10 transition-colors'
                >
                  Delete account
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {showDeleteModal && (
        <div
          className='fixed inset-0 bg-ink/80 flex items-center justify-center px-6 z-30'
          onClick={closeDeleteModal}
        >
          <div
            className='bg-paper rounded-lg p-6 w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className='font-display font-semibold text-ink text-lg'>Delete your account?</h4>
            <p className='text-sm text-ink/70 mt-2'>
              This permanently deletes your account and every note you've created. This cannot be undone.
            </p>

            <div className='relative mt-4'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Enter your password to confirm'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-3 py-2 pr-10 rounded-lg bg-ink-soft text-paper text-sm border border-brass-dark/30 focus:border-brass focus:outline-none'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-graphite hover:text-paper'
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className='flex gap-3 mt-4'>
              <button
                onClick={handleDeleteAccount}
                disabled={!confirmPassword || deleting}
                className='px-4 py-2 rounded-lg bg-rust hover:bg-rust/80 disabled:opacity-50 disabled:cursor-not-allowed text-paper text-sm font-display font-medium'
              >
                {deleting ? 'Deleting...' : 'Delete permanently'}
              </button>
              <button
                onClick={closeDeleteModal}
                className='px-4 py-2 rounded-lg text-ink/60 hover:text-ink text-sm font-display'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar