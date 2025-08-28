import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Loader2, Brain, CheckCircle, XCircle, Lightbulb, Target } from "lucide-react";
import { toast } from "sonner";

interface AIReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questId: string;
  questTitle: string;
}

interface QuestResponse {
  id: string;
  round_number: number;
  question_text: string;
  selected_option: string;
  correct_answer: string;
  is_correct: boolean;
  score_earned: number;
}

interface AIReview {
  overallPerformance: string;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  encouragement: string;
  nextSteps: string[];
}

export const AIReviewDialog = ({ isOpen, onClose, questId, questTitle }: AIReviewDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questResponses, setQuestResponses] = useState<QuestResponse[]>([]);
  const [aiReview, setAIReview] = useState<AIReview | null>(null);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQuestResponses();
    }
  }, [isOpen, questId]);

  const loadQuestResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('quest_responses')
        .select('*')
        .eq('quest_id', questId)
        .order('round_number', { ascending: true });

      if (error) throw error;

      setQuestResponses(data || []);
    } catch (error) {
      console.error('Error loading quest responses:', error);
      toast.error("Failed to load your quest responses");
    }
  };

  const generateAIReview = async () => {
    if (questResponses.length === 0) {
      toast.error("No responses found for this quest");
      return;
    }

    setIsLoading(true);
    setAIReview(null);
    setShowTypewriter(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-review', {
        body: { 
          questId,
          questTitle,
          responses: questResponses 
        }
      });

      if (error) throw error;

      setAIReview(data.review);
      setTimeout(() => setShowTypewriter(true), 500);
    } catch (error) {
      console.error('Error generating AI review:', error);
      toast.error("Failed to generate AI review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const correctAnswers = questResponses.filter(r => r.is_correct).length;
  const totalQuestions = questResponses.length;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">AI Review: {questTitle}</h2>
      <p className="text-sm text-muted-foreground">
        Get personalized feedback on your quest performance
      </p>
      {/* AI Review content would go here */}
    </div>
  );
};
};