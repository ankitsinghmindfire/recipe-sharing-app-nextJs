'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function isAuth(Component) {
  return function IsAuth(props) {
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!token) {
        return redirect('/login');
      }
    }, []);

    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}
