
import Dashboard from '@/components/ServiceProviderDashboard/ServiceDashboard/Dashboars';
import { Metadata } from 'next';
// import React from 'react'
// import { jwtDecode } from 'jwt-decode';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
export const metadata: Metadata = {
  title: "PicReZu - Professional",
};
export default function ProfessionalDashboardPage() {
  //    const token = useSelector((state: any) => state.auth.accessToken);
  // const router = useRouter();
  // const [isAuthorized, setIsAuthorized] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       if (decoded?.role === "PROFESSIONAL") {
  //         setIsAuthorized(true);
  //       } else {
  //         router.push('/login');
  //       }
  //     } catch (error) {
  //       router.push('/login');
  //     }
  //   } else {
  //     router.push('/login');
  //   }
  //   setLoading(false);
  // }, [token, router]);

  // if (loading) return <div className="text-white text-center mt-20">Checking permissions...</div>;
  return (
    <Dashboard/>
  )
}
