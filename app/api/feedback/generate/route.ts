import { createFeedback } from "@/lib/actions/general.action";

export async function POST(request: Request) {
  try {
    const { interviewId, userId, transcript } = await request.json();
    
    if (!interviewId || !userId || !transcript) {
      return Response.json(
        { success: false, error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const result = await createFeedback({
      interviewId,
      userId,
      transcript,
    });

    if (result.success) {
      return Response.json(
        { success: true, feedbackId: result.feedbackId }, 
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, error: 'Failed to create feedback' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    return Response.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
