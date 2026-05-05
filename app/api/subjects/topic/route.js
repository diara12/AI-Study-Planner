// Handles PATCH request to toggle a topic's completed status

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { subjectId, topicIndex, completed } = await req.json();

        const subject = await Subject.findOne({ _id: subjectId, userId: session.user.email });
        subject.topics[topicIndex].completed = completed;
        await subject.save();

        return Response.json({ success: true });

    } catch (error) {
        console.error("PATCH ERROR:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}