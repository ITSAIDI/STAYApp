'use client';

import dynamic from 'next/dynamic';

const UserManual = dynamic(() => import('../../components/UserManual'), {
  ssr: false,
  loading: () => <p>Loading PDF Viewer...</p>,
});

export default function Page() {
  return (
    <div className=' h-full w-full'>
      <UserManual />
    </div>
  );
}
