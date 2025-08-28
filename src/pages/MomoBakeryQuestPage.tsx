import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGameState } from "@/hooks/useGameState";
import { useAchievements } from "@/hooks/useAchievements";
import { toast } from "sonner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/Badge";
import { GameHUD } from "@/components/game/GameHUD";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PayslipData {
  employeeName: string;
  grossPay: number;
  taxDeduction: number;
  niContribution: number;
  studentLoan: number;
  netPay: number;
}

interface PayslipQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const payslipQuestions: PayslipQuestion[] = [
  {
    id: 'gross-pay',
    question: "What does 'Gross Pay' mean on Momo's payslip?",
    options: [
      "The final amount Momo takes home",
      "The total amount before any deductions",
      "Only the overtime payments",
      "The amount after taxes"
    ],
    correct: 1,
    explanation: "Gross pay is the total amount earned before any deductions like tax, National Insurance, or student loan repayments are taken off."
  },
  {
    id: 'paye',
    question: "What is PAYE and why is it deducted from Momo's wages?",
    options: [
      "A voluntary savings scheme",
      "Pay As You Earn - income tax collected by employers",
      "A pension contribution",
      "An insurance premium"
    ],
    correct: 1,
    explanation: "PAYE (Pay As You Earn) is the system where employers automatically deduct income tax from your wages and send it to HMRC. This makes it easier than paying a big tax bill once a year!"
  },
  {
    id: 'national-insurance',
    question: "What does National Insurance help pay for in the UK?",
    options: [
      "Only car insurance",
      "NHS healthcare and state benefits",
      "Private health insurance",
      "University fees"
    ],
    correct: 1,
    explanation: "National Insurance contributions help fund the NHS, state pension, and various benefits. It's like a shared pot that helps support everyone in society!"
  },
  {
    id: 'student-allowance',
    question: "As a student, what's special about Momo's tax situation?",
    options: [
      "Students don't pay any tax ever",
      "Students get a personal allowance (tax-free amount)",
      "Students pay double tax",
      "Students only pay tax on weekends"
    ],
    correct: 1,
    explanation: "Students get the same personal allowance as everyone else (£12,570 in 2024/25). This means the first £12,570 earned in a year is tax-free - perfect for part-time student jobs!"
  }
];

const MomoBakeryQuestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameState, startQuest, completeQuest } = useGameState();
  const { checkAndAwardAchievements } = useAchievements();
  const { speak, stop, isPlaying, isLoading } = useTextToSpeech();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [scannedSections, setScannedSections] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showIntroDialog, setShowIntroDialog] = useState(true);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const sectionExplanations = {
    employee: {
      title: "Employee Details",
      content: "This section shows who you are and your job details. It includes your name, what job you do, how many hours you work each week, and how much money you earn per hour. This helps make sure you're getting paid correctly!"
    },
    earnings: {
      title: "Gross Pay (Your Total Earnings)",
      content: "Gross Pay is ALL the money you earned before anything gets taken away. Think of it like a big jar of coins - this is how full the jar is before anyone takes any coins out for taxes or other things."
    },
    deductions: {
      title: "Deductions (Money Taken Out)",
      content: "Deductions are amounts taken from your gross pay. Income Tax (PAYE) goes to the government to pay for public services. National Insurance helps pay for the NHS and benefits. Student Loan repayments help pay back money borrowed for university."
    },
    net: {
      title: "Net Pay (Take Home Money)",
      content: "Net Pay is the actual money that goes into your bank account - it's what's left after all the deductions. This is your 'take home' money that you can spend on things you want and need!"
    }
  };

  const payslip: PayslipData = {
    employeeName: "Momo Chen",
    grossPay: 480,  // 20 hours × £12/hour
    taxDeduction: 0, // Under personal allowance
    niContribution: 12, // Small NI contribution
    studentLoan: 0, // Under threshold
    netPay: 468
  };

  useEffect(() => {
    if (user) {
      startQuest('momo-bakery-payslip');
    }
  }, [user]);

  const handleSpeakToggle = () => {
    if (isPlaying) {
      stop();
    } else {
      const introText = "Hey! Thanks for coming! I just got my first payslip from my summer job at Benny's Bakery, but I'm really confused by all these numbers and deductions. Can you help me understand what everything means? I want to make sure I'm being paid correctly!";
      speak(introText);
    }
  };

  const handleSectionClick = (section: string) => {
    setActivePopup(section);
  };

  const handlePopupClose = () => {
    const section = activePopup;
    setActivePopup(null);
    
    if (section && !scannedSections.includes(section)) {
      setScannedSections([...scannedSections, section]);
      
      if (scannedSections.length === 3) {
        setShowPayslip(false);
        toast.success("Great! You've learned about all the key sections. Now let's test your understanding!");
      }
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === payslipQuestions[currentQuestion].correct;
    const roundScore = isCorrect ? 1 : 0;
    
    // Save response to database
    try {
      if (user) {
        await supabase.from('quest_responses').insert({
          user_id: user.id,
          quest_id: 'momo-bakery-payslip',
          round_number: currentQuestion + 1,
          question_text: payslipQuestions[currentQuestion].question,
          selected_option: payslipQuestions[currentQuestion].options[selectedAnswer],
          correct_answer: payslipQuestions[currentQuestion].options[payslipQuestions[currentQuestion].correct],
          is_correct: isCorrect,
          score_earned: roundScore
        });
      }
    } catch (error) {
      console.error('Error saving quest response:', error);
    }
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success("Correct! Well done!");
    } else {
      toast.error("Not quite right, but you're learning!");
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < payslipQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleQuestComplete();
    }
  };

  const handleQuestComplete = async () => {
    const coinsEarned = 1.75; // Convert from pence to pounds
    
    await completeQuest('momo-bakery-payslip', coinsEarned, (gameState, questId) => 
      checkAndAwardAchievements(gameState, questId)
    );
    
    setQuestCompleted(true);
    toast.success(`Quest completed! You earned £${coinsEarned.toFixed(2)}!`);
  };

  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / payslipQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <GameHUD coins={gameState?.coins || 0} day={gameState?.day || 1} streakDays={gameState?.streakDays || 0} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market Island
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">🥖 Momo's Summer Job Dilemma</CardTitle>
              <p className="text-amber-800">
                Help Momo understand his first payslip from Benny's Bakery
              </p>
            </CardHeader>
          </Card>

          {!showPayslip && scannedSections.length === 0 && showIntroDialog && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSpeakToggle} 
                        disabled={isLoading} 
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        {isLoading ? 'Loading...' : isPlaying ? 'Stop Speech' : 'Play Speech'}
                      </Button>
                    </div>
                    <div className="bg-card border-2 border-primary/20 rounded-lg p-6 space-y-4">
                      <Typewriter
                        text="Hey! Thanks for coming! I just got my first payslip from my summer job at Benny's Bakery, but I'm really confused by all these numbers and deductions. Can you help me understand what everything means? I want to make sure I'm being paid correctly!"
                        speed={30}
                        className="text-lg mb-2"
                        onComplete={() => {}}
                      />
                      <p className="text-sm text-muted-foreground">- Momo, Student Worker</p>
                      <div className="text-center">
                        <Button 
                          onClick={() => {
                            setShowIntroDialog(false);
                            setShowPayslip(true);
                          }}
                          className="shadow-game hover:shadow-game-hover mt-4"
                        >
                          Help Momo Learn
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showPayslip && scannedSections.length < 4 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>📄 Momo's Payslip - Click each blue box to learn about payslip terms!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-amber-700">BENNY'S BAKERY LTD</h3>
                    <p className="text-sm text-gray-600">Payslip for Period: 1-31 July 2024</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Employee Details</h4>
                      <div 
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          scannedSections.includes('employee') 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-blue-300 hover:border-blue-500'
                        }`}
                        onClick={() => handleSectionClick('employee')}
                      >
                        <p><strong>Name:</strong> {payslip.employeeName}</p>
                        <p><strong>Position:</strong> Part-time Baker Assistant</p>
                        <p><strong>Hours:</strong> 20 hours/week</p>
                        <p><strong>Rate:</strong> £12.00/hour</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Earnings</h4>
                      <div 
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          scannedSections.includes('earnings') 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-blue-300 hover:border-blue-500'
                        }`}
                        onClick={() => handleSectionClick('earnings')}
                      >
                        <p><strong>Gross Pay:</strong> £{payslip.grossPay.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Before deductions</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Deductions</h4>
                      <div 
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          scannedSections.includes('deductions') 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-blue-300 hover:border-blue-500'
                        }`}
                        onClick={() => handleSectionClick('deductions')}
                      >
                        <p><strong>Income Tax (PAYE):</strong> £{payslip.taxDeduction.toFixed(2)}</p>
                        <p><strong>National Insurance:</strong> £{payslip.niContribution.toFixed(2)}</p>
                        <p><strong>Student Loan:</strong> £{payslip.studentLoan.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Take Home</h4>
                      <div 
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          scannedSections.includes('net') 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-blue-300 hover:border-blue-500'
                        }`}
                        onClick={() => handleSectionClick('net')}
                      >
                        <p><strong>Net Pay:</strong> £{payslip.netPay.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Amount paid to your account</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="bg-blue-50">
                      Learned: {scannedSections.length}/4 sections
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click on each blue-bordered box to learn what the key terms mean!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Educational Popups */}
          <Dialog open={activePopup !== null} onOpenChange={(open) => !open && handlePopupClose()}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-800">
                  {activePopup && sectionExplanations[activePopup as keyof typeof sectionExplanations]?.title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base leading-relaxed">
                {activePopup && sectionExplanations[activePopup as keyof typeof sectionExplanations]?.content}
              </DialogDescription>
              <div className="flex justify-center pt-4">
                <Button onClick={handlePopupClose} className="bg-blue-600 hover:bg-blue-700">
                  Got it! ✅
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {scannedSections.length >= 4 && !questCompleted && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Question {currentQuestion + 1} of {payslipQuestions.length}
                  <Progress value={progress} className="w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showExplanation ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {payslipQuestions[currentQuestion].question}
                    </h3>
                    <div className="space-y-2">
                      {payslipQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-3 text-left border rounded-lg transition-colors ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="mt-4"
                    >
                      Submit Answer
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className={`p-4 rounded-lg mb-4 ${
                      selectedAnswer === payslipQuestions[currentQuestion].correct
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="font-medium">
                        {selectedAnswer === payslipQuestions[currentQuestion].correct ? '✅ Correct!' : '❌ Not quite right'}
                      </p>
                      <p className="mt-2">{payslipQuestions[currentQuestion].explanation}</p>
                    </div>
                    <Button onClick={handleNextQuestion}>
                      {currentQuestion < payslipQuestions.length - 1 ? 'Next Question' : 'Complete Quest'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {questCompleted && (
            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Quest Complete!
                </h2>
                <p className="text-green-700 mb-4">
                  Momo now understands his payslip! You scored {score}/{payslipQuestions.length} questions correctly.
                  Great job helping him navigate his first employment experience!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => navigate('/')}>
                    Return to Market Island
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomoBakeryQuestPage;