'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
    const pathname = usePathname();

    // Hide navbar on admin routes — admin has its own sidebar layout
    if (pathname.startsWith('/admin')) {
        return null;
    }

    return <Navbar />;
}
