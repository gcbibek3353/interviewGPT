'use client'
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser, signOut } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews, getUserFeedbacks } from '@/lib/actions/general.action';
import { auth as clientAuth } from '@/firebase/client';
import { signOut as firebaseSignOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[] | null>(null);
  const [hasPastInterviews, setHasPastInterviews] = useState<boolean>(false);
  const [latestInterviews, setLatestInterviews] = useState<Interview[] | null>(null);
  const [hasUpcomingInterviews, setHasUpcomintInterviews] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackWithInterview[] | null>(null);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 6;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // Clear the client Firebase Auth session and the server session cookie.
      await firebaseSignOut(clientAuth).catch(() => { });
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.log('Error logging out', error);
      setLoggingOut(false);
    }
  }

  const getUser = async () => {
    const curUser: User | null = await getCurrentUser();
    // console.log(curUser);
    setUser(curUser);
  }


  const fetchUserInterviews = async () => {
    try {
      const curuserInterviews = await getInterviewsByUserId(user?.id as string);
      // const curuserInterviews = await getInterviewsByUserId("MmiFJpaCSBhlxox0zFJOjsxmdPf1");
      setUserInterviews(curuserInterviews);
      console.log(curuserInterviews);

      const curhasPastInterviews = curuserInterviews?.length! > 0;
      console.log(curhasPastInterviews);

      setHasPastInterviews(curhasPastInterviews);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchLatestInterviews = async () => {
    try {
      // console.log(user);
      const curLatestInterviews = await getLatestInterviews({ userId: user?.id as string, interviewLimit: 50 })

      setLatestInterviews(curLatestInterviews);
      setCurrentPage(1);
      const curhasUpcomingInterviews = curLatestInterviews?.length! > 0;

      setHasUpcomintInterviews(curhasUpcomingInterviews);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const userFeedbacks = await getUserFeedbacks(user?.id as string);
      setFeedbacks(userFeedbacks);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user?.id) { // Only fetch if user exists and has an id
      fetchUserInterviews();
      fetchLatestInterviews();
      fetchFeedbacks();
    }
  }, [user]); // Run when user changes

  // Client-side pagination for the "Available Interviews" list.
  const totalAvailable = latestInterviews?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalAvailable / PAGE_SIZE));
  const paginatedInterviews = latestInterviews?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  ) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href={'/dashboard/interview'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Interview
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center px-4 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Your Interviews Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-400 flex items-center">
            <span className="mr-3 p-2 bg-purple-900/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Your Interviews
          </h2>
          {hasPastInterviews && (
            <span className="text-sm text-gray-400">
              {userInterviews?.length} {userInterviews?.length === 1 ? 'interview' : 'interviews'}
            </span>
          )}
        </div>

        {hasPastInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border-2 border-dashed border-gray-700 hover:border-purple-400/50 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-300">No interviews yet</p>
            <p className="mt-2 text-gray-500">Your completed interviews will appear here</p>
            <Link
              href={'/dashboard/interview'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-400 hover:text-purple-300"
            >
              Start your first interview →
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Interviews Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 hover:border-green-500/30 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-400 flex items-center">
            <span className="mr-3 p-2 bg-green-900/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Available Interviews
          </h2>
          {hasUpcomingInterviews && (
            <span className="text-sm text-gray-400">
              {latestInterviews?.length} available
            </span>
          )}
        </div>

        {hasUpcomingInterviews ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedInterviews.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-2 rounded-md text-sm font-medium border transition-colors ${pageNum === currentPage
                      ? 'bg-green-600 text-white border-green-600'
                      : 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border-2 border-dashed border-gray-700 hover:border-green-400/50 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-300">No interviews available</p>
            <p className="mt-2 text-gray-500">Check back later for new opportunities</p>
            <button
              onClick={() => {/* Add refresh logic */ }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-400 hover:text-green-300"
            >
              Refresh listings
            </button>
          </div>
        )}
      </div>

      {/* Previous Interview Feedbacks Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center">
            <span className="mr-3 p-2 bg-blue-900/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Previous Interview Feedbacks
          </h2>
          {feedbacks && feedbacks.length > 0 && (
            <span className="text-sm text-gray-400">
              {feedbacks.length} {feedbacks.length === 1 ? 'feedback' : 'feedbacks'}
            </span>
          )}
        </div>

        {feedbacks && feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback) => (
              <Link
                key={feedback.id}
                href={`/dashboard/interview/${feedback.interviewId}/feedback`}
                className="block bg-gray-800/60 rounded-lg p-5 border border-gray-700 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {feedback.interview?.role ?? 'Interview'}
                    </h3>
                    {feedback.interview?.type && (
                      <span className="text-xs text-gray-400 capitalize">{feedback.interview.type}</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${feedback.totalScore >= 80 ? 'bg-green-900/30 text-green-400' :
                    feedback.totalScore >= 60 ? 'bg-blue-900/30 text-blue-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                    {feedback.totalScore}/100
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {feedback.finalAssessment}
                </p>
                <p className="mt-4 text-sm font-medium text-blue-400">
                  View full feedback →
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border-2 border-dashed border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-300">No feedbacks yet</p>
            <p className="mt-2 text-gray-500">Complete an interview to receive AI feedback</p>
          </div>
        )}
      </div>

      {/* Stats Section (Bonus) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:bg-gray-800/50 transition-colors duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-900/20 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{userInterviews?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:bg-gray-800/50 transition-colors duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-900/20 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Available</p>
              <p className="text-2xl font-bold text-white">{latestInterviews?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:bg-gray-800/50 transition-colors duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-900/20 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-white">4.8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard