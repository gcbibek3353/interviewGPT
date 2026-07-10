import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  // console.log(user);


  return (
    <div className="min-h-screen bg-[#08070d] p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-tight text-[#cac5fe]">
              Interview Generation
            </h3>
            <p className="text-[#a9a6c4] mt-1">
              Create personalized interview experiences powered by AI
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#cac5fe]/20 bg-[#cac5fe]/10 px-4 py-2">
            <span className="text-[#a9a6c4] text-sm">Welcome,</span>
            <span className="font-medium text-[#cac5fe] truncate max-w-[120px] sm:max-w-[200px]">
              {user?.name}
            </span>
          </div>
        </div>


        <Agent
          userName={user?.name as string}
          userId={user?.id}
          type="generate"
        />


        <div className="mt-8 text-center text-[#7d7a99] text-sm">
          <p>Need help? Contact our <a href="#" className="text-[#cac5fe] hover:brightness-110 transition">support team</a></p>
        </div>
      </div>
    </div>
  )

}

export default page