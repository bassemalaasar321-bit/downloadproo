'use client';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  views: number;
}

export default function TrendingGames() {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  const fetchTrendingGames = async () => {
    try {
      const response = await fetch('/api/games/trending');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrendingGames(data);
      } else {
        setTrendingGames([]);
      }
    } catch (error) {
      console.error('Error fetching trending games:', error);
      setTrendingGames([]);
    }
  };

  // تصميمات مختلفة لكل ترتيب
  const getRankStyle = (index: number) => {
    const styles = [
      // المركز الأول - ذهبي فخم
      {
        cardClass: "trending-card-gold",
        borderClass: "",
        bgGradient: "bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-orange-500/20",
        rankBg: "bg-gradient-to-r from-yellow-400 to-amber-500",
        rankText: "text-black font-black",
        animation: "",
        glow: "shadow-2xl shadow-yellow-500/30",
        crown: "👑"
      },
      // المركز الثاني - فضي
      {
        cardClass: "trending-card-silver", 
        borderClass: "",
        bgGradient: "bg-gradient-to-br from-gray-300/20 via-slate-400/10 to-gray-500/20",
        rankBg: "bg-gradient-to-r from-gray-300 to-slate-400",
        rankText: "text-black font-bold",
        animation: "",
        glow: "shadow-xl shadow-gray-400/25",
        crown: "🥈"
      },
      // المركز الثالث - برونزي
      {
        cardClass: "trending-card-bronze",
        borderClass: "", 
        bgGradient: "bg-gradient-to-br from-orange-600/20 via-amber-700/10 to-yellow-700/20",
        rankBg: "bg-gradient-to-r from-orange-600 to-amber-700",
        rankText: "text-white font-bold",
        animation: "",
        glow: "shadow-lg shadow-orange-600/20",
        crown: "🥉"
      },
      // المركز الرابع - أزرق مميز
      {
        cardClass: "trending-card-blue",
        borderClass: "",
        bgGradient: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-indigo-500/20", 
        rankBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
        rankText: "text-white font-bold",
        animation: "",
        glow: "shadow-lg shadow-blue-500/20",
        crown: "💎"
      },
      // المركز الخامس - بنفسجي أنيق
      {
        cardClass: "trending-card-purple",
        borderClass: "",
        bgGradient: "bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-indigo-500/20",
        rankBg: "bg-gradient-to-r from-purple-500 to-pink-500", 
        rankText: "text-white font-bold",
        animation: "",
        glow: "shadow-lg shadow-purple-500/20",
        crown: "⭐"
      }
    ];
    
    return styles[index] || styles[4]; // استخدام التصميم الأخير للباقي
  };

  return (
    <div className="trending-border rounded-2xl shadow-2xl p-6 mt-6">
      <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center gap-2">
        🔥 الألعاب الرائجة
      </h3>
      <div className="space-y-4">
        {Array.isArray(trendingGames) && trendingGames.map((game, index) => {
          const style = getRankStyle(index);
          return (
            <a 
              key={game.id}
              href={`/game/${game.id}`}
              className={`block p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${style.cardClass} ${style.bgGradient} hover:scale-105`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className={`w-10 h-10 rounded-full ${style.rankBg} flex items-center justify-center ${style.rankText} text-sm relative`}>
                  <span className="absolute -top-1 -right-1 text-lg">{style.crown}</span>
                  {index + 1}
                </div>
                <div className="text-xs text-gray-300 font-semibold">👀 {game.views || 0} مشاهدة</div>
                {index === 0 && <div className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">🔥 الأكثر شعبية</div>}
              </div>
              
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500 border border-gray-600"
                  style={{ contentVisibility: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {index < 3 && (
                  <div className={`absolute top-2 right-2 ${style.rankBg} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                    TOP {index + 1}
                  </div>
                )}
              </div>
              
              <span className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 block text-center break-words leading-tight transition-all duration-300">
                {game.title}
              </span>
            </a>
          );
        })}
      </div>
      
      {trendingGames.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎮</div>
          <p className="text-gray-400 text-sm">لا توجد ألعاب رائجة حالياً</p>
        </div>
      )}
    </div>
  );
}