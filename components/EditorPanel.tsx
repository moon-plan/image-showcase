import React from 'react';
import type { Case, UploadedImage } from '../types';
import ImageUploader from './ImageUploader';

interface EditorPanelProps {
  selectedCase: Case;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onImageUpload: (image: UploadedImage | null, index: number) => void;
  uploadedImages: (UploadedImage | null)[];
  onGenerate: () => void;
  isLoading: boolean;
  additionalPromptText: string;
  setAdditionalPromptText: (text: string) => void;
  onSuggestPrompt: () => void;
  isSuggestingPrompt: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  selectedCase,
  prompt,
  setPrompt,
  onImageUpload,
  uploadedImages,
  onGenerate,
  isLoading,
  additionalPromptText,
  setAdditionalPromptText,
  onSuggestPrompt,
  isSuggestingPrompt,
}) => {
  const isGenerateDisabled = isLoading || (selectedCase.imageUploads > 0 && uploadedImages.some(img => img === null));

  return (
    <div className="bg-slate-800/50 rounded-lg h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-lg font-semibold">{selectedCase.name}</h2>
            <div className="flex items-center gap-3 flex-shrink-0">
              {selectedCase.author && (
                <span className="text-sm text-slate-400 font-mono">by {selectedCase.author}</span>
              )}
              {selectedCase.href && (
                <a
                  href={selectedCase.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-violet-400 transition-colors"
                  aria-label="View case source"
                  title="View case source"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">{selectedCase.description}</p>
        </div>

        <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
            {selectedCase.imageUploads > 0 && (
                <div className="flex-shrink-0">
                    <h3 className="text-md font-semibold mb-2 text-slate-300">이미지 업로드</h3>
                    <div className={`grid ${selectedCase.imageUploads > 1 ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                        {Array.from({ length: selectedCase.imageUploads }).map((_, index) => (
                            <div key={index}>
                                {selectedCase.imageUploads > 1 && (
                                    <p className="text-sm text-center mb-1 text-slate-400">이미지 {index + 1}</p>
                                )}
                                <ImageUploader
                                    onImageUpload={(image) => onImageUpload(image, index)}
                                    uploadedImage={uploadedImages[index] || null}
                                    uploaderId={`file-upload-${index}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="flex flex-col">
                <h3 className="text-md font-semibold mb-2 text-slate-300">추가 입력</h3>
                <textarea
                    value={additionalPromptText}
                    onChange={(e) => setAdditionalPromptText(e.target.value)}
                    className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200 resize-none"
                    placeholder={selectedCase.suggestionHint || "AI가 프롬프트를 개선하는 데 도움이 될 지시사항을 입력하세요. (예: '캐릭터를 웃게 만들어주세요')"}
                    rows={3}
                />
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-slate-300">CASE 별 프롬프트</h3>
                    <button
                        onClick={onSuggestPrompt}
                        disabled={isSuggestingPrompt}
                        className="flex items-center gap-2 text-sm bg-sky-600/50 hover:bg-sky-500/50 text-sky-200 font-semibold py-1 px-3 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        aria-label="AI 프롬프트 제안 받기"
                    >
                        {isSuggestingPrompt ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        )}
                        <span>AI 프롬프트 제안</span>
                    </button>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full flex-grow p-3 bg-slate-900/70 border border-slate-700 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all duration-200 resize-none"
                    placeholder="Enter your prompt here..."
                />
            </div>
        </div>

        <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <button
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            className="w-full bg-violet-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                생성 중...
                </>
            ) : '결과물 생성'}
            </button>
        </div>
    </div>
  );
};

export default EditorPanel;