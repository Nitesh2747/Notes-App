import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-ink-soft border-b border-brass-dark/40'>
      <span className='font-display text-xl tracking-tight text-paper'>
        Notes<span className='text-brass'>.</span>
      </span>
      <div className='flex flex-row gap-8'>

        <NavLink
          to='/'
          className={({ isActive }) =>
            `text-sm tracking-wide uppercase pb-1 border-b-2 transition-colors ${
              isActive ? 'text-brass border-brass' : 'text-graphite border-transparent hover:text-paper'
            }`
          }
        >
          New
        </NavLink>

        <NavLink
          to='/pastes'
          className={({ isActive }) =>
            `text-sm tracking-wide uppercase pb-1 border-b-2 transition-colors ${
              isActive ? 'text-brass border-brass' : 'text-graphite border-transparent hover:text-paper'
            }`
          }
        >
          Pastes
        </NavLink>

      </div>
    </nav>
  )
}

export default Navbar
