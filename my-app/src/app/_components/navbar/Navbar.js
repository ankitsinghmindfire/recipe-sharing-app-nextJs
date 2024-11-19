'use client';
import Image from 'next/image';
import menu from '../../../../public/menu.svg';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../slices/authSlice';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**  Function to handle user logout*/
  const LogoutUser = () => {
    localStorage.clear();
    dispatch(logoutSuccess());
    redirect('/login');
  };

  /**  Function to close the hamburger menu when a link is clicked */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleMenu = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <nav>
        <div className='nav-left'>
          <Image
            alt='hamburger-icon'
            src={menu}
            className='hamburger-icon'
            onClick={toggleMenu}
            style={isOpen ? { transform: 'rotate(90deg)' } : {}}
            role='button'
          />
          <h2>Recipe Sharing App</h2>
        </div>
        <div className={`nav-right ${isOpen ? 'open' : ''}`}>
          <ul>
            {token ? (
              <>
                <li>
                  <Link href='/' onClick={handleToggleMenu}>
                    Recipes
                  </Link>{' '}
                </li>

                <li>
                  <Link href='/recipe/addrecipe' onClick={handleToggleMenu}>
                    Add Recipe
                  </Link>{' '}
                </li>
                <li>
                  <Link href='login' onClick={LogoutUser}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href='login'>Login</Link>{' '}
                </li>
                <li>
                  <Link href='signup'>SignUp</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};
