import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
    try {
        const { interviewId, userId } = await request.json();
        if (!userId) {
            return Response.json({ success: false, error: 'Missing userId' }, { status: 400 });
        }

        if (interviewId) {
            const ref = db.collection('interviews').doc(interviewId);
            const snapshot = await ref.get();
            if (!snapshot.exists) {
                return Response.json({ success: false, error: 'Interview not found' }, { status: 404 });
            }
            await ref.set({ startedAt: new Date().toISOString(), userId }, { merge: true });
            return Response.json({ success: true, interviewId }, { status: 200 });
        }

        // Create a new in-progress interview if none provided
        const createdAt = new Date().toISOString();
        const newInterview = {
            userId,
            createdAt,
            startedAt: createdAt,
            finalized: false,
            type: 'Mixed',
            role: 'Interview',
            level: 'N/A',
            techstack: [],
            questions: [],
            coverImage: getRandomInterviewCover(),
        } as Partial<Interview>;

        const ref = await db.collection('interviews').add(newInterview);
        return Response.json({ success: true, interviewId: ref.id }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}


