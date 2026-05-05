// Takes all the user's subjects from MongoDB, sends them to Gemini AI
// and asks it to generate a personalized day-by-day study schedule.
// Returns the AI generated plan as text.

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import model from "@/lib/gemini";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const subjects = await Subject.find({ userId: session.user.email });

    if (subjects.length === 0) {
        return Response.json({ error: "No subjects found" }, { status: 400 });
    }

    // Build a prompt for Gemini
    const subjectList = subjects.map(s => {
        return `Subject: ${s.name}, Exam Date: ${new Date(s.examDate).toDateString()}, Study Hours Per Day: ${s.studyHoursPerDay}, Topics: ${s.topics.map(t => t.name).join(", ")}`;
    }).join("\n");

    const prompt = `
        You are a smart study planner assistant.
        A student has the following subjects and exam dates:
        ${subjectList}

        Today's date is ${new Date().toDateString()}.
        
        Create a detailed day-by-day study schedule from today until the last exam.
        For each day, allocate study sessions based on the available hours per day.
        Prioritize subjects with closer exam dates.
        Make it realistic and balanced.
        Format it clearly with dates and time slots.
    `;

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    return Response.json({ plan });
}