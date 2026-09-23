import React, { useState } from 'react';
import {
  Download,
  Printer,
  Edit3,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Gamepad2,
  ExternalLink,
  BookOpen,
  Copy,
  MessageSquare,
  AlertTriangle,
  Send,
  X,
  PlusCircle,
  HelpCircle,
  Paperclip,
  FileDown,
} from 'lucide-react';
import { LessonPlan, LessonStage } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';
import { downloadLessonPlanPdf } from '../utils/pdfExport';
import { PRIMARY_GRADES, PRIMARY_SUBJECTS, LESSON_TYPES } from '../data/curriculumData';
import { ensureGameActivity } from '../utils/gameGenerator';
import { InteractiveGameModal } from './InteractiveGameModal';

interface LessonPlanViewProps {
  lesson: LessonPlan | null;
  onUpdateLesson: (updated: LessonPlan) => void;
  onSaveToHistory: (lesson: LessonPlan) => void;
  onDeleteLesson: () => void;
  onRegenerateLesson: (instruction?: string) => Promise<void> | void;
  isRegenerating?: boolean;
  onOpenQuickCreator: () => void;
  onSwitchToChat: () => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  lesson,
  onUpdateLesson,
  onSaveToHistory,
  onDeleteLesson,
  onRegenerateLesson,
  isRegenerating = false,
  onOpenQuickCreator,
  onSwitchToChat,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<LessonPlan | null>(lesson);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal Activitate Didactică Ludică (Joc la Tablă / Blooket / Wayground)
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameModalTab, setGameModalTab] = useState<'play' | 'blooket' | 'wayground' | 'questions'>('play');

  // Regenerate Modal / Options
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [customRegenInstruction, setCustomRegenInstruction] = useState('');

  // Inline Quick Generator when no lesson is active
  const [emptyGrade, setEmptyGrade] = useState('Clasa a III-a');
  const [emptySubject, setEmptySubject] = useState('Limba și literatura română');
  const [emptyTopic, setEmptyTopic] = useState('');

  React.useEffect(() => {
    setEditedPlan(lesson);
  }, [lesson]);

  // Handle when empty: Show a clean generator, NOT static templates!
  if (!editedPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 sm:p-10 bg-stone-50 overflow-y-auto">
        <div className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Sparkles className="w-7 h-7 text-blue-600" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mb-2">
            Proiectează o Schiță de Lecție
          </h2>
          <p className="text-sm text-stone-600 mb-5 leading-relaxed">
            Metodistul generează automat schița completă conform structurii oficiale din documentul de referință (cu obiective, etape, timpi alocați, marcaje cu roșu la tablă și jocuri interactive Wordwall).
          </p>

          {/* Card Direct: Lecție Nouă & Atașare Resurse Multiple */}
          <div
            onClick={onOpenQuickCreator}
            className="p-4 mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-400 rounded-2xl cursor-pointer text-left transition-all group flex items-center gap-3 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Paperclip className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm text-blue-950 flex items-center gap-2">
                <span>Lecție Nouă (+ Atașează Resurse)</span>
                <span className="text-[10px] bg-blue-200 text-blue-900 font-extrabold px-1.5 py-0.5 rounded">
                  FOTO / PDF / WORD
                </span>
              </div>
              <p className="text-xs text-blue-800/80 mt-0.5">
                Deschide formularul rapid pentru a selecta clasa și a încărca fotografii din manual, programa în PDF sau fișe Word.
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-blue-700 shrink-0 group-hover:scale-110 transition-transform" />
          </div>

          {/* Quick inline form */}
          <div className="space-y-3.5 text-left mb-6">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Clasa:
              </label>
              <select
                value={emptyGrade}
                onChange={(e) => {
                  setEmptyGrade(e.target.value);
                  const subjects = PRIMARY_SUBJECTS[e.target.value] || [];
                  if (subjects.length > 0) setEmptySubject(subjects[0]);
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {PRIMARY_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Disciplina:
              </label>
              <select
                value={emptySubject}
                onChange={(e) => setEmptySubject(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {(PRIMARY_SUBJECTS[emptyGrade] || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Subiectul / Tema lecției:
              </label>
              <input
                type="text"
                placeholder="Introduceți tema (ex: Substantivul, Înmulțirea numerelor, Părțile plantei...)"
                value={emptyTopic}
                onChange={(e) => setEmptyTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && emptyTopic.trim()) {
                    onRegenerateLesson(
                      `Vă rog să generați schița pentru Clasa: ${emptyGrade}, Disciplina: ${emptySubject}, Subiectul: ${emptyTopic.trim()}`
                    );
                  }
                }}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => {
                if (!emptyTopic.trim()) {
                  onOpenQuickCreator();
                  return;
                }
                onRegenerateLesson(
                  `Vă rog să generați o schiță completă de lecție conform formatului oficial: Clasa: ${emptyGrade}, Disciplina: ${emptySubject}, Subiectul: ${emptyTopic.trim()}`
                );
              }}
              disabled={isRegenerating}
              className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegenerating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Se generează schița...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generează Schița de Lecție</span>
                </>
              )}
            </button>

            <button
              onClick={onSwitchToChat}
              className="w-full sm:w-auto px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 text-blue-700" />
              <Paperclip className="w-4 h-4 text-blue-700" />
              <span>Chat & Atașează Fișiere</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      const blob = await generateDocxBlob(editedPlan);
      const safeName = (editedPlan.subiectulLectiei || 'schita_de_lectie')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      downloadBlob(blob, `Schita_Lectie_${safeName}.docx`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!editedPlan) return;
    try {
      setIsExportingPdf(true);
      await downloadLessonPlanPdf(editedPlan, 'lesson-plan-document');
    } catch (err) {
      console.error('Eroare export PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSave = () => {
    if (editedPlan) {
      onUpdateLesson(editedPlan);
      onSaveToHistory(editedPlan);
      setIsEditing(false);
    }
  };

  const handleCopyAll = () => {
    if (!editedPlan) return;
    const stagesText = editedPlan.activitatiPlanificate
      .map(
        (s) =>
          `\n--- ${s.numeEtapa} (${s.timpAlocat}) ---\nActivitatea profesorului: ${s.activitateaProfesorului}\nActivitatea elevilor: ${s.activitateaElevilor}\nMetode: ${s.metodeMijloace}${s.marcajeTablaVizuale ? `\nLa tablă (roșu): ${s.marcajeTablaVizuale}` : ''}`
      )
      .join('\n');

    const full = `SCHIȚĂ DE LECȚIE
Clasa: ${editedPlan.clasa}
Profesorul: ${editedPlan.profesor || 'Neacsu Roxana'}
Data: ${editedPlan.data}
Disciplina: ${editedPlan.disciplina}
Subiectul lecției: ${editedPlan.subiectulLectiei}
Tipul lecției: ${editedPlan.tipulLectiei}

Obiective operaționale:
${editedPlan.obiectiveOperationale?.map((o) => `• ${o}`).join('\n')}

Activitățile planificate:
${stagesText}

Feedback la finalul orei:
${editedPlan.feedbackFinal?.metodaVerificare || ''}
${editedPlan.feedbackFinal?.jocuriDigitaleSiInteractive || ''}
${editedPlan.feedbackFinal?.linkWordwallExemplu || ''}
${editedPlan.feedbackFinal?.aprecieriSiConcluzii || ''}

An școlar 2026 - 2027`;

    navigator.clipboard.writeText(full);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const updateStage = (index: number, field: keyof LessonStage, value: string) => {
    if (!editedPlan) return;
    const stages = [...editedPlan.activitatiPlanificate];
    stages[index] = { ...stages[index], [field]: value };
    setEditedPlan({ ...editedPlan, activitatiPlanificate: stages });
  };

  const addObjective = () => {
    if (!editedPlan) return;
    const newNum = (editedPlan.obiectiveOperationale?.length || 0) + 1;
    const updated = [
      ...(editedPlan.obiectiveOperationale || []),
      `O ${newNum} Să aplice noile noțiuni în exerciții practice.`,
    ];
    setEditedPlan({ ...editedPlan, obiectiveOperationale: updated });
  };

  const removeObjective = (index: number) => {
    if (!editedPlan) return;
    const updated = editedPlan.obiectiveOperationale.filter((_, i) => i !== index);
    setEditedPlan({ ...editedPlan, obiectiveOperationale: updated });
  };

  const triggerRegenerate = (instructions?: string) => {
    setShowRegenerateModal(false);
    onRegenerateLesson(instructions);
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto relative">
      {/* Top Action Toolbar with DELETE and REGENERATE Buttons */}
      <div className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* Titlu Subiect Curent */}
        <div className="flex items-center gap-2 max-w-[45%] truncate">
          <span className="font-extrabold text-sm text-stone-900 truncate">
            {editedPlan.subiectulLectiei}
          </span>
          <span className="text-xs text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-semibold shrink-0">
            {editedPlan.clasa}
          </span>
        </div>

        {/* Butoane de Acțiune: Chat/Resurse, Regenerare, Ștergere, Editare, Descărcare */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* BUTON CHAT & RESURSE CU ATAȘARE FIȘIERE */}
          <button
            onClick={onSwitchToChat}
            title="Deschide Chat-ul metodic și atașează imagini din manual, PDF sau fișiere resursă"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
            <Paperclip className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Chat & Resurse</span>
            <span className="sm:hidden">Chat</span>
          </button>

          {/* BUTON REGENERARE */}
          <button
            onClick={() => setShowRegenerateModal(true)}
            disabled={isRegenerating}
            title="Dacă nu este potrivit sau doriți alte idei, regenerați schița"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Se regenerează...' : 'Regenerează'}</span>
          </button>

          {/* BUTON ȘTERGE */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Șterge această schiță dacă nu este bună și începe una nouă"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Șterge</span>
          </button>

          {/* BUTON EDITEAZĂ */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-stone-400'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" /> Salvează
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-stone-500" /> Editează
              </>
            )}
          </button>

          {/* BUTON COPIAZĂ */}
          <button
            onClick={handleCopyAll}
            title="Copiază textul schiței"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-400 border border-stone-300 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>{copiedText ? 'Copiat!' : 'Copiază'}</span>
          </button>

          {/* BUTON DESCARCĂ WORD */}
          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            title="Descarcă schița de lecție în format Word (.docx)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word (.docx)</span>
          </button>

          {/* BUTON DESCARCĂ PDF */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            title="Descarcă schița de lecție în format PDF (.pdf)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-lg shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            {isExportingPdf ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>PDF (.pdf)</span>
          </button>

          {/* BUTON PRINT */}
          <button
            onClick={() => window.print()}
            title="Tipărește pe hârtie sau PDF"
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 hover:border-stone-400 border border-stone-300 rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="p-4 sm:p-8 flex justify-center flex-1 bg-stone-100/50">
        <div
          id="lesson-plan-document"
          className="w-full max-w-4xl bg-white paper-shading border border-stone-200/90 hover:border-stone-300 rounded-2xl p-6 sm:p-12 font-sans print-card transition-all duration-300"
        >
          {/* Titlu Antet Document */}
          <div className="text-center pb-5 border-b-2 border-stone-900 mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight">
              SCHIȚĂ DE LECȚIE
            </h2>
            <p className="text-xs text-stone-500 font-semibold tracking-wide uppercase mt-1">
              Structură didactică oficială
            </p>
          </div>

          {/* Tabelul de Antet Didactic */}
          <div className="border border-stone-300 rounded-xl overflow-hidden mb-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-stone-50/50">
              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[100px]">Clasa:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.clasa}
                    onChange={(e) => setEditedPlan({ ...editedPlan, clasa: e.target.value })}
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-bold"
                  />
                ) : (
                  <span className="font-bold text-stone-900">{editedPlan.clasa}</span>
                )}
              </div>

              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[100px]">Profesorul:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.profesor}
                    onChange={(e) => setEditedPlan({ ...editedPlan, profesor: e.target.value })}
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-semibold"
                  />
                ) : (
                  <span className="font-semibold text-blue-900">
                    {editedPlan.profesor || 'Profesorul Neacsu Roxana'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-stone-200">
              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[100px]">Data:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.data}
                    onChange={(e) => setEditedPlan({ ...editedPlan, data: e.target.value })}
                    className="bg-white border rounded px-2 py-1 text-sm flex-1"
                  />
                ) : (
                  <span className="font-medium text-stone-800">{editedPlan.data}</span>
                )}
              </div>

              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[100px]">Disciplina:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.disciplina}
                    onChange={(e) => setEditedPlan({ ...editedPlan, disciplina: e.target.value })}
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-semibold"
                  />
                ) : (
                  <span className="font-bold text-blue-900">{editedPlan.disciplina}</span>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-bold text-stone-700 min-w-[120px] uppercase text-xs tracking-wider">
                Subiectul lecției:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPlan.subiectulLectiei}
                  onChange={(e) => setEditedPlan({ ...editedPlan, subiectulLectiei: e.target.value })}
                  className="bg-white border border-stone-300 rounded px-2 py-1 text-base font-bold text-blue-950 flex-1"
                />
              ) : (
                <span className="font-extrabold text-base sm:text-lg text-blue-950">
                  {editedPlan.subiectulLectiei}
                </span>
              )}
            </div>

            <div className="p-3 bg-stone-50/50 border-t border-stone-200 flex items-center gap-3">
              <span className="font-bold text-stone-600 min-w-[100px]">Tipul lecției:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPlan.tipulLectiei}
                  onChange={(e) => setEditedPlan({ ...editedPlan, tipulLectiei: e.target.value })}
                  className="bg-white border rounded px-2 py-1 text-sm flex-1"
                />
              ) : (
                <span className="font-medium text-stone-800">{editedPlan.tipulLectiei}</span>
              )}
            </div>
          </div>

          {/* Obiective Operaționale */}
          <div className="mb-6 p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 subtle-shading hover:border-stone-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
                Obiective operaționale:
              </h3>
              {isEditing && (
                <button
                  onClick={addObjective}
                  className="flex items-center gap-1 text-xs text-blue-700 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Adaugă obiectiv
                </button>
              )}
            </div>

            <ul className="space-y-2 mt-2">
              {editedPlan.obiectiveOperationale?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-800">
                  <span className="font-bold text-blue-700 shrink-0 select-none">•</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => {
                          const updated = [...editedPlan.obiectiveOperationale];
                          updated[i] = e.target.value;
                          setEditedPlan({ ...editedPlan, obiectiveOperationale: updated });
                        }}
                        className="bg-white border border-stone-300 rounded px-2 py-1 text-sm flex-1"
                      />
                      <button
                        onClick={() => removeObjective(i)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="leading-relaxed font-medium">{obj}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Activitățile Planificate */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
              Activitățile planificate (Desfășurarea pe etape):
            </h3>

            <div className="border border-stone-300/90 rounded-xl overflow-hidden subtle-shading">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-900 text-white font-semibold divide-x divide-stone-800">
                    <th className="p-3 w-1/4">Etapele lecției / Timp</th>
                    <th className="p-3 w-5/12">
                      Activitatea profesorului
                      <div className="text-[11px] font-normal text-stone-300">
                        (La tablă, marcat cu roșu)
                      </div>
                    </th>
                    <th className="p-3 w-1/4">Activitatea elevilor</th>
                    <th className="p-3 w-1/6">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {editedPlan.activitatiPlanificate?.map((stage, idx) => (
                    <tr
                      key={stage.id || idx}
                      className={`divide-x divide-stone-200 transition-colors duration-150 hover:bg-blue-50/40 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'
                      }`}
                    >
                      <td className="p-3 align-top">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={stage.numeEtapa}
                              onChange={(e) => updateStage(idx, 'numeEtapa', e.target.value)}
                              className="font-bold text-xs bg-white border rounded px-1.5 py-0.5 w-full"
                            />
                            <input
                              type="text"
                              value={stage.timpAlocat}
                              onChange={(e) => updateStage(idx, 'timpAlocat', e.target.value)}
                              className="text-xs text-stone-600 bg-white border rounded px-1.5 py-0.5 w-20"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">
                              {stage.numeEtapa}
                            </div>
                            <div className="inline-block mt-1 text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {stage.timpAlocat}
                            </div>
                          </>
                        )}

                        {stage.resurseFizice && (
                          <div className="mt-2 text-xs bg-stone-100 border border-stone-200 rounded p-1.5 text-stone-700">
                            <strong className="block font-bold">Pe bancă:</strong>
                            <span>{stage.resurseFizice}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3 align-top leading-relaxed text-stone-800">
                        {isEditing ? (
                          <textarea
                            value={stage.activitateaProfesorului}
                            onChange={(e) => updateStage(idx, 'activitateaProfesorului', e.target.value)}
                            rows={4}
                            className="w-full text-xs p-1.5 border rounded"
                          />
                        ) : (
                          <div className="whitespace-pre-line text-xs sm:text-sm">
                            {stage.activitateaProfesorului}
                          </div>
                        )}

                        {stage.marcajeTablaVizuale && (
                          <div className="mt-2 p-2 bg-red-50 border-l-3 border-red-600 rounded-r text-xs text-red-950">
                            <strong className="font-bold block text-red-800">
                              La tablă (scris cu roșu):
                            </strong>
                            <span className="italic">{stage.marcajeTablaVizuale}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3 align-top leading-relaxed text-stone-800">
                        {isEditing ? (
                          <textarea
                            value={stage.activitateaElevilor}
                            onChange={(e) => updateStage(idx, 'activitateaElevilor', e.target.value)}
                            rows={3}
                            className="w-full text-xs p-1.5 border rounded"
                          />
                        ) : (
                          <div className="whitespace-pre-line text-xs sm:text-sm">
                            {stage.activitateaElevilor}
                          </div>
                        )}
                      </td>

                      <td className="p-3 align-top text-xs text-stone-600">
                        {isEditing ? (
                          <textarea
                            value={stage.metodeMijloace}
                            onChange={(e) => updateStage(idx, 'metodeMijloace', e.target.value)}
                            rows={2}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{stage.metodeMijloace}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback Final & Joc Wordwall / Blooket / Wayground */}
          <div className="mb-6 p-4 rounded-xl bg-stone-50/70 border border-stone-200/90 subtle-shading hover:border-stone-300 transition-all duration-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Feedback la finalul orei:
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-800">
              <div className="flex items-start gap-2">
                <span className="font-bold text-stone-700 min-w-[150px]">
                  Metoda de verificare:
                </span>
                <span className="font-medium">
                  {editedPlan.feedbackFinal?.metodaVerificare || 'Metoda «Arată și spune»'}
                </span>
              </div>

              {/* Activitate Didactică Ludică (Joc la Tablă, Blooket, Wayground) */}
              <div className="p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/80 border border-blue-200/90 rounded-2xl shadow-xs hover:shadow-sm hover:border-blue-300/90 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                      <Gamepad2 className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                        <span>Activitate Ludică Interactivă</span>
                        <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                          GATA DE JOC / EXPORT
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        Rulează jocul pe ecran sau creează instant în <strong>Blooket</strong> și <strong>Wayground</strong>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-blue-900 font-bold bg-white/95 border border-blue-200 px-2.5 py-1 rounded-xl self-start sm:self-auto shadow-2xs">
                    {ensureGameActivity(editedPlan).intrebari.length} întrebări pregătite
                  </span>
                </div>

                <p className="text-xs text-stone-700 mb-3 bg-white/80 p-2.5 rounded-xl border border-stone-200/70 leading-relaxed shadow-2xs">
                  {editedPlan.activitateLudica?.descriere ||
                    editedPlan.feedbackFinal?.jocuriDigitaleSiInteractive ||
                    'Activitate ludică interactivă de consolidare a noțiunilor asimilate în cadrul orei.'}
                </p>

                {/* Butoane Acțiune Directe */}
                <div className="no-print flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGameModalTab('play');
                      setShowGameModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4 text-amber-300" />
                    <span>🕹️ Joacă Acum la Tablă (Pe ecran)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameModalTab('blooket');
                      setShowGameModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 hover:border-amber-400 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-sm">🦊</span>
                    <span>Creează în Blooket (blooket.com)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameModalTab('wayground');
                      setShowGameModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 hover:border-emerald-400 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Creează în Wayground (wayground.com)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameModalTab('questions');
                      setShowGameModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-2 text-stone-600 hover:text-stone-900 hover:bg-white/90 border border-transparent hover:border-stone-200 rounded-xl text-xs font-semibold hover:shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Vezi întrebările</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold text-stone-700 min-w-[150px]">
                  Aprecieri și concluzii:
                </span>
                <span className="italic text-stone-600">
                  {editedPlan.feedbackFinal?.aprecieriSiConcluzii || 'Aprecieri verbale pozitive'}
                </span>
              </div>
            </div>
          </div>

          {/* Schița Tablei */}
          {editedPlan.schemaTablei && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Schița tablei:
              </h3>
              <div className="p-3.5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {editedPlan.schemaTablei}
              </div>
            </div>
          )}

          {/* Subsol Oficial */}
          <div className="pt-6 border-t border-stone-300 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">
            An școlar 2026 - 2027
          </div>
        </div>
      </div>

      {/* CONFIRMARE ȘTERGERE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-stone-900 mb-2">
              Ștergeți schița de lecție?
            </h3>
            <p className="text-xs text-stone-600 text-center mb-6 leading-relaxed">
              Schița curentă va fi eliminată din vizualizator. Veți putea genera o schiță nouă imediat.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteLesson();
                }}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
              >
                Da, șterge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGENERARE CU OPȚIUNI */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">
                  Regenerare Schiță
                </h3>
              </div>
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Cum doriți să regenerăm schița pentru <strong>{editedPlan.subiectulLectiei}</strong>?
            </p>

            {/* Quick choices */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => triggerRegenerate('Regenerează complet cu idei, exemple și jocuri noi.')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-stone-800 transition-all"
              >
                ✨ Regenerare completă (abordare nouă & exerciții proaspete)
              </button>

              <button
                onClick={() =>
                  triggerRegenerate('Include mai multe jocuri didactice antrenante și jocuri Wordwall suplimentare.')
                }
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-stone-800 transition-all"
              >
                🎮 Accent pe jocuri interactive & Wordwall
              </button>

              <button
                onClick={() =>
                  triggerRegenerate('Adaptează activitățile pentru lucru pe grupe/echipe și manipulare de cărți/fișe pe bănci.')
                }
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-stone-800 transition-all"
              >
                👥 Accent pe lucru pe grupe și materiale pe bancă
              </button>
            </div>

            {/* Custom input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Sau specificați cerințe speciale:
              </label>
              <textarea
                value={customRegenInstruction}
                onChange={(e) => setCustomRegenInstruction(e.target.value)}
                placeholder="Ex: Vreau mai multe exerciții la tablă subliniate cu cretă roșie și un ritm mai alert..."
                rows={2}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() =>
                  triggerRegenerate(
                    customRegenInstruction.trim() ||
                      'Regenerează schița cu idei noi conform formatului oficial din schițe de lecție.docx'
                  )
                }
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerează Schița</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACTIVITATE DIDACTICĂ LUDICĂ (BLOOKET / WAYGROUND / LA TABLĂ) */}
      {showGameModal && editedPlan && (
        <InteractiveGameModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          activity={ensureGameActivity(editedPlan)}
          lesson={editedPlan}
          initialTab={gameModalTab}
        />
      )}
    </div>
  );
};
