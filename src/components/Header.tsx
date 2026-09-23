import React from 'react';
import {
  GraduationCap,
  FileText,
  MessageSquare,
  BookmarkCheck,
  Download,
  Printer,
  PlusCircle,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';

interface HeaderProps {
  activeTab: 'lesson' | 'chat' | 'saved';
  setActiveTab: (tab: 'lesson' | 'chat' | 'saved') => void;
  currentLesson: LessonPlan | null;
  onOpenQuickCreator: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLesson,
  onOpenQuickCreator,
  savedCount,
}) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportDocx = async () => {
    if (!currentLesson) return;
    try {
      setIsExporting(true);
      const blob = await generateDocxBlob(currentLesson);
      const safeName = (currentLesson.subiectulLectiei || 'schita_de_lectie')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 35);
      downloadBlob(blob, `Schita_Lectie_${safeName}.docx`);
    } catch (err) {
      console.error('Eroare export docx:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!currentLesson) return;
    setActiveTab('lesson');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <header className="no-print bg-white border-b border-stone-200 shadow-2xs sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Titlu */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
              Metodist Învățământ Primar
            </h1>
            <p className="text-xs text-stone-500">
              Prof. Neacsu Roxana · An școlar 2026 - 2027
            </p>
          </div>
        </div>

        {/* Butoane Navigare Simple */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'lesson'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Schiță de Lecție</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Asistent Didactic</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Schițe salvate"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Colecție</span>
            {savedCount > 0 && (
              <span className="ml-0.5 text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {/* Acțiuni Rapide */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickCreator}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Lecție Nouă</span>
            <span className="sm:hidden">Nou</span>
          </button>

          {currentLesson && (
            <>
              <button
                onClick={handleExportDocx}
                disabled={isExporting}
                title="Descarcă fișierul Word formatat"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-700" />
                <span>Word (.docx)</span>
              </button>

              <button
                onClick={handlePrint}
                title="Tipărește sau salvează PDF"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
