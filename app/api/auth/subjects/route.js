// Handles GET (fetch all subjects) and POST (add new subject) 
// for the logged in user. Connects to MongoDB and returns data as JSON.

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const subjects = await Subject.find({ userId: session.user.email });
    return Response.json(subjects);
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const subject = await Subject.create({
        userId: session.user.email,
        name: body.name,
        examDate: body.examDate,
        studyHoursPerDay: body.studyHoursPerDay,
        topics: body.topics
    });

    return Response.json(subject);
}