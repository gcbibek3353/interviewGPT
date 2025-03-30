import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  // console.log(user);
  

  return (
    <div>
        <h3>Interview Generation </h3>

        {/* <Agent userName={user?.name as string} userId={user?.id} type="generate" /> */}
        <Agent userName={"Bivek"} userId={"MmiFJpaCSBhlxox0zFJOjsxmdPf1"} type="generate" />
    </div>
  )
}

export default page