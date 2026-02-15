
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus, X, Save, ArrowLeft, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { Table, Player, RuleType } from '../types';

interface Props {
  onAdd: (table: Table) => void;
}

const CreateTable: React.FC<Props> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [playerInput, setPlayerInput] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [ruleType, setRuleType] = useState<RuleType>(RuleType.NONE);
  const [ruleValue, setRuleValue] = useState(10);

  const handleAddPlayer = () => {
    if (!playerInput.trim()) return;
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: playerInput.trim()
    };
    setPlayers([...players, newPlayer]);
    setPlayerInput('');
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Vui lòng đặt tên bàn chơi! 🧧');
      return;
    }
    if (players.length < 2) {
      toast.error('Cần ít nhất 2 người mới gầy sòng được! 🃏');
      return;
    }

    const newTable: Table = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      createdAt: Date.now(),
      players,
      rounds: [],
      rules: {
        type: ruleType,
        value: ruleValue
      },
      isActive: true
    };

    onAdd(newTable);
    navigate(`/table/${newTable.id}`);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border-2 border-red-50 p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black text-red-800 uppercase tracking-tight">Tạo sòng mới 🧧</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2 px-1">Tên sòng bài</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Tiến Lên Nhà Nội, Xì Dách Tết..."
            className="w-full px-5 py-4 bg-red-50 border-2 border-red-100 rounded-2xl focus:border-red-400 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-red-400 mb-2 px-1">Gia nhập hội thần bài</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder="Tên đại gia..."
              className="flex-1 px-5 py-4 bg-red-50 border-2 border-red-100 rounded-2xl focus:border-red-400 focus:bg-white outline-none transition-all font-bold text-gray-800 shadow-inner"
            />
            <button 
              onClick={handleAddPlayer}
              className="bg-red-600 text-white p-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
            >
              <UserPlus size={24} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-5">
            {players.map(player => (
              <div key={player.id} className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-2xl font-black text-sm shadow-sm animate-in fade-in zoom-in duration-200">
                {player.name}
                <button onClick={() => handleRemovePlayer(player.id)} className="hover:text-red-900 bg-white/50 rounded-full p-0.5 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            {players.length === 0 && <p className="text-sm text-gray-400 italic px-1">Chưa có ai tham gia cuộc vui...</p>}
          </div>
        </div>

        <div className="bg-red-50/50 p-6 rounded-[1.5rem] border-2 border-red-50">
          <h3 className="font-black text-red-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Settings size={18} />
            Luật sòng bài
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={ruleType === RuleType.NONE}
                  onChange={() => setRuleType(RuleType.NONE)}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">Tới bến (Không giới hạn)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={ruleType === RuleType.ROUND_LIMIT}
                  onChange={() => setRuleType(RuleType.ROUND_LIMIT)}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">Số ván chơi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={ruleType === RuleType.SCORE_LIMIT}
                  onChange={() => setRuleType(RuleType.SCORE_LIMIT)}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">Điểm giới hạn</span>
              </label>
            </div>
            
            {ruleType !== RuleType.NONE && (
              <div className="flex items-center gap-3 animate-in slide-in-from-left duration-300">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-tight">Kết thúc khi đạt:</span>
                <input 
                  type="number" 
                  value={ruleValue}
                  onChange={(e) => setRuleValue(Number(e.target.value))}
                  className="w-24 px-4 py-2 bg-white border-2 border-red-100 rounded-xl outline-none font-black text-red-600 text-center shadow-sm"
                />
                <span className="text-sm font-bold text-gray-600 uppercase tracking-tight">{ruleType === RuleType.ROUND_LIMIT ? 'VÁN' : 'ĐIỂM'}</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Save size={24} />
          Bắt Đầu Sát Phạt!
        </button>
      </div>
    </div>
  );
};

export default CreateTable;
