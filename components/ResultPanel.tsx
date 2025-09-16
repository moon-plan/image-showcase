import React, { useState } from 'react';

interface ResultPanelProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ imageUrl, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    
    // Extract file extension from mime type for a better filename
    try {
        const mimeType = imageUrl.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1] || 'png';
        link.download = `yeobaek-image-result.${extension}`;
    } catch (e) {
        link.download = `yeobaek-image-result.png`;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-slate-800/50 rounded-lg h-full flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">결과물</h2>
        </div>
        <div className="flex-grow p-4 flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-400 mx-auto"></div>
              <p className="mt-4 text-slate-300">✨ 멋진 이미지를 생성하고 있어요...</p>
              <p className="text-sm text-slate-500">잠시만 기다려주세요.</p>
            </div>
          ) : imageUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-between gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex-grow flex items-center justify-center overflow-hidden cursor-zoom-in group"
                    aria-label="결과물 확대"
                >
                    <img
                        src={imageUrl}
                        alt="Generated result"
                        className="max-w-full max-h-full object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                </button>
                <div className="flex-shrink-0">
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        aria-label="결과물 다운로드"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>다운로드</span>
                    </button>
                </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4">생성된 이미지가 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && imageUrl && (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setIsModalOpen(false)}
        >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={imageUrl} 
                    alt="Enlarged result" 
                    className="block max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <button 
                    className="absolute -top-3 -right-3 text-white bg-slate-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/80 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="닫기"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
      )}
    </>
  );
};

export default ResultPanel;