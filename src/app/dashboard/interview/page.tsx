import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  // console.log(user);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Interview Generation
            </h3>
            <p className="text-gray-400 mt-1">
              Create personalized interview experiences powered by AI
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-gray-300 text-sm">Welcome,</span>
            <span className="font-medium text-purple-300 truncate max-w-[120px] sm:max-w-[200px]">
              {user?.name}
            </span>
          </div>
        </div>


        <Agent
          userName={user?.name as string}
          userId={user?.id}
          type="generate"
        />


        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact our <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">support team</a></p>
        </div>
      </div>
    </div>
  )

}

export default page