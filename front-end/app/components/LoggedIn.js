'use client';

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


export default function LoggedIn() {

  const username = useSelector((state) => state.authReducer.value.username);
  const router = useRouter();
  
  useEffect(() => {
    if (username === "") {
      router.push("/login");
    }
  }, [username, router]);

  return null;
}
