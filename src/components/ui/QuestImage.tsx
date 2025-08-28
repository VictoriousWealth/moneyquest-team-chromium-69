import { useState } from 'react';

interface QuestImageProps {
  quest: {
    id: string;
    title: string;
    image_url?: string;
  };
  className?: string;
  alt?: string;
}

export const QuestImage = ({ quest, className = "", alt }: QuestImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  console.log(`QuestImage for ${quest.title}:`, {
    questId: quest.id,
    imageUrl: quest.image_url,
    imageError,
    hasImageUrl: !!quest.image_url
  });

  // Generate fallback image URL using Picsum with quest ID as seed
  const getFallbackImageUrl = () => {
    const seed = quest.id.replace(/[^a-zA-Z0-9]/g, '');
    return `https://picsum.photos/seed/${seed}/400/300`;
  };

  const imageUrl = quest.image_url && !imageError ? quest.image_url : getFallbackImageUrl();
  console.log(`Final imageUrl for ${quest.title}:`, imageUrl);
  const imageAlt = alt || `${quest.title} quest image`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (quest.image_url && !imageError) {
            setImageError(true);
            setIsLoading(true);
          } else {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
};