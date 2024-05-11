'use client';

import { useRouter } from 'next/navigation'
import React from 'react';
import { logIn, logOut } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';

export default function LogOut() {

    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(logOut());
        router.push('/login');
      };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <button type="submit">LogOut</button>
            </form>
        </div>
    );
}