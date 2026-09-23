import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  FileDown,
  Trash2,
  Eye,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';

interface SavedPlansViewProps {
  savedPlans: LessonPlan[];
  onOpenLesson: (lesson: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  savedPlans,
  onOpenLesson,
  onDeletePlan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const filteredPlans = savedPlans.filter((plan) => {
    const matchesSearch =
      (plan.subiectulLectiei || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.disciplina || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.clasa || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      selectedClass === 'all' ||
      (plan.clasa || '').toLowerCase().includes(selectedClass.toLowerCase());

    return matchesSearch && matchesClass;
  });

  const handleExport = async (e: React.MouseEvent, plan: LessonPlan) => {
    e.stopPropagation();
    try {
      const blob = await generateDocxBlob(plan);
      const safeName = (plan.subiectulLectiei || 'schita_lectie')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      downloadBlob(blob, `Schita_Lectie_${safeName}.docx`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-stone-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
              <BookmarkCheck className="w-4 h-4" /> Colecție Personală
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Schițe de Lecție Salvate
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Toate schițele proiectate sunt păstrate în siguranță pe dispozitivul
              dumneavoastră.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-stone-100 rounded-lg text-stone-700">
            Total: {savedPlans.length} schițe
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Caută după subiect, disciplină sau clasă..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">Toate clasele</option>
            <option value="Pregătitoare">Clasa Pregătitoare</option>
            <option value="I">Clasa I</option>
            <option value="II">Clasa a II-a</option>
            <option value="III">Clasa a III-a</option>
            <option value="IV">Clasa a IV-a</option>
          </select>
        </div>

        {/* List of Cards */}
        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <GraduationCap className="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <h3 className="font-bold text-stone-800 text-base">
              Nicio schiță de lecție găsită
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Generați o schiță nouă în panoul de chat sau salvați schița activă
              apăsând butonul „Salvează”.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onOpenLesson(plan)}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {plan.clasa}
                    </span>
                    <span className="font-medium text-stone-600 truncate max-w-[180px]">
                      {plan.disciplina}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 mt-1">
                    {plan.subiectulLectiei}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{plan.data || 'Nedatată'}</span>
                    <span>·</span>
                    <span>{plan.durata || '45-50 min'}</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
                    <span className="font-medium">
                      {plan.obiectiveOperationale?.length || 0} obiective
                    </span>
                    <span>·</span>
                    <span>
                      {plan.activitatiPlanificate?.length || 0} etape
                    </span>
                    {plan.feedbackFinal?.jocuriDigitaleSiInteractive && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">Activitate Ludică</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Deschide schița
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleExport(e, plan)}
                      title="Descarcă direct în Word (.docx)"
                      className="p-1.5 bg-stone-100 hover:bg-blue-50 hover:text-blue-700 text-stone-700 rounded-lg text-xs shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Sigur doriți să ștergeți schița "${plan.subiectulLectiei}"?`)) {
                          onDeletePlan(plan.id);
                        }
                      }}
                      title="Șterge din colecție"
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs hover:shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
