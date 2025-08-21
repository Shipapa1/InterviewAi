import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <section className="section-feedback">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold">
            No Feedback Available
          </h1>
          <p className="text-lg text-gray-600">
            This interview doesn't have feedback yet. Complete the interview to receive AI-generated feedback.
          </p>
          <div className="flex flex-row gap-4">
            <Button asChild className="btn-secondary">
              <Link href="/">
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href={`/interview/${id}`}>
                Take Interview
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center mb-8">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="mb-6" />

      {/* Final Assessment */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Final Assessment</h2>
        <p className="text-lg leading-relaxed">{feedback.finalAssessment}</p>
      </div>

      {/* Interview Breakdown */}
<div className="flex flex-col gap-6 mb-8">
  <h2 className="text-2xl font-semibold">Category Breakdown</h2>
  {feedback.categoryScores?.map((category, index) => (
    <div key={index} className="bg-light-100 p-4 rounded-lg">
      <div className="flex flex-row justify-between items-center mb-2">
        {/* Category Name (black) */}
        <h3 className="font-bold text-lg text-black">{category.name}</h3>

        {/* Score (/100 in green) */}
        <span className="text-green-600 font-bold text-xl">
          {category.score}/100
        </span>
      </div>
      <p className="text-gray-700">{category.comment}</p>
    </div>
  ))}
</div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-green-600">Strengths</h3>
          <ul className="list-disc list-inside space-y-2">
            {feedback.strengths?.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-orange-600">Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-2">
            {feedback.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center">
        <Button asChild className="btn-secondary flex-1 max-w-xs">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to Dashboard
            </p>
          </Link>
        </Button>

        <Button asChild className="btn-primary flex-1 max-w-xs">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;