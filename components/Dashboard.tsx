
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Medal, TrendingDown, User, AlertCircle } from 'lucide-react';
import { Table, Player } from '../types';

interface Props {
  table: Table;
  playerScores: Record<string, number>;
}

const Dashboard: React.FC<Props> = ({ table, playerScores }) => {
  const chartData = table.players.map(p => ({
    name: p.name,
    score: playerScores[p.id] || 0
  }));

  const sortedPlayers = [...table.players].sort((a, b) => 
    (playerScores[b.id] || 0) - (playerScores[a.id] || 0)
  );

  return (
    <div className="space-y-6">
      {/* Ranking Section */}
      <div className="bg-white rounded-2xl shadow-md border border-red-50 p-6">
        <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          Bảng Vàng Đại Gia 🧧
        </h3>
        <div className="space-y-3">
          {sortedPlayers.map((player, idx) => {
            const score = playerScores[player.id] || 0;
            const isWinner = idx === 0 && score > 0;
            const isLoser = idx === sortedPlayers.length - 1 && score < 0;

            return (
              <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl border ${idx === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-yellow-400 text-white' : 
                    idx === 1 ? 'bg-gray-300 text-white' : 
                    idx === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-gray-800">{player.name}</span>
                  {isWinner && <span className="text-sm bg-yellow-400 text-white px-2 py-0.5 rounded-full animate-pulse">Đại Gia</span>}
                  {isLoser && <span className="text-sm bg-gray-500 text-white px-2 py-0.5 rounded-full">Sát Nghiệp</span>}
                </div>
                <div className={`text-xl font-black ${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {score > 0 ? `+${score}` : score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-md border border-red-50 p-6">
        <h3 className="text-lg font-bold text-red-800 mb-6 flex items-center gap-2">
          <TrendingDown size={20} className="text-blue-500" />
          Biểu đồ tài lộc
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                cursor={{ fill: '#fee2e2' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Table Status / Rules Info */}
      {table.rules.type !== 'NONE' && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <AlertCircle className="text-blue-500" />
          <div>
            <p className="font-semibold text-blue-900">Quy tắc bàn chơi:</p>
            <p className="text-sm text-blue-700">
              {table.rules.type === 'ROUND_LIMIT' 
                ? `Kết thúc sau ${table.rules.value} ván (Hiện tại: ${table.rounds.length})`
                : `Kết thúc khi có người đạt ${table.rules.value} điểm`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
