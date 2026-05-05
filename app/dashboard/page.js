// The main dashboard page where users can:
// 1. Add new subjects with exam dates and topics
// 2. Generate an AI study plan from their subjects
// 3. View the generated plan
// 4. Mark topics as completed
// 5. Sign out

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [subjects, setSubjects] = useState([]);
    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        examDate: "",
        studyHoursPerDay: "",
        topics: ""
    });

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
        if (session) fetchSubjects();
    }, [session, status]);

    async function fetchSubjects() {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        setSubjects(data);
    }

    async function addSubject() {
        if (!form.name || !form.examDate || !form.studyHoursPerDay) return;

        const topics = form.topics
            .split(",")
            .map(t => ({ name: t.trim(), completed: false }))
            .filter(t => t.name);

        await fetch("/api/subjects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, topics })
        });

        setForm({ name: "", examDate: "", studyHoursPerDay: "", topics: "" });
        fetchSubjects();
    }

    async function deleteSubject(id) {
        await fetch("/api/subjects", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchSubjects();
    }

    async function toggleTopic(subjectId, topicIndex, currentStatus) {
        await fetch("/api/subjects/topic", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectId, topicIndex, completed: !currentStatus })
        });
        fetchSubjects();
    }

    async function generatePlan() {
        setLoading(true);
        setPlan("");
        const res = await fetch("/api/generate-plan", { method: "POST" });
        const data = await res.json();
        setPlan(data.plan);
        setLoading(false);
    }

    function formatPlan(planText) {
        const lines = planText.split("\n").filter(l => l.trim());
        return lines.map((line, i) => {
            if (line.startsWith("###")) {
                return <h3 key={i} className="text-lg font-bold text-indigo-700 mt-6 mb-3">{line.replace(/###/g, "").trim()}</h3>;
            }
            if (line.startsWith("####")) {
                return <h4 key={i} className="text-base font-bold text-purple-600 mt-5 mb-2 bg-purple-50 px-3 py-2 rounded-lg">{line.replace(/####/g, "").trim()}</h4>;
            }
            if (line.includes("**Exam Day")) {
                return <p key={i} className="font-bold text-red-500 mt-2">🎯 {line.replace(/\*\*/g, "").trim()}</p>;
            }
            if (line.trim().startsWith("-")) {
                return <p key={i} className="text-gray-600 text-sm pl-4 py-1 border-l-2 border-indigo-200 ml-2 mb-1">⏰ {line.replace("-", "").trim()}</p>;
            }
            if (/^\d+\./.test(line.trim())) {
                return <p key={i} className="text-gray-600 text-sm pl-4 mb-1">📌 {line.trim()}</p>;
            }
            if (line.trim()) {
                return <p key={i} className="text-gray-500 text-sm mb-2">{line.trim()}</p>;
            }
            return null;
        });
    }

    if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-600">📚 Study Planner</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600 text-sm">Hi, {session?.user?.name}!</p>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Add Subject Form */}
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">➕ Add Subject</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Subject Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Maths"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Exam Date</label>
                            <input
                                type="date"
                                value={form.examDate}
                                onChange={e => setForm({ ...form, examDate: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Study Hours Per Day</label>
                            <input
                                type="number"
                                placeholder="e.g. 3"
                                value={form.studyHoursPerDay}
                                onChange={e => setForm({ ...form, studyHoursPerDay: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Topics (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. Calculus, Trigonometry"
                                value={form.topics}
                                onChange={e => setForm({ ...form, topics: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                    </div>
                    <button
                        onClick={addSubject}
                        className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition w-full"
                    >
                        Add Subject
                    </button>
                </div>

                {/* Subjects List */}
                {subjects.length > 0 && (
                    <div className="bg-white rounded-2xl shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">📖 My Subjects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subjects.map(subject => (
                                <div key={subject._id} className="border border-gray-100 rounded-xl p-4">
                                    
                                    {/* Subject Header */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-indigo-600 text-lg">{subject.name}</h3>
                                        <button
                                            onClick={() => deleteSubject(subject._id)}
                                            className="text-red-400 hover:text-red-600 text-sm transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>

                                    <p className="text-gray-500 text-sm">📅 Exam: {new Date(subject.examDate).toDateString()}</p>
                                    <p className="text-gray-500 text-sm mb-3">⏱️ Study hours/day: {subject.studyHoursPerDay}hrs</p>

                                    {/* Topics - clickable to mark complete */}
                                    <div className="flex flex-wrap gap-2">
                                        {subject.topics.map((topic, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleTopic(subject._id, i, topic.completed)}
                                                className={`text-xs px-3 py-1 rounded-full transition cursor-pointer ${topic.completed
                                                    ? "bg-green-100 text-green-600 line-through"
                                                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                                            >
                                                {topic.completed ? "✅" : "📌"} {topic.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{subject.topics.filter(t => t.completed).length}/{subject.topics.length} topics</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-500 h-2 rounded-full transition-all"
                                                style={{ width: `${subject.topics.length > 0 ? (subject.topics.filter(t => t.completed).length / subject.topics.length) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <button
                            onClick={generatePlan}
                            disabled={loading}
                            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                        >
                            {loading ? "⏳ Generating your plan..." : "✨ Generate AI Study Plan"}
                        </button>
                    </div>
                )}

                {/* AI Generated Plan */}
                {plan && (
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">🗓️ Your AI Study Plan</h2>
                        <div className="leading-relaxed">
                            {formatPlan(plan)}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}