
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Users, Calendar, Trophy, Plus } from 'lucide-react';
import { Table } from '../types';

interface Props {
  tables: Table[];
  onDelete: (id: string) => void;
}

const TableList: React.FC<Props> = ({ tables, onDelete }) => {
  const navigate = useNavigate();

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🧧</div>
        <h2 className="text-2xl font-bold text-gray-800">Chưa có bàn chơi nào</h2>
        <p className="text-gray-500 mt-2 mb-6">Hãy tạo bàn mới để bắt đầu cuộc vui!</p>
        <Link 
          to="/create" 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
          Tạo Bàn Ngay
        </Link>
      </div>
    );
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn click lan lên thẻ cha
    onDelete(id);
  };

  const handleCardClick = (id: string) => {
    navigate(`/table/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-black text-red-800 flex items-center gap-2 uppercase tracking-tight">
          <Trophy size={20} className="text-yellow-600" />
          Bàn chơi xuân này 🌸
        </h2>
        <Link to="/create" className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-red-200 transition-colors">
          + Tạo mới
        </Link>
      </div>
      
      {tables.map(table => (
        <div 
          key={table.id} 
          className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border-2 border-red-50 hover:border-red-200 hover:shadow-md transition-all relative cursor-pointer active:scale-[0.98]"
          onClick={() => handleCardClick(table.id)}
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-800 mb-2">{table.name}</h3>
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-red-400" />
                    {new Date(table.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-red-400" />
                    {table.players.length} NGƯỜI
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy size={14} className="text-red-400" />
                    {table.rounds.length} VÁN
                  </div>
                </div>
              </div>
              
              {/* Nút Xóa Độc Lập */}
              <button 
                onClick={(e) => handleDelete(e, table.id)}
                className="bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-600 p-3 rounded-2xl transition-all shadow-sm"
                title="Xóa bàn"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-red-50 flex justify-between items-center">
              <div className="flex -space-x-3">
                {table.players.slice(0, 5).map((p) => (
                  <div key={p.id} className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-red-50">
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                ))}
                {table.players.length > 5 && (
                  <div className="w-9 h-9 rounded-2xl bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500 shadow-sm ring-2 ring-red-50">
                    +{table.players.length - 5}
                  </div>
                )}
              </div>
              <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-lg shadow-red-200 active:bg-red-700 transition-colors">
                Uýnh Tiếp &rarr;
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;
