import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Case, UploadedImage } from './types';
import { categories } from './constants/cases';
import CaseList from './components/CaseList';
import EditorPanel from './components/EditorPanel';
import ResultPanel from './components/ResultPanel';
import { generateImage, suggestPrompt } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import ManualModal from './components/ManualModal';

const App: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case>(categories[0].cases[0]);
  const [uploadedImages, setUploadedImages] = useState<(UploadedImage | null)[]>([]);
  const [prompt, setPrompt] = useState<string>(selectedCase.prompt);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalPromptText, setAdditionalPromptText] = useState<string>('');
  const [isSuggestingPrompt, setIsSuggestingPrompt] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);

  // --- Resizable Panel Logic ---
  const mainContainerRef = useRef<HTMLElement>(null);
  const [panelWidths, setPanelWidths] = useState({ left: 25, right: 25 });
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches
  );
  const resizingRef = useRef<{
    resizer: 'left' | 'right';
    startX: number;
    startWidths: { left: number; right: number };
  } | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsLargeScreen(e.matches);
      if (!e.matches) {
        // Reset widths on small screen for original layout
        setPanelWidths({ left: 25, right: 25 });
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current || !mainContainerRef.current) return;
    e.preventDefault();

    const { startX, startWidths, resizer } = resizingRef.current;
    const dx = e.clientX - startX;
    const containerWidth = mainContainerRef.current.offsetWidth;
    const dxPercent = (dx / containerWidth) * 100;

    const minWidth = 15; // Minimum percentage width for side panels

    if (resizer === 'left') {
      const newLeftWidth = startWidths.left + dxPercent;
      const maxLeftWidth = 100 - startWidths.right - minWidth;
      const clampedLeftWidth = Math.max(minWidth, Math.min(newLeftWidth, maxLeftWidth));
      setPanelWidths(prev => ({ ...prev, left: clampedLeftWidth }));
    } else { // 'right'
      const newRightWidth = startWidths.right - dxPercent;
      const maxRightWidth = 100 - startWidths.left - minWidth;
      const clampedRightWidth = Math.max(minWidth, Math.min(newRightWidth, maxRightWidth));
      setPanelWidths(prev => ({ ...prev, right: clampedRightWidth }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    resizingRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  const handleMouseDown = (e: React.MouseEvent, resizer: 'left' | 'right') => {
    if (!isLargeScreen) return;
    e.preventDefault();

    resizingRef.current = {
      resizer,
      startX: e.clientX,
      startWidths: panelWidths,
    };
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  // --- End Resizable Panel Logic ---

  useEffect(() => {
    setPrompt(selectedCase.prompt);
    setUploadedImages(Array(selectedCase.imageUploads).fill(null));
    setResultImageUrl(null);
    setError(null);
    setAdditionalPromptText('');
  }, [selectedCase]);
  
  const handleImageUpload = (image: UploadedImage | null, index: number) => {
    setUploadedImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = image;
      return newImages;
    });
  };

  const handleGenerate = useCallback(async () => {
    if (selectedCase.imageUploads > 0 && uploadedImages.some(img => img === null)) {
      setError('이 케이스는 이미지 업로드가 필요합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const imageUrl = await generateImage(prompt, uploadedImages);
      setResultImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, selectedCase, uploadedImages]);

  const handleSuggestPrompt = useCallback(async () => {
    if (!additionalPromptText && uploadedImages.every(img => img === null)) {
      setError('AI 제안을 위해 추가 입력이나 이미지를 제공해주세요.');
      return;
    }

    setIsSuggestingPrompt(true);
    setError(null);

    try {
      const suggestedPrompt = await suggestPrompt(prompt, additionalPromptText, uploadedImages);
      setPrompt(suggestedPrompt);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '프롬프트 제안 중 오류가 발생했습니다.');
    } finally {
      setIsSuggestingPrompt(false);
    }
  }, [prompt, additionalPromptText, uploadedImages]);


  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans">
      <Header onOpenManual={() => setIsManualOpen(true)} />
      <main ref={mainContainerRef} className="flex-grow flex flex-col lg:flex-row p-4 overflow-hidden">
        <div
          className="w-full lg:w-auto h-1/3 lg:h-full flex-shrink-0"
          style={isLargeScreen ? { flexBasis: `${panelWidths.left}%` } : {}}
        >
          <CaseList
            categories={categories}
            selectedCaseId={selectedCase.id}
            onSelectCase={setSelectedCase}
          />
        </div>

        <div
            onMouseDown={(e) => handleMouseDown(e, 'left')}
            className="flex-shrink-0 w-2 mx-2 h-auto cursor-col-resize rounded-full bg-slate-800/50 hover:bg-violet-600 transition-colors hidden lg:flex items-center justify-center group"
            aria-label="Resize left panel"
            role="separator"
            aria-orientation="vertical"
        >
            <div className="w-px h-8 bg-slate-600 group-hover:bg-violet-300"></div>
        </div>

        <div className="flex-grow w-full lg:w-auto min-w-0 h-2/3 lg:h-full flex flex-col gap-4 my-4 lg:my-0">
          <EditorPanel
            selectedCase={selectedCase}
            prompt={prompt}
            setPrompt={setPrompt}
            onImageUpload={handleImageUpload}
            uploadedImages={uploadedImages}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            additionalPromptText={additionalPromptText}
            setAdditionalPromptText={setAdditionalPromptText}
            onSuggestPrompt={handleSuggestPrompt}
            isSuggestingPrompt={isSuggestingPrompt}
          />
           {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex-shrink-0">
              <p><strong className="font-bold">오류:</strong> {error}</p>
            </div>
          )}
        </div>

        <div
            onMouseDown={(e) => handleMouseDown(e, 'right')}
            className="flex-shrink-0 w-2 mx-2 h-auto cursor-col-resize rounded-full bg-slate-800/50 hover:bg-violet-600 transition-colors hidden lg:flex items-center justify-center group"
            aria-label="Resize right panel"
            role="separator"
            aria-orientation="vertical"
        >
            <div className="w-px h-8 bg-slate-600 group-hover:bg-violet-300"></div>
        </div>

        <div
          className="w-full lg:w-auto h-1/3 lg:h-full flex-shrink-0"
          style={isLargeScreen ? { flexBasis: `${panelWidths.right}%` } : {}}
        >
          <ResultPanel imageUrl={resultImageUrl} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};

export default App;