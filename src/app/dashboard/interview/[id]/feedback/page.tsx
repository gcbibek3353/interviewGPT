'use client'
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewAndUserId } from '@/lib/actions/general.action';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id;

  const getFeedback = async (userId: string) => {
    try {
      setLoading(true);
      const curfeedback = await getFeedbackByInterviewAndUserId({
        interviewId: id!,
        userId: userId
      });
      setFeedback(curfeedback);
    } catch (err) {
      setError('Failed to load feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const curUser = await getCurrentUser();
        if (!curUser) {
          throw new Error('User not authenticated');
        }
        setUser(curUser);
        await getFeedback(curUser.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setLoading(false);
      }
    };

    initialize();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded max-w-md">
          <p className='bg-slate-100 text-slate-900'>No feedback found for this interview</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Interview Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Interview ID: <span className="font-mono">{feedback.interviewId}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Overall Score:
              <span className={`ml-2 text-2xl ${feedback.totalScore >= 80 ? 'text-green-600 dark:text-green-400' :
                  feedback.totalScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
                    'text-red-600 dark:text-red-400'
                }`}>
                {feedback.totalScore}/100
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {/* {formattedDate} */} {"20-12-2004"}
            </p>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          Category Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.categoryScores.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{category.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${category.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    category.score >= 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {category.score}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-green-100 dark:border-green-900/50">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Strengths
          </h2>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-2 text-green-500">
                  •
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900/50">
          <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Areas for Improvement
          </h2>
          <ul className="space-y-2">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-2 text-blue-500">
                  •
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {area}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Final Assessment
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {feedback.finalAssessment}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>Feedback ID: {feedback.id}</p>
      </div>
    </div>
  );
}

export default page