'use client'
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Interview = () => {
    const [interview, setInterview] = useState<Interview | null>(null);
    const [user,setUser] = useState<User | null>(null);
    const params = useParams();
    const id = params.id;

    const getUser = async () => {
        const user = await getCurrentUser();
        setUser(user);
    }

    const fetchInterview = async () => {
        const res = await getInterviewById(id);
        setInterview(res)
    }

    useEffect(() => {
        fetchInterview();
        getUser();
    }, [])

    // const interview = await getInterviewById(id);

    // if(!interview) redirect('/dashboard');

    return (
        <div>
            <div>

                <h2>{interview?.role} Interview </h2>
                <p>
                    {
                        interview?.techstack.map((stack,index) => <span key={index}>
                            {stack}
                        </span>)
                    }
                </p>
                <p>{interview?.type}</p>
            </div>
            {/* <Agent userName={user?.name} type="interview" interviewId={id} questions={interview?.questions} /> */}
            <Agent userName="Rajesh Hamal" userId={"MmiFJpaCSBhlxox0zFJOjsxmdPf1"} type="interview" interviewId={id} questions={interview?.questions} />
        </div>
    )
}

export default Interview