'use client'
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewAndUserId } from '@/lib/actions/general.action';
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { jsPDF } from 'jspdf'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  const getFeedback = async (userId: string) => {
    try {
      setLoading(true);
      const curfeedback = await getFeedbackByInterviewAndUserId({
        interviewId: id!,
        userId: userId
      });
      setFeedback(curfeedback);
    } catch (err) {
      setError('Failed to load feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const curUser = await getCurrentUser();
        if (!curUser) {
          throw new Error('User not authenticated');
        }
        setUser(curUser);
        await getFeedback(curUser.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setLoading(false);
      }
    };

    initialize();
  }, [id]);

  const downloadPdf = () => {
    if (!feedback) return;

    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const ensureSpace = (lineHeight: number) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }
    };

    const write = (
      text: string,
      { size = 11, style = 'normal', gap = 2 }: { size?: number; style?: 'normal' | 'bold'; gap?: number } = {}
    ) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      const lineHeight = size * 0.5;
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        ensureSpace(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += gap;
    };

    write('Interview Feedback', { size: 20, style: 'bold', gap: 4 });
    write(`Interview ID: ${feedback.interviewId}`, { size: 10 });
    write(`Overall Score: ${feedback.totalScore}/100`, { size: 12, style: 'bold', gap: 6 });

    write('Category Breakdown', { size: 14, style: 'bold' });
    feedback.categoryScores.forEach((category) => {
      write(`${category.name} - ${category.score}/100`, { size: 11, style: 'bold', gap: 1 });
      write(category.comment, { size: 10, gap: 3 });
    });

    write('Key Strengths', { size: 14, style: 'bold' });
    feedback.strengths.forEach((s) => write(`- ${s}`, { size: 10, gap: 1 }));
    y += 3;

    write('Areas for Improvement', { size: 14, style: 'bold' });
    feedback.areasForImprovement.forEach((a) => write(`- ${a}`, { size: 10, gap: 1 }));
    y += 3;

    write('Final Assessment', { size: 14, style: 'bold' });
    write(feedback.finalAssessment, { size: 10 });

    doc.save(`interview-feedback-${feedback.interviewId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#cac5fe]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-[#f75353]/10 border border-[#f75353]/30 text-[#f75353] px-4 py-3 rounded-lg max-w-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white/[0.02] border border-white/10 text-[#c9c6de] px-4 py-3 rounded-lg max-w-md">
          <p className="text-[#c9c6de]">No feedback found for this interview</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto my-8 md:my-12 p-6 bg-white/[0.02] rounded-2xl border border-white/10">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#ece9ff] transition hover:border-white/20 hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] font-semibold tracking-tight text-[#ece9ff] mb-2">
              Interview Feedback
            </h1>
            <p className="text-[#a9a6c4]">
              Interview ID: <span className="font-mono">{feedback.interviewId}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[#c9c6de]">
              Overall Score:
              <span className={`ml-2 text-2xl ${feedback.totalScore >= 80 ? 'text-[#49de50]' :
                  feedback.totalScore >= 60 ? 'text-[#cac5fe]' :
                    'text-[#f75353]'
                }`}>
                {feedback.totalScore}/100
              </span>
            </div>
            <p className="text-sm text-[#7d7a99] mt-1">
              {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : ''}
            </p>
            <button
              onClick={downloadPdf}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] px-6 py-3 text-sm font-semibold text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="mb-8">
        <h2 className="text-xl font-[family-name:var(--font-display)] font-semibold tracking-tight text-[#ece9ff] mb-4 pb-2 border-b border-white/10">
          Category Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.categoryScores.map((category, index) => (
            <div key={index} className="bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-[#ece9ff]">{category.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.score >= 80 ? 'bg-[#49de50]/10 text-[#49de50]' :
                    category.score >= 60 ? 'bg-[#cac5fe]/10 text-[#cac5fe]' :
                      'bg-[#f75353]/10 text-[#f75353]'
                  }`}>
                  {category.score}/100
                </span>
              </div>
              <p className="text-sm text-[#a9a6c4]">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-[#49de50]/30">
          <h2 className="text-lg font-semibold text-[#49de50] mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Strengths
          </h2>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-2 text-[#49de50]">
                  •
                </span>
                <span className="text-[#c9c6de]">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-[#cac5fe]/30">
          <h2 className="text-lg font-semibold text-[#cac5fe] mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Areas for Improvement
          </h2>
          <ul className="space-y-2">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-2 text-[#cac5fe]">
                  •
                </span>
                <span className="text-[#c9c6de]">
                  {area}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10">
        <h2 className="text-lg font-[family-name:var(--font-display)] font-semibold tracking-tight text-[#ece9ff] mb-3">
          Final Assessment
        </h2>
        <p className="text-[#c9c6de] whitespace-pre-line">
          {feedback.finalAssessment}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-[#7d7a99]">
        <p>Feedback ID: {feedback.id}</p>
      </div>
    </div>
  );
}

export default page