import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { CheckCircle, Circle, Lock, MapPin, X, Brain } from "lucide-react";
import { SpeechBubble } from "./SpeechBubble";
import { AIReviewDialog } from "./AIReviewDialog";

interface Quest {
  id: string;
  title: string;
  npc: string;
  description: string;
  status: "locked" | "available" | "active" | "completed";
  zone: string;
  reward: string;
}

interface QuestBoardProps {
  quests: Quest[];
  onQuestStart: (questId: string) => void;
  onQuestContinue: (questId: string) => void;
}

export const QuestBoard = ({ quests, onQuestStart, onQuestContinue }: QuestBoardProps) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [hoveredCompletedQuest, setHoveredCompletedQuest] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewQuestId, setReviewQuestId] = useState<string>("");
  const [reviewQuestTitle, setReviewQuestTitle] = useState<string>("");

  const getStatusIcon = (status: Quest["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-quest-complete" />;
      case "active":
        return <Circle className="w-5 h-5 text-quest-active animate-pulse-glow" />;
      case "available":
        return <Circle className="w-5 h-5 text-primary" />;
      case "locked":
        return <Lock className="w-5 h-5 text-quest-locked" />;
    }
  };

  const getStatusColor = (status: Quest["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "active":
        return "bg-quest-active text-white";
      case "available":
        return "bg-primary text-primary-foreground";
      case "locked":
        return "bg-muted text-muted-foreground";
    }
  };

  const getQuestIcon = (questId: string) => {
    switch (questId) {
      case "juice-shrinkflation":
        return <img src="/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png" alt="Orange Juice" className="w-20 h-20 mx-auto" />;
      case "pancake-inflation":
        return <img src="/lovable-uploads/d5ed5bf6-f934-4d5f-bada-4721a17b0885.png" alt="Pancakes" className="w-20 h-20 mx-auto" />;
      case "momo-bakery-payslip":
        return <img src="/lovable-uploads/d1b0b67f-9824-41ef-8653-9eeaca4a4e87.png" alt="Benny's Bakery" className="w-20 h-20 mx-auto" />;
      case "bread-bank":
        return <img src="/lovable-uploads/d1b0b67f-9824-41ef-8653-9eeaca4a4e87.png" alt="Benny's Bakery" className="w-20 h-20 mx-auto" />;
      case "pippa-self-employment":
        return <img src="/lovable-uploads/a3a47d87-7b08-4227-b18e-3ac5c7c159b8.png" alt="Business Forms" className="w-20 h-20 mx-auto" />;
      case "basket-durability":
        return "🧺";
      default:
        return "📋";
    }
  };

  const handleAIReview = (quest: Quest) => {
    setReviewQuestId(quest.id);
    setReviewQuestTitle(quest.title);
    setReviewDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Tropical Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-10 text-8xl animate-float">🌴</div>
        <div className="absolute top-20 right-10 text-6xl animate-float" style={{animationDelay: '1s'}}>🌴</div>
        <div className="absolute bottom-10 left-20 text-5xl animate-float" style={{animationDelay: '2s'}}>🌺</div>
        <div className="absolute bottom-20 right-20 text-5xl animate-float" style={{animationDelay: '3s'}}>🌺</div>
      </div>

      {/* Quest Board Frame */}
      <div className="relative bg-gradient-to-b from-amber-800 to-amber-900 rounded-2xl p-8 shadow-2xl border-8 border-amber-700">
        {/* Wooden Posts */}
        <div className="absolute -top-4 left-8 w-6 h-16 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full"></div>
        <div className="absolute -top-4 right-8 w-6 h-16 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full"></div>
        
        {/* Title Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-4 mb-8 text-center shadow-lg border-4 border-amber-800">
          <h1 className="text-4xl font-bold text-amber-100 mb-2 drop-shadow-lg">
            MARKET ISLAND QUEST BOARD
          </h1>
          <p className="text-amber-200 text-lg font-semibold italic">
            Learn the secrets of smart shopping through adventure!
          </p>
        </div>

        {/* Quest Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-4 border-amber-600 shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl ${
                quest.status === "locked" ? "opacity-60 grayscale" : ""
              } ${
                selectedQuest?.id === quest.id ? "ring-4 ring-primary shadow-2xl scale-105" : ""
              }`}
              onClick={() => quest.status !== "locked" && setSelectedQuest(quest)}
            >
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(quest.status)}`}>
                {quest.status === "available" ? "Available" : 
                 quest.status === "active" ? "Active" : 
                 quest.status === "completed" ? "Complete" : "Locked"}
              </div>

              {/* Quest Icon */}
              <div 
                className="text-6xl mb-4 text-center flex justify-center items-center relative"
                onMouseEnter={() => quest.status === "completed" && setHoveredCompletedQuest(quest.id)}
                onMouseLeave={() => quest.status === "completed" && setHoveredCompletedQuest(null)}
              >
                {getQuestIcon(quest.id)}
                {(quest.status === "available" || quest.status === "active") && (
                  <SpeechBubble questId={quest.id} />
                )}
                {quest.status === "completed" && hoveredCompletedQuest === quest.id && (
                  <SpeechBubble questId={quest.id} isHover={true} />
                )}
              </div>

              {/* Quest Title */}
              <h3 className="text-xl font-bold text-amber-900 mb-2 text-center">
                {quest.title}
              </h3>

              {/* Area Badge */}
              <div className="flex items-center justify-center gap-1 mb-3">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-semibold text-amber-700">Area: {quest.zone}</span>
              </div>

              {/* NPC Info */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center bg-amber-200 rounded-full text-center p-3">
                  {quest.npc.toLowerCase().includes('momo') ? (
                    <img
                      src="/lovable-uploads/3b64b2f0-5c29-48c1-b570-dbbebf4d417d.png"
                      alt="Momo"
                      className="w-10 h-10"
                    />
                  ) : quest.npc.toLowerCase().includes('pippa') ? (
                    <img
                      src="/lovable-uploads/c0150afc-b217-4b78-bb63-80cf80767d22.png"
                      alt="Pippa"
                      className="w-10 h-10"
                    />
                  ) : quest.npc.toLowerCase().includes('benny') ? (
                    <img
                      src="/lovable-uploads/3b64b2f0-5c29-48c1-b570-dbbebf4d417d.png"
                      alt="Momo"
                      className="w-10 h-10"
                    />
                  ) : (
                    <img
                      src="/lovable-uploads/3b64b2f0-5c29-48c1-b570-dbbebf4d417d.png"
                      alt="Momo"
                      className="w-10 h-10"
                    />
                  )}
                  <span className="text-sm font-medium text-amber-800 leading-tight">
                    {quest.npc}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-amber-800 text-center leading-relaxed">
                {quest.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Details Popup */}
      <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-600">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {selectedQuest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{getQuestIcon(selectedQuest.id)}</div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-blue-900">{selectedQuest.title}</DialogTitle>
                    <p className="text-blue-700 font-medium">with {selectedQuest.npc}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <p className="text-blue-800 mb-4 leading-relaxed">{selectedQuest.description}</p>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-blue-800">{selectedQuest.zone}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  {selectedQuest.npc.toLowerCase().includes('momo') ? (
                    <img src="/lovable-uploads/3b64b2f0-5c29-48c1-b570-dbbebf4d417d.png" alt="Momo" className="w-5 h-5" />
                  ) : selectedQuest.npc.toLowerCase().includes('pippa') ? (
                    <img src="/lovable-uploads/c0150afc-b217-4b78-bb63-80cf80767d22.png" alt="Pippa" className="w-5 h-5" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                  <span className="text-sm font-medium text-blue-800">{selectedQuest.npc}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  <span className="text-lg">🎁</span>
                  <span className="text-sm font-medium text-blue-800">{selectedQuest.reward}</span>
                </div>
              </div>

              <div className="flex justify-center space-y-2 flex-col">
                {selectedQuest.status === "available" && (
                  <Button 
                    size="lg"
                    onClick={() => {
                      onQuestStart(selectedQuest.id);
                      setSelectedQuest(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                  >
                    🚀 Start Quest
                  </Button>
                )}
                {selectedQuest.status === "active" && (
                  <Button 
                    size="lg"
                    onClick={() => {
                      onQuestContinue(selectedQuest.id);
                      setSelectedQuest(null);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg animate-pulse-glow"
                  >
                    ⚡ Continue Quest
                  </Button>
                )}
                {selectedQuest.status === "completed" && (
                  <>
                    <Button size="lg" disabled className="bg-gray-400 text-gray-600 font-bold px-8 py-3 rounded-xl">
                      ✅ Completed
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleAIReview(selectedQuest)}
                      className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg mt-2"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Get AI Review
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AIReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        questId={reviewQuestId}
        questTitle={reviewQuestTitle}
      />
    </div>
  );
};