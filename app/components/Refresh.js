'use client';

import {useRouter} from "next/navigation"

export function Refresh() {
    const router = useRouter();
    router.refresh();

    return (
        <div></div>
    );
}
