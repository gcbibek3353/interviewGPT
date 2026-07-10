import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    redirect('/sign-in')
  }
  return (
    <div className="min-h-screen bg-[#08070d] text-[#ece9ff]">{children}</div>
  )
}

export default DashboardLayout