import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const subjects = await Subject.find({ userId: session.user.email });
        return Response.json(subjects);

    } catch (error) {
        console.error("GET ERROR:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
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

    } catch (error) {
        console.error("POST ERROR:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const { id } = await req.json();

        await Subject.findOneAndDelete({ _id: id, userId: session.user.email });
        return Response.json({ success: true });

    } catch (error) {
        console.error("DELETE ERROR:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}