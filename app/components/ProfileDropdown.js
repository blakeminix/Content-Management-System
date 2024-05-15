'use client';

import { useState } from "react";
import '../globals.css'
import Link from 'next/link'

export function ProfileDropdown() {

    const [showDropdown, setShowDropdown] = useState(false);

    function toggleDropdown() {
        const dropdown = document.getElementById("dropdown-content");
        dropdown.classList.toggle("show");
    }

    return (
        <div>
        <button className="prof" onClick={toggleDropdown}></button>
        <div className="dropdown-content" id="dropdown-content">
            <Link href="/[username]" as="/blakeminix">Profile</Link>
            <Link href="/settings">Settings</Link>
            <a>Dark Mode</a>
            <button type="submit">Logout</button>
        </div>
        </div>
    );
}
