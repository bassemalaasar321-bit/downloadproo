import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(game.id));
    }
  }, [game.id]);

  const handleClick = () => {
    fetch(`/api/games/${game.id}/views`, { method: 'POST' }).catch(() => {});
  };

  const toggleFavorite = () => {
    if (typeof window === 'undefined') return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter((id: number) => id !== game.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(game.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  // حساب الوصف المقطوع مع النقاط
  const getTruncatedDescription = (text: string, maxLines: number = 4) => {
    const wordsPerLine = 12; // تقريباً عدد الكلمات في السطر
    const maxWords = maxLines * wordsPerLine;
    const words = text.split(' ');
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords - 1).join(' ') + '...';
  };

  return (
    <div className="card flex flex-col md:flex-row gap-6 p-6 group max-w-4xl relative overflow-hidden md:h-52">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="md:w-64 w-full overflow-hidden rounded-xl relative z-10 flex-shrink-0">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 md:h-40 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 border border-gray-700"
          style={{ contentVisibility: 'auto' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-between md:h-40">
        <div className="flex-1 overflow-hidden">
          <a href={`/game/${game.id}`} onClick={handleClick} className="text-xl font-bold mb-2 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 block break-words transition-all duration-300 line-clamp-2">
            {game.title}
          </a>
          <p className="text-gray-300 text-sm leading-relaxed break-words">
            {getTruncatedDescription(game.description)}
          </p>
        </div>
        <div className="flex gap-3 mt-3 flex-shrink-0">
          <a 
            href={`/game/${game.id}`}
            onClick={handleClick}
            className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
          >
            🎮 عرض التفاصيل
          </a>
          <button 
            onClick={toggleFavorite}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm ${
              isFavorite 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white' 
                : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white'
            }`}
          >
            {isFavorite ? '❤️ مفضلة' : '⭐ مفضلة'}
          </button>
        </div>
      </div>
    </div>
  );
}