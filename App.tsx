
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Trophy, PlusCircle, Settings, Trash2, ChevronLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Table, GameState } from './types';
import TableList from './components/TableList';
import TableDetail from './components/TableDetail';
import CreateTable from './components/CreateTable';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('than-bai-tet-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.tables ? parsed : { tables: [] };
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu từ localStorage:", e);
    }
    return { tables: [] };
  });

  useEffect(() => {
    localStorage.setItem('than-bai-tet-state', JSON.stringify(state));
  }, [state]);

  const addTable = (table: Table) => {
    setState(prev => ({ ...prev, tables: [table, ...prev.tables] }));
    toast.success(`Đã tạo bàn "${table.name}" thành công! 🧧`);
  };

  const updateTable = (updatedTable: Table) => {
    setState(prev => ({
      ...prev,
      tables: prev.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
    }));
  };

  const deleteTable = (id: string) => {
    const tableToDelete = state.tables.find(t => t.id === id);
    
    Swal.fire({
      title: 'Xoá bàn chơi?',
      text: `Bạn có chắc muốn xoá "${tableToDelete?.name}"? Toàn bộ nợ nần sẽ mất trắng đó! 🧨`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xoá luôn!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        setState(prev => ({
          ...prev,
          tables: prev.tables.filter(t => t.id !== id)
        }));
        toast.info(`Đã xoá bàn chơi. 🧨`);
      }
    });
  };

  return (
    <HashRouter>
      <div className="min-h-screen pb-20 md:pb-0 md:pl-0">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Header */}
        <header className="tet-gradient text-white p-4 shadow-lg sticky top-0 z-50 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧧</span>
            <h1 className="text-xl font-bold tracking-tight">Thần Bài Tết</h1>
          </Link>
          <div className="flex gap-4">
            <span className="animate-bounce">🌸</span>
            <span className="animate-pulse">🧨</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<TableList tables={state.tables} onDelete={deleteTable} />} />
            <Route path="/create" element={<CreateTable onAdd={addTable} />} />
            <Route path="/table/:id" element={<TableDetail tables={state.tables} onUpdate={updateTable} />} />
          </Routes>
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 md:hidden z-50">
          <Link to="/" className="flex flex-col items-center text-red-600">
            <Home size={24} />
            <span className="text-xs mt-1">Trang chủ</span>
          </Link>
          <Link to="/create" className="flex flex-col items-center text-red-600">
            <PlusCircle size={24} />
            <span className="text-xs mt-1">Tạo bàn</span>
          </Link>
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;
