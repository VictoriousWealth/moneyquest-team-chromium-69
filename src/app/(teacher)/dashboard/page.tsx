import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { progressSummaryData } from '../../../lib/demoData';
import { Flame, Target, BookOpen, TrendingUp, Users, AlertTriangle, Activity, MessageCircle, ArrowRight } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const newInsightsData = [
    {
      title: 'Misconception Patterns',
      icon: AlertTriangle,
      color: 'text-red-500',
      items: [
        "65% of Year 8s think APR and interest rate are the same. Suggest recap: 'Phone Plans & Subscriptions.'",
        "Half the class mis-identified NI as income tax. Assign: Payslip Basics mini-lesson."
      ]
    },
    {
      title: 'Engagement Insights',
      icon: Activity,
      color: 'text-blue-500',
      items: [
        "Mark has logged in daily (5-day streak). James has been inactive for 4 days — consider nudging.",
        "Class completion rate dropped mid-week. Suggest shorter episodes or in-class recap."
      ]
    },
    {
      title: 'Concept Mastery Gaps',
      icon: Target,
      color: 'text-amber-600',
      items: [
        "Strong on Budgeting and Needs vs Wants, but weak on Compound Interest (average 40% correct).",
        "Inflation mastered by Year 9, but Year 10 cohort shows mixed understanding."
      ]
    },
    {
      title: 'Reading / Level Adaptation',
      icon: BookOpen,
      color: 'text-teal-500',
      items: [
        "Three students repeatedly request simpler definitions. Suggest enabling low-reading mode for Aisha, Sophia, James.",
        "Advanced group (top 20%) ready for enrichment: Investing & Diversification."
      ]
    },
    {
      title: 'Sentiment & Question Themes',
      icon: MessageCircle,
      color: 'text-indigo-500',
      items: [
        "Frequent student queries: 'Why save early?' → indicates curiosity about compound growth.",
        "Multiple questions flagged as 'too personal' — students asking about family bills. Consider reminding class about scope."
      ]
    }
  ];

  const highLevelProgress = [
    {
      icon: TrendingUp,
      title: 'Class Momentum',
      summary: 'Momentum is strong with quiz scores trending upwards.',
      action: 'Introduce a challenge topic to maintain engagement.',
      iconColor: 'text-mint-400',
    },
    {
      icon: Target,
      title: 'Primary Concept Gap',
      summary: 'A concept gap is forming around "Interest Calculation".',
      action: 'Use a micro-lesson to review the topic.',
      iconColor: 'text-amber-600',
    },
    {
      icon: Users,
      title: 'Engagement Level',
      summary: 'Engagement is high, but a few students are becoming less active.',
      action: 'Check in with less active students individually.',
      iconColor: 'text-blue-500',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="h1">Class Dashboard</h1>
          <p className="small mt-1">Overview of Year 9 Financial Literacy, Period 3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-blue-500" />
            <span className="font-semibold">Total Students</span>
          </div>
          <p className="text-2xl font-bold">24</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-green-500" />
            <span className="font-semibold">Quests / Lessons</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={24} className="text-orange-500" />
            <span className="font-semibold">Active Today</span>
          </div>
          <p className="text-2xl font-bold">19</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="h2">AI-Generated Summary</h2>
            <Link to="/teacher/insights" className="flex items-center gap-2 text-blue-500 hover:underline text-sm">
              <span>View Full Report</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {newInsightsData.slice(0, 3).map(({ title, icon: Icon, color, items }) => (
              <div key={title}>
                <h4 className={`flex items-center gap-2 font-semibold text-sm mb-2 ${color}`}>
                  <Icon size={16} />
                  <span>{title}</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                  {items.slice(0, 1).map((item, index) => (
                    <li key={index} className="text-subtext">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="h2 mb-4">Progress Snapshot</h2>
          <div className="space-y-4">
            {highLevelProgress.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 ${item.iconColor}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-text">{item.title}</h4>
                  <p className="text-sm text-subtext leading-snug">
                    {item.summary}
                  </p>
                  <p className="text-sm text-subtext leading-snug mt-1">
                    <strong className="font-semibold text-text/90">Next Step:</strong>{' '}
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;