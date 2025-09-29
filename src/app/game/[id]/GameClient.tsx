'use client';
import { useState, useEffect, use } from 'react';
import Footer from '@/components/Footer';

const categoryNames: { [key: string]: string } = {
  ACTION: 'ألعاب أكشن',
  WAR: 'ألعاب حرب',
  FOOTBALL: 'ألعاب كرة قدم',
  OPEN_WORLD: 'ألعاب عالم مفتوح',
  CARS: 'ألعاب سيارات',
  LIGHT: 'ألعاب خفيفة',
  HORROR: 'ألعاب رعب',
  STRATEGY: 'ألعاب استراتيجية',
  CLASSIC: 'ألعاب قديمة',
  PS1_PORTED: 'بلايستيشن 1 متحولة',
  PS2_PORTED: 'بلايستيشن 2 متحولة',
  PROGRAMS: 'البرامج'
};

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
  platforms?: string;
  systemReqs?: string;
  gameSpecs?: string;
}

export default function GameClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameData();
    fetch(`/api/games/${resolvedParams.id}/views`, { method: 'POST' }).catch(() => {});
  }, [resolvedParams.id]);

  const fetchGameData = async () => {
    try {
      const gameResponse = await fetch(`/api/games/${resolvedParams.id}`);
      const gameData = await gameResponse.json();
      
      if (gameData.error) {
        return;
      }
      
      setGame(gameData);
      
      const similarResponse = await fetch(`/api/games?category=${gameData.category}&exclude=${resolvedParams.id}&limit=4`);
      const similarData = await similarResponse.json();
      setSimilarGames(Array.isArray(similarData) ? similarData : []);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    fetch(`/api/games/${resolvedParams.id}/views`, { method: 'POST' }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4 neon-glow"></div>
          <div className="text-xl text-white">🎮 جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-white">اللعبة غير موجودة</div>
          <a href="/" className="btn-primary mt-4 inline-block">🏠 العودة للرئيسية</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8">
            <a href="/" className="inline-block">
              <h1 className="text-5xl font-bold neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 hover:scale-105 transition-transform cursor-pointer">
                🎮 تحميل العاب برو
              </h1>
            </a>
          </div>
          
          <div className="max-w-xl mx-auto mb-8">
            <form onSubmit={(e) => { e.preventDefault(); const searchValue = (e.target as any).search.value; if(searchValue.trim()) window.location.href = `/?search=${encodeURIComponent(searchValue.trim())}`; else window.location.href = '/'; }} className="relative">
              <input
                name="search"
                type="text"
                placeholder="🔍 ابحث عن لعبتك المفضلة..."
                className="w-full px-6 py-3 text-lg rounded-2xl border-2 border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none search-glow transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 neon-glow"
              >
                🚀 بحث
              </button>
            </form>
          </div>
          

          
          <nav className="mb-4 text-sm">
            <ol className="flex items-center space-x-2 rtl:space-x-reverse justify-center bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
              <li>
                <a href="/" className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1">
                  🏠 الرئيسية
                </a>
              </li>
              <li className="text-gray-500">❯</li>
              <li>
                <span className="text-purple-400">{categoryNames[game.category]}</span>
              </li>
              <li className="text-gray-500">❯</li>
              <li>
                <span className="text-white font-medium">{game.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-4xl mx-auto">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 text-center break-words">
              {game.title}
            </h1>
            
            <div className="mb-8 text-center relative">
              <div className="relative overflow-hidden rounded-2xl max-w-2xl mx-auto">
                <img 
                  src={game.imageUrl} 
                  alt={game.title}
                  loading="eager"
                  decoding="async"
                  className="w-full rounded-2xl shadow-2xl border border-gray-700 hover:scale-105 transition-transform duration-500"
                  style={{ contentVisibility: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6 flex items-center gap-2">
                📖 وصف اللعبة
              </h2>
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl border border-gray-600">
                <p className="text-gray-300 text-lg leading-relaxed break-words">
                  {game.description}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 flex items-center gap-2">
                ⚙️ مواصفات اللعبة
              </h2>
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-bold text-cyan-400 min-w-[150px]">🎯 الفئة:</span>
                    <span className="text-gray-300">{categoryNames[game.category]}</span>
                  </div>
                  {game.platforms && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-bold text-cyan-400 min-w-[150px]">💻 المنصات:</span>
                      <span className="text-gray-300">{game.platforms}</span>
                    </div>
                  )}
                  {game.systemReqs && (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-cyan-400">🔧 متطلبات التشغيل:</span>
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-600">
                        <pre className="text-gray-300 whitespace-pre-line break-words text-sm">{game.systemReqs}</pre>
                      </div>
                    </div>
                  )}
                  {game.gameSpecs && (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-cyan-400">📋 مواصفات إضافية:</span>
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-600">
                        <pre className="text-gray-300 whitespace-pre-line break-words text-sm">{game.gameSpecs}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <a 
                href={game.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownloadClick}
                className="btn-primary text-2xl px-12 py-6 inline-flex items-center gap-3 hover:scale-110 transition-all duration-300"
              >
                💾 تحميل اللعبة الآن
              </a>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center flex items-center justify-center gap-2">
                🎮 ألعاب مشابهة ({similarGames.length})
              </h2>
              {similarGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarGames.map((similarGame) => (
                  <div key={similarGame.id} className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-gray-600 group">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img 
                        src={similarGame.imageUrl} 
                        alt={similarGame.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ contentVisibility: 'auto' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-white mb-3 text-sm break-words group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all">{similarGame.title}</h3>
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2 break-words">{similarGame.description}</p>
                    <a 
                      href={`/game/${similarGame.id}`}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-block w-full text-center hover:scale-105"
                    >
                      🎯 عرض التفاصيل
                    </a>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎮</div>
                  <p className="text-gray-400">لا توجد ألعاب مشابهة حالياً</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}