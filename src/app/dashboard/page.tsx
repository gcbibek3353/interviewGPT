'use client'
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  // const user = await getCurrentUser();
  const [user,setUser] = useState<User | null>(null);
  const [userInterviews,setUserInterviews] = useState<Interview[] | null>(null);
  const [hasPastInterviews,setHasPastInterviews] = useState<boolean>(false);
  const [latestInterviews,setLatestInterviews] = useState<Interview[] | null>(null);
  const [hasUpcomingInterviews,setHasUpcomintInterviews] = useState<boolean>(false);

  const getUser = async () => {
    const curUser : User | null = await getCurrentUser();
    console.log(curUser);
    setUser(curUser);
  }

  const fetchUserInterviews = async () => {
    try {
      // const userInterviews = await getInterviewsByUserId(user?.id as string);
      const curuserInterviews = await getInterviewsByUserId("MmiFJpaCSBhlxox0zFJOjsxmdPf1");
      setUserInterviews(curuserInterviews);
      const curhasPastInterviews = curuserInterviews?.length! > 0;
      
      setHasPastInterviews(curhasPastInterviews);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchLatestInterviews = async () => {
    try {
      // const userInterviews = await getInterviewsByUserId(user?.id as string);
      const curLatestInterviews = await getLatestInterviews({userId :"MmiFJpaCSBhlxox0zFJOjsxmdPf1",interviewLimit : 10});
      // console.log(curLatestInterviews);
      
      setLatestInterviews(curLatestInterviews);
      const curhasUpcomingInterviews = curLatestInterviews?.length! > 0;
      // console.log(curhasUpcomingInterviews);
      
      setHasUpcomintInterviews(curhasUpcomingInterviews);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getUser();
    fetchUserInterviews();
    fetchLatestInterviews();
  },[])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-white">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Your Interviews
        </h2>
        {hasPastInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">No Interviews yet</p>
            <p className="mt-2 text-gray-500">Your completed interviews will appear here</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Take an Interview
        </h2>
        {hasUpcomingInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">No Upcoming Interviews...</p>
            <p className="mt-2 text-gray-500">Check back later for new interview opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard