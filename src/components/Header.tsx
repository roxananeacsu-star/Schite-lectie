import React from 'react';
import {
  GraduationCap,
  FileText,
  MessageSquare,
  BookmarkCheck,
  Download,
  Printer,
  PlusCircle,
  Paperclip,
  Columns,
  FileDown,
  RotateCcw,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';
import { downloadLessonPlanPdf } from '../utils/pdfExport';

interface HeaderProps {
  activeTab: 'lesson' | 'chat' | 'saved';
  setActiveTab: (tab: 'lesson' | 'chat' | 'saved') => void;
  currentLesson: LessonPlan | null;
  onOpenQuickCreator: () => void;
  savedCount: number;
  isSplitView?: boolean;
  onToggleSplitView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLesson,
  onOpenQuickCreator,
  savedCount,
  isSplitView = false,
  onToggleSplitView,
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

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

  const handleExportPdf = async () => {
    if (!currentLesson) return;
    try {
      setIsExportingPdf(true);
      setActiveTab('lesson');
      setTimeout(async () => {
        try {
          await downloadLessonPlanPdf(currentLesson, 'lesson-plan-document');
        } catch (err) {
          window.print();
        } finally {
          setIsExportingPdf(false);
        }
      }, 250);
    } catch (err) {
      setIsExportingPdf(false);
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
    <header className="no-print bg-white border-b border-stone-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Titlu */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs hover:shadow-sm hover:scale-[1.02] transition-all duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
              Metodist Învățământ Primar
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block">
              Prof. Neacsu Roxana · An școlar 2026 - 2027
            </p>
          </div>
        </div>

        {/* Butoane Navigare Principale (Schiță, Chat & Resurse, Colecție) */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 shadow-2xs">
          {/* Tab Schiță de Lecție */}
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'lesson'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Schiță de Lecție</span>
            <span className="sm:hidden">Schiță</span>
          </button>

          {/* Tab Chat & Resurse (Atașează Fișiere) - EVIDENȚIAT */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
            }`}
            title="Deschide Chat-ul metodic cu posibilitatea de a atașa imagini din manual sau documente resursă"
          >
            <div className="relative flex items-center">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <Paperclip className="w-3 h-3 text-blue-600 -ml-1 -mt-1 font-bold" />
            </div>
            <span>Chat & Resurse</span>
            <span className="hidden md:inline-block text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.2 rounded-full border border-blue-200">
              Atașează fișiere
            </span>
          </button>

          {/* Tab Colecție / Schițe Salvate */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
            title="Schițe salvate"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Colecție</span>
            {savedCount > 0 && (
              <span className="text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {/* Buton Ecran Împărțit (Schiță + Chat) & Acțiuni Rapide */}
        <div className="flex items-center gap-2">
          {/* Toggle Ecran Împărțit pentru ecrane medii/mari */}
          {onToggleSplitView && (
            <button
              onClick={onToggleSplitView}
              title={
                isSplitView
                  ? 'Comută la vizualizare filă unică'
                  : 'Afișează simultan Schița de Lecție și Chat-ul cu fișiere pe ecran împărțit'
              }
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                isSplitView
                  ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                  : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50 hover:border-stone-400 hover:shadow-2xs hover:-translate-y-0.5'
              } active:translate-y-0`}
            >
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSplitView ? 'Ecran Împărțit' : 'Schiță + Chat alăturat'}</span>
            </button>
          )}

          {/* Buton Lecție Nouă cu opțiune atașare resurse */}
          <button
            onClick={onOpenQuickCreator}
            title="Proiectează o schiță nouă cu opțiune de atașare fișiere (foto manual, programă PDF, fișe)"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <Paperclip className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden md:inline">Lecție Nouă (+ Resurse)</span>
            <span className="md:hidden">Lecție Nouă</span>
          </button>

          {currentLesson && (
            <>
              <button
                onClick={handleExportDocx}
                disabled={isExporting}
                title="Descarcă fișierul Word formatat (.docx)"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-400 border border-stone-300 rounded-xl shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-700" />
                <span>Word</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                title="Descarcă schița de lecție în format PDF (.pdf)"
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <RotateCcw className="w-4 h-4 animate-spin text-red-600" />
                ) : (
                  <FileDown className="w-4 h-4 text-red-600" />
                )}
                <span>PDF</span>
              </button>

              <button
                onClick={handlePrint}
                title="Tipărește sau salvează PDF"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 hover:border-stone-400 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
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
