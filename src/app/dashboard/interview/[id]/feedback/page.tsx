'use client'
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewAndUserId } from '@/lib/actions/general.action';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const params = useParams();
  const id = params.id;

  const getUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    return user;
  }

  const getFeedback = async () => {
    const curfeedback = await getFeedbackByInterviewAndUserId({ interviewId: id, userId: user?.id! });
    console.log(curfeedback);
    setFeedback(feedback);
  }

  useEffect(() => {
    getUser();
    getFeedback();
  }, [])

  return (
    <div>feedback</div>
  )
}

export default page