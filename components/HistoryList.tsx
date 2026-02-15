
import React from 'react';
import { Edit2, Trash2, Calendar, Star } from 'lucide-react';
import { Round, Player } from '../types';

interface Props {
  rounds: Round[];
  players: Player[];
  onEdit: (round: Round) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<Props> = ({ rounds, players, onEdit, onDelete }) => {
  if (rounds.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        <p className="text-gray-500 italic">Chưa có ván nào. Nhấn nút "+" để thêm ván mới.</p>
      </div>
    );
  }

  const sortedRounds = [...rounds].sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-4">
      {sortedRounds.map((round, idx) => (
        <div 
          key={round.id} 
          className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow relative ${
            round.isSpecial ? 'border-yellow-300 ring-1 ring-yellow-100' : 'border-gray-100'
          }`}
        >
          {round.isSpecial && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full shadow-md">
              <Star size={12} fill="currentColor" />
            </div>
          )}
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <Calendar size={14} />
              Ván {rounds.length - idx} • {new Date(round.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              {round.isSpecial && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Đặc biệt</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(round)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(round.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map(player => {
              const score = round.scores[player.id] || 0;
              return (
                <div key={player.id} className={`rounded-lg p-2 flex flex-col items-center ${score === 0 ? 'bg-gray-50' : score > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center uppercase">{player.name}</span>
                  <span className={`text-sm font-black ${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {score > 0 ? `+${score}` : score}
                  </span>
                </div>
              );
            })}
          </div>
          
          {round.note && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400 italic flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              {round.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
