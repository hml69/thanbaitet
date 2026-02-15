
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Plus, AlertCircle, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Table, Round, Player } from '../types';
import Dashboard from './Dashboard';
import HistoryList from './HistoryList';
import RoundForm from './RoundForm';

interface Props {
  tables: Table[];
  onUpdate: (table: Table) => void;
}

const TableDetail: React.FC<Props> = ({ tables, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);

  const table = useMemo(() => tables.find(t => t.id === id), [tables, id]);

  if (!table) return <div className="p-10 text-center">Bàn chơi không tồn tại.</div>;

  // Calculate scores
  const playerScores = useMemo(() => {
    const scores: Record<string, number> = {};
    table.players.forEach(p => scores[p.id] = 0);
    table.rounds.forEach(r => {
      Object.entries(r.scores).forEach(([pid, val]) => {
        scores[pid] = (scores[pid] || 0) + (val as number);
      });
    });
    return scores;
  }, [table]);

  const handleAddRound = (round: Round) => {
    if (editingRound) {
      onUpdate({
        ...table,
        rounds: table.rounds.map(r => r.id === editingRound.id ? round : r)
      });
      toast.success("Đã cập nhật ván bài! 🃏");
    } else {
      onUpdate({
        ...table,
        rounds: [...table.rounds, round]
      });
      toast.success("Đã thêm ván bài mới! 🎴");
    }
    setShowAddModal(false);
    setEditingRound(null);
  };

  const handleDeleteRound = (roundId: string) => {
    Swal.fire({
      title: 'Xoá ván này?',
      text: "Xoá rồi là không tính điểm ván này nữa đâu nhé! 🧨",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xoá đi!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdate({
          ...table,
          rounds: table.rounds.filter(r => r.id !== roundId)
        });
        toast.info("Đã xóa ván bài.");
      }
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-red-800 uppercase tracking-tight">{table.name}</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{table.players.length} người chơi • {table.rounds.length} ván đã uýnh</p>
        </div>
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm border-2 border-red-50 p-1.5 mb-6 sticky top-16 z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-red-400'}`}
        >
          <LayoutDashboard size={18} />
          Bảng Điểm
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-red-400'}`}
        >
          <History size={18} />
          Lịch Sử
        </button>
      </div>

      <div className="mt-4 pb-20">
        {activeTab === 'dashboard' ? (
          <Dashboard table={table} playerScores={playerScores} />
        ) : (
          <HistoryList 
            rounds={table.rounds} 
            players={table.players} 
            onEdit={(r) => { setEditingRound(r); setShowAddModal(true); }} 
            onDelete={handleDeleteRound} 
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => { setEditingRound(null); setShowAddModal(true); }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-red-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-red-700 hover:scale-110 active:scale-95 transition-all z-50 border-4 border-white"
      >
        <Plus size={32} />
      </button>

      {/* Modal for adding/editing rounds */}
      {showAddModal && (
        <div className="fixed inset-0 bg-red-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <RoundForm 
              players={table.players} 
              onSave={handleAddRound} 
              onCancel={() => { setShowAddModal(false); setEditingRound(null); }} 
              initialRound={editingRound}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDetail;
