'use client';

import { useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";

export function CheckGroup() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getGroupAndCheckMembership = async () => {
      const parts = pathname.split("/");
      const gid = parts[2];

      try {
        const groupResponse = await fetch('/api/checkgroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });

        if (!groupResponse.ok) {
          throw new Error('Get group failed');
        }

        const groupData = await groupResponse.json();
        if (!groupData.result) {
          router.push('/group-not-found');
          return;
        }

        const membershipResponse = await fetch('/api/checkmembership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gid }),
        });

        if (!membershipResponse.ok) {
          throw new Error('Get membership failed');
        }

        const membershipData = await membershipResponse.json();
        if (!membershipData.result) {
          router.push(`/groups/${gid}/join-group`);
        }

      } catch (error) {
        console.error('Error checking group or membership:', error);
      }
    };

    getGroupAndCheckMembership();
  }, [pathname, router]);
}