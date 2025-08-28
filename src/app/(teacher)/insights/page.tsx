import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Bot, RefreshCw, AlertTriangle, Activity, Target, BookOpen, MessageCircle } from 'lucide-react';
const insightsData = [{
  title: 'Misconception Patterns',
  subtitle: 'Class-level red flags',
  icon: AlertTriangle,
  color: 'text-red-500',
  items: [{
    text: '"65% of Year 8s think APR and interest rate are the same."',
    actionText: 'Suggest recap: \'Phone Plans & Subscriptions\''
  }, {
    text: '"Half the class mis-identified NI as income tax."',
    actionText: 'Assign: Payslip Basics mini-lesson'
  }]
}, {
  title: 'Engagement Insights',
  icon: Activity,
  color: 'text-blue-500',
  items: [{
    text: '"Mark has logged in daily (5-day streak). James has been inactive for 4 days."',
    actionText: 'Nudge James'
  }, {
    text: '"Class completion rate dropped mid-week."',
    actionText: 'Suggest shorter episodes'
  }]
}, {
  title: 'Concept Mastery Gaps',
  icon: Target,
  color: 'text-amber-600',
  items: [{
    text: '"Strong on Budgeting and Needs vs Wants, but weak on Compound Interest (average 40% correct)."',
    actionText: null
  }, {
    text: '"Inflation mastered by Year 9, but Year 10 cohort shows mixed understanding."',
    actionText: null
  }]
}, {
  title: 'Reading / Level Adaptation',
  icon: BookOpen,
  color: 'text-teal-500',
  items: [{
    text: '"Three students repeatedly request simpler definitions."',
    actionText: 'Enable low-reading mode'
  }, {
    text: '"Advanced group (top 20%) ready for enrichment."',
    actionText: 'Assign: Investing & Diversification'
  }]
}, {
  title: 'Sentiment & Question Themes',
  subtitle: 'From Mentor chats',
  icon: MessageCircle,
  color: 'text-indigo-500',
  items: [{
    text: '"Frequent student queries: \'Why save early?\' → indicates curiosity about compound growth."',
    actionText: null
  }, {
    text: '"Multiple questions flagged as \'too personal\' — students asking about family bills."',
    actionText: 'Remind class about scope'
  }]
}];
const InsightItem: React.FC<{
  text: string;
  actionText: string | null;
}> = ({
  text,
  actionText
}) => <div className="flex items-center justify-between gap-4 py-3">
    <p className="body text-subtext leading-relaxed">{text}</p>
    {actionText && <Button variant="outline" size="sm" className="whitespace-nowrap flex-shrink-0">
        {actionText}
      </Button>}
  </div>;
const InsightCategory: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  items: {
    text: string;
    actionText: string | null;
  }[];
}> = ({
  title,
  subtitle,
  icon: Icon,
  color,
  items
}) => <div className="pt-2">
    <div className="flex items-center gap-3">
      <Icon size={24} className={color} />
      <div>
        <h3 className="h3">{title}</h3>
        {subtitle && <p className="small">{subtitle}</p>}
      </div>
    </div>
    <div className="pl-10 divide-y divide-muted border-l border-muted ml-3 mt-2">
      {items.map((item, index) => <div key={index} className="pl-6">
          <InsightItem {...item} />
        </div>)}
    </div>
  </div>;
const TeacherInsights: React.FC = () => {
  return <div>
      

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="h2">AI-Generated Teacher Briefing</h2>
            <p className="small mt-1">Key patterns and opportunities from the last 7 days.</p>
          </div>
        </div>

        <div className="space-y-8">
          {insightsData.map((category, index) => <InsightCategory key={index} {...category} />)}
        </div>
      </Card>
    </div>;
};
export default TeacherInsights;