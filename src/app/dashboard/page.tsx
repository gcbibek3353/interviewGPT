import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId } from '@/lib/actions/general.action';
import React from 'react'

const Dashboard = async () => {
  // const user = await getCurrentUser();
  // const userInterviews = await getInterviewsByUserId(user?.id as string);
  const userInterviews = await getInterviewsByUserId("MmiFJpaCSBhlxox0zFJOjsxmdPf1");

  const hasPastInterviews = userInterviews && userInterviews.length > 0;

  return (
    <div>
      <h2>Your Interviews</h2>
      <div>
        {
          hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            )))
            :<p>No Interviews yet</p>
          }
      </div>
    </div>
  )
}

export default Dashboard