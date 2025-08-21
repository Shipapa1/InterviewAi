
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between mb-6">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={interview.coverImage || getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <div className="flex flex-row gap-3">
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.type}
          </p>
          
          {feedback && (
            <Button asChild className="btn-primary">
              <Link href={`/interview/${id}/feedback`}>
                View Feedback
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetails;