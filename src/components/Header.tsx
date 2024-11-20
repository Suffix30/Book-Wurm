import React from 'react';
import { Book, Search, Menu, X, RefreshCw } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  isSidebarOpen, 
  toggleSidebar,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="bg-cyber-darkGray shadow-cyber border-b border-cyber-cyan/20 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-cyber-darkGray/50 text-cyber-cyan"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center space-x-2">
          <Book className="h-8 w-8 text-cyber-cyan" />
          <h1 className="text-xl font-bold text-cyber-cyan cyber-glow">BookWurm</h1>
        </div>
      </div>
      
      <div className="max-w-xl flex-1 mx-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-cyan h-5 w-5" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-cyan/30 rounded-lg 
                      focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan/50 
                      text-cyber-gray placeholder-cyber-gray/50"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan/60 
                     hover:shadow-cyber disabled:opacity-50 disabled:cursor-not-allowed
                     text-cyber-cyan transition-all duration-200"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};