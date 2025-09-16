import React from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-title"
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 id="manual-title" className="text-lg font-semibold text-violet-400">
            Yeobaek Image Showcase 사용 가이드
          </h2>
          <button
            className="text-slate-400 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="가이드 닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto text-slate-300 space-y-6">
          <section>
            <h3 className="text-xl font-bold text-slate-100 mb-2">개요</h3>
            <p className="leading-relaxed">
              이 애플리케이션은 Gemini Nano Banana 모델의 다양한 이미지 생성 및 편집 사용 사례를 시연하기 위해 제작되었습니다. 왼쪽 목록에서 원하는 사례를 선택하고, 필요에 따라 이미지를 업로드하거나 프롬프트를 수정하여 창의적인 결과물을 만들어보세요.
            </p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-slate-100 mb-2">주요 특징</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-violet-300">다양한 사례 제공:</strong> 인물, 사물, 배경 등 다양한 카테고리의 150개 이상의 사례를 탐색할 수 있습니다.
              </li>
              <li>
                <strong className="text-violet-300">이미지 기반 프롬프트:</strong> 이미지를 업로드하여 텍스트 프롬프트와 함께 사용함으로써 더욱 정교하고 구체적인 결과물을 생성할 수 있습니다.
              </li>
              <li>
                <strong className="text-violet-300">AI 프롬프트 제안:</strong> 사용자의 추가 지시사항이나 업로드된 이미지를 바탕으로 AI가 기존 프롬프트를 개선하고 새로운 아이디어를 제안합니다.
              </li>
              <li>
                <strong className="text-violet-300">반응형 레이아웃:</strong> 데스크톱에서는 3단 패널 레이아웃으로 넓게, 모바일에서는 유연한 레이아웃으로 편리하게 사용할 수 있습니다. (데스크톱에서는 패널 크기 조절 가능)
              </li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-bold text-slate-100 mb-2">사용법</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong className="font-semibold">사례 선택:</strong> 왼쪽 'CASE LIST'에서 원하는 사용 사례를 클릭합니다.</li>
              <li><strong className="font-semibold">이미지 업로드 (필요시):</strong> '이미지 업로드' 영역을 클릭하거나 파일을 드래그 앤 드롭하여 이미지를 추가합니다. 사례에 따라 1개 또는 2개의 이미지가 필요할 수 있습니다.</li>
              <li><strong className="font-semibold">프롬프트 수정/제안:</strong> 중앙 'Editor Panel'에서 기본 프롬프트를 확인하고 필요에 따라 수정할 수 있습니다. '추가 입력'란에 지시사항을 넣고 'AI 프롬프트 제안' 버튼을 눌러 새로운 프롬프트를 받을 수도 있습니다.</li>
              <li><strong className="font-semibold">결과물 생성:</strong> '결과물 생성' 버튼을 클릭하여 AI가 이미지를 생성하도록 합니다. 생성이 완료되면 오른쪽 '결과물' 패널에 이미지가 표시됩니다.</li>
              <li><strong className="font-semibold">결과 확인 및 다운로드:</strong> 생성된 이미지를 클릭하여 확대하거나 '다운로드' 버튼으로 저장할 수 있습니다.</li>
            </ol>
          </section>
        </main>
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
  );
};

export default ManualModal;