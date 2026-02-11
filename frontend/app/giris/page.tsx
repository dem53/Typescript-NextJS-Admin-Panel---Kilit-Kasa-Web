"use client";

import LoginForm from "./LoginForm";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GirisPage = () => {

  const router = useRouter();
  const { user, auth, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && auth && user?.role === 'admin' ||
      user?.role === 'manager' || user?.role === 'personel'
    ) {
      router.replace("/admin/panel");
    } else if (!authLoading && auth && user?.role === 'customer') {
      router.replace('/');
    }
  }, [auth, authLoading, router, user]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (auth) {
    return null;
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center">
        <div className="relative flex items-center justify-center min-h-screen w-full -z-10 login-page"></div>
        <div className="absolute z-50">
          <LoginForm />
        </div>
      </div>
    );
  }
};

export default GirisPage;
