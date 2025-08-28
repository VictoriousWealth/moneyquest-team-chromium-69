import React from 'react';
import { VisualNovelEngine } from '@/components/dialogue/VisualNovelEngine';
import { DialogueScene } from '@/hooks/useDialogueSystem';

interface JuiceStandProps {
  onComplete: (score: number, summary: string) => void;
}

export const JuiceStand: React.FC<JuiceStandProps> = ({ onComplete }) => {
  // Game data
  const juiceComparison = {
    option1: {
      id: 'orange_juice_1',
      name: 'Fresh Orange Delight',
      price: 4.50,
      volume: 300,
      description: 'Premium fresh-squeezed orange juice with pulp'
    },
    option2: {
      id: 'orange_juice_2', 
      name: 'Citrus Burst',
      price: 3.20,
      volume: 200,
      description: 'Concentrated orange juice with added vitamins'
    }
  };

  const calculateValuePerMl = (juice: any): number => {
    return juice.price / juice.volume;
  };

  const handleJuiceChoice = (selectedJuice: any) => {
    const option1ValuePerMl = calculateValuePerMl(juiceComparison.option1);
    const option2ValuePerMl = calculateValuePerMl(juiceComparison.option2);
    const selectedValuePerMl = calculateValuePerMl(selectedJuice);
    
    const betterValue = option1ValuePerMl < option2ValuePerMl ? juiceComparison.option1 : juiceComparison.option2;
    const correct = selectedJuice.id === betterValue.id;
    
    const points = correct ? 100 : 0;
    const summary = `You chose ${selectedJuice.name}. ${correct ? 'Correct! Great job!' : 'Try again next time!'}`;
    
    setTimeout(() => {
      onComplete(points, summary);
    }, 2000);
  };

  // Create visual novel scenes
  const scenes: DialogueScene[] = [
    {
      id: 'intro',
      background: {
        id: 'juice_stand',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&h=800&fit=crop',
        alt: 'Colorful juice stand'
      },
      characters: [
        {
          id: 'maya',
          name: 'Maya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
          position: 'left',
          visible: true
        },
        {
          id: 'alex',
          name: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          position: 'right',
          visible: false
        }
      ],
      messages: [
        {
          id: 'welcome',
          speaker: 'Maya',
          text: "Welcome to Maya's Juice Stand! I'm Maya, and I'll help you learn about getting the best value for your money.",
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
        },
        {
          id: 'explanation',
          speaker: 'Maya',
          text: "Today, a customer wants to buy orange juice, but they're not sure which option gives them the best deal. Want to help them?",
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
        }
      ]
    },
    {
      id: 'customer_arrives',
      background: {
        id: 'juice_stand',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&h=800&fit=crop',
        alt: 'Colorful juice stand'
      },
      characters: [
        {
          id: 'maya',
          name: 'Maya',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
          position: 'left',
          visible: true
        },
        {
          id: 'alex',
          name: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          position: 'right',
          visible: true
        }
      ],
      messages: [
        {
          id: 'customer_greeting',
          speaker: 'Alex',
          text: "Hi Maya! I love orange juice, but I want to make sure I'm getting good value. Can you help me compare these options?",
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
        },
        {
          id: 'maya_explains',
          speaker: 'Maya',
          text: "Of course! The key is to calculate the price per milliliter. Let me show you the two options we have today.",
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
        },
        {
          id: 'present_options',
          speaker: 'Maya',
          text: `We have two options: "${juiceComparison.option1.name}" for $${juiceComparison.option1.price} (${juiceComparison.option1.volume}ml) and "${juiceComparison.option2.name}" for $${juiceComparison.option2.price} (${juiceComparison.option2.volume}ml). Which one offers better value?`,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
          choices: [
            {
              id: 'choice_option1',
              text: `Choose ${juiceComparison.option1.name} ($${juiceComparison.option1.price} / ${juiceComparison.option1.volume}ml)`,
              action: () => handleJuiceChoice(juiceComparison.option1)
            },
            {
              id: 'choice_option2',
              text: `Choose ${juiceComparison.option2.name} ($${juiceComparison.option2.price} / ${juiceComparison.option2.volume}ml)`,
              action: () => handleJuiceChoice(juiceComparison.option2)
            }
          ]
        }
      ]
    }
  ];

  const handleComplete = (gameData: Record<string, any>) => {
    // Handle completion
    onComplete(100, "Quest completed successfully!");
  };

  return (
    <VisualNovelEngine 
      scenes={scenes}
      onComplete={handleComplete}
      className="juice-stand-game"
    />
  );
};