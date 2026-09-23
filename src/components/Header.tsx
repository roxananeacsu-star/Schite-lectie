import React from 'react';
import {
  GraduationCap,
  FileText,
  MessageSquare,
  BookmarkCheck,
  Download,
  Printer,
  Sparkles,
  BookOpenCheck,
  PlusCircle,
  Wand2,
  BookOpen,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';
import { SAMPLE_LESSON_PLANS } from '../data/curriculumData';

interface HeaderProps {
  activeTab: 'chat' | 'lesson' | 'template' | 'saved';
  setActiveTab: (tab: 'chat' | 'lesson' | 'template' | 'saved') => void;
  currentLesson: LessonPlan | null;
  onOpenQuickCreator: () => void;
  onSelectSampleLesson: (lesson: LessonPlan) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLesson,
  onOpenQuickCreator,
  onSelectSampleLesson,
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
    }, 250);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Methodologist Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-stone-900 tracking-tight">
                  Metodist Primar
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Clasa Pregătitoare – IV
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Profesorul Neacsu Roxana · An școlar 2026 - 2027
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Consultanță & Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('lesson')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'lesson'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Schiță de Lecție</span>
              {currentLesson && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('template')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'template'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpenCheck className="w-4 h-4 text-emerald-600" />
              <span>Format Oficial DOCX</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-blue-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Colecție</span>
              {savedCount > 0 && (
                <span className="bg-stone-200 text-stone-700 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Generator Button */}
            <button
              onClick={onOpenQuickCreator}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Generează Rapid</span>
              <span className="sm:hidden">Nou</span>
            </button>

            {currentLesson && (
              <>
                <button
                  onClick={handleExportDocx}
                  disabled={isExporting}
                  title="Descarcă fișierul Word conform formatului schițe de lecție.docx"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  <span>Word (.docx)</span>
                </button>

                <button
                  onClick={handlePrint}
                  title="Tipărește sau salvează PDF"
                  className="hidden sm:flex items-center gap-1.5 p-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sub-bar: Instant Samples from Roxana Neacsu */}
        <div className="py-1.5 border-t border-stone-100 flex items-center justify-between text-xs overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0 text-stone-500 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Schițe oficiale rapide:</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {SAMPLE_LESSON_PLANS.map((plan) => {
              const isSelected = currentLesson?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => {
                    onSelectSampleLesson(plan);
                    setActiveTab('lesson');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300 shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {plan.subiectulLectiei}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-[11px] text-stone-400">
            Format: <strong className="text-stone-600 ml-1">schițe de lecție.docx</strong>
          </div>
        </div>
      </div>
    </header>
  );
};
