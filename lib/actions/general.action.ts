import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export async function getInterviewByUserId(userId: string): Promise<Interview[]> {
    if (!userId) {
        return [];
    }

    const interviewsSnapshot = await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}


export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[]> {
    const { userId, limit = 20} = params; 


    const interviewsSnapshot = await db
        .collection('interviews')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return interviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interviewDoc = await db
        .collection('interviews')
        .doc(id)
        .get();

    if (!interviewDoc.exists) return null;
    return { id: interviewDoc.id, ...interviewDoc.data() } as Interview;
}


export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId } = params;
  if (!interviewId) return null;

  const snapshot = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Feedback;
}