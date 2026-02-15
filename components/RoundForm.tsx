
import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Star, Plus, Minus, ChevronLeft, Heart } from 'lucide-react';
import { Player, Round } from '../types';

interface Props {
  players: Player[];
  onSave: (round: Round) => void;
  onCancel: () => void;
  initialRound: Round | null;
}

const RoundForm: React.FC<Props> = ({ players, onSave, onCancel, initialRound }) => {
  const [scores, setScores] = useState<Record<string, string>>({});
  const [note, setNote] = useState(initialRound?.note || '');
  const [isSpecial, setIsSpecial] = useState(initialRound?.isSpecial || false);

  useEffect(() => {
    if (initialRound) {
      const initScores: Record<string, string> = {};
      Object.entries(initialRound.scores).forEach(([pid, val]) => {
        initScores[pid] = val.toString();
      });
      setScores(initScores);
    } else {
      const initScores: Record<string, string> = {};
      players.forEach(p => initScores[p.id] = '0');
      setScores(initScores);
    }
  }, [initialRound, players]);

  const totalSum = Object.values(scores).reduce((sum: number, val: unknown) => sum + (parseInt(val as string) || 0), 0);
  // Đã bỏ biến isValid vì không còn ràng buộc tổng bằng 0

  const handleScoreChange = (pid: string, val: string) => {
    if (val !== '' && val !== '-' && isNaN(parseInt(val))) return;
    setScores(prev => ({ ...prev, [pid]: val }));
  };

  const adjustScore = (pid: string, delta: number) => {
    const current = parseInt(scores[pid]) || 0;
    setScores(prev => ({ ...prev, [pid]: (current + delta).toString() }));
  };

  const handleSubmit = () => {
    const finalScores: Record<string, number> = {};
    players.forEach(p => {
      finalScores[p.id] = parseInt(scores[p.id]) || 0;
    });

    const round: Round = {
      id: initialRound?.id || Math.random().toString(36).substr(2, 9),
      date: initialRound?.date || Date.now(),
      scores: finalScores,
      note: note.trim(),
      isSpecial
    };

    onSave(round);
  };

  const quickButtons = [-10, -5, -2, -1, 1, 2, 5, 10];

  return (
    <div className="flex flex-col h-full bg-[#fff5f5] text-gray-800 max-h-[90vh] overflow-hidden rounded-[2rem]">
      {/* Header - Tet Red Style */}
      <div className="flex justify-between items-center p-5 bg-gradient-to-r from-red-600 to-red-700 text-white sticky top-0 z-10 shadow-md">
        <button onClick={onCancel} className="flex items-center gap-1 hover:bg-white/20 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
          <span className="font-bold text-sm uppercase tracking-wide">Quay lại</span>
        </button>
        <h3 className="font-black text-lg">Ghi Điểm Tết 🧧</h3>
        <button 
          onClick={handleSubmit} 
          className="bg-yellow-400 hover:bg-yellow-500 text-red-800 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Lưu Ván
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Special Round Toggle - Cute Style */}
        <div className="bg-white rounded-3xl p-5 flex items-center justify-between border-2 border-red-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isSpecial ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
              <Star size={24} fill={isSpecial ? 'currentColor' : 'none'} />
            </div>
            <div>
              <h4 className="font-black text-red-800 text-base">Ván này đặc biệt nha!</h4>
              <p className="text-xs text-gray-400 font-medium">Bật để đánh dấu ván thắng lớn ✨</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSpecial(!isSpecial)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 shadow-inner ${isSpecial ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isSpecial ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="space-y-5">
          <label className="text-xs font-black uppercase tracking-widest text-red-400 px-2 flex items-center gap-2">
            <Heart size={14} fill="currentColor" /> Danh sách đại gia
          </label>
          
          {players.map((player, index) => (
            <div key={player.id} className="bg-white rounded-[2rem] p-5 border-2 border-red-50 shadow-sm hover:border-red-200 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-2xl bg-red-100 text-red-600 border-2 border-red-200 flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </div>
                  <span className="font-black text-gray-800 text-lg tracking-tight">{player.name}</span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={scores[player.id] || ''}
                    onChange={(e) => handleScoreChange(player.id, e.target.value)}
                    className="w-20 bg-red-50 border-2 border-red-100 rounded-2xl py-2 px-3 text-center font-black text-red-700 text-xl focus:border-red-400 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {quickButtons.map(val => (
                  <button
                    key={val}
                    onClick={() => adjustScore(player.id, val)}
                    className={`min-w-[44px] py-2 px-2 rounded-xl text-xs font-black transition-all active:scale-90 shadow-sm ${
                      val < 0 
                        ? 'bg-orange-50 text-orange-600 border-2 border-orange-100 hover:bg-orange-100' 
                        : 'bg-green-50 text-green-600 border-2 border-green-100 hover:bg-green-100'
                    }`}
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note Field - Cute Style */}
        <div className="relative">
          <div className="absolute left-4 top-4 text-red-300">
            <Edit2 size={20} />
          </div>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú ván này (ví dụ: Chặt heo 🐷)"
            className="w-full bg-white border-2 border-red-50 rounded-3xl py-4 pl-12 pr-6 text-sm font-medium text-gray-600 focus:border-red-200 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Footer Info - Always allowed to save */}
      <div className="p-5 bg-white border-t-2 border-red-50 flex items-center justify-between rounded-t-[2rem]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${totalSum === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">Tổng điểm ván này</span>
            <span className={`text-xl font-black ${totalSum === 0 ? 'text-green-600' : 'text-blue-600'}`}>{totalSum}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold max-w-[120px] text-right uppercase leading-tight italic">
          Bấm lưu để cập nhật túi tiền 🧧
        </p>
      </div>
    </div>
  );
};

const Edit2 = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

export default RoundForm;
