import React from 'react';

interface HeaderProps {
  onOpenManual: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenManual }) => {
  return (
    <header className="flex-shrink-0 bg-slate-800/50 p-4 border-b border-slate-700 flex items-center justify-between">
      {/* Invisible placeholder for centering */}
      <div className="w-8 h-8"></div>
      
      <div className="text-center">
        <h1 className="text-xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            Yeobaek Image Showcase
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          텍스트 추가 입력을 했다면 'AI 프롬프트 제안'을 클릭한 후 CASE 별 프롬프트가 변경된 후 결과물을 생성하세요.
        </p>
      </div>

      <button
        onClick={onOpenManual}
        className="w-8 h-8 flex items-center justify-center bg-slate-700/50 hover:bg-violet-600 rounded-full transition-colors"
        aria-label="사용 가이드 열기"
        title="사용 가이드"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </header>
  );
};

export default Header;