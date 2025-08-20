
import React from 'react' ;
import Agent from '@/components/Agent' ;
import { getCurrentUser, getLatestInterviews } from '@/lib/actions/auth.action';


const Page = async () => {

  const user = await getCurrentUser();
  const latest = user?.id ? await getLatestInterviews({ userId: user.id, limit: 1 }) : [];
  const latestInterview = latest?.[0];
  const questions = latestInterview?.questions || [];

  return (
    <>

        <h3>Interview Generation</h3>

        <Agent userName={user?.name!} userId={user?.id} type="generate" questions={questions} interviewId={latestInterview?.id} />

    </>
  )
}

export default Page