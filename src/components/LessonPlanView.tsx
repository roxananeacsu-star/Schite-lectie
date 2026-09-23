import React, { useState } from 'react';
import {
  Download,
  Printer,
  Edit3,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Gamepad2,
  ExternalLink,
  BookOpen,
  Clock,
  User,
  Calendar,
  Layers,
  HelpCircle,
  Save,
  CheckCircle2,
  Copy,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { LessonPlan, LessonStage } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';

interface LessonPlanViewProps {
  lesson: LessonPlan | null;
  onUpdateLesson: (updated: LessonPlan) => void;
  onSaveToHistory: (lesson: LessonPlan) => void;
  onAskMethodologistToTweak: (instruction: string) => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  lesson,
  onUpdateLesson,
  onSaveToHistory,
  onAskMethodologistToTweak,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<LessonPlan | null>(lesson);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  React.useEffect(() => {
    setEditedPlan(lesson);
  }, [lesson]);

  if (!editedPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-stone-50">
        <div className="w-16 h-16 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">
          Nicio schiță de lecție activă
        </h3>
        <p className="text-sm text-stone-500 max-w-md mt-1">
          Selectați una dintre cele 3 schițe de referință din bara de sus sau
          solicitați metodistului o schiță nouă în panoul de chat.
        </p>
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

  const handleSave = () => {
    if (editedPlan) {
      onUpdateLesson(editedPlan);
      onSaveToHistory(editedPlan);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
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
      `O ${newNum} Să aplice...`,
    ];
    setEditedPlan({ ...editedPlan, obiectiveOperationale: updated });
  };

  const removeObjective = (index: number) => {
    if (!editedPlan) return;
    const updated = editedPlan.obiectiveOperationale.filter((_, i) => i !== index);
    setEditedPlan({ ...editedPlan, obiectiveOperationale: updated });
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto">
      {/* Top Action Toolbar */}
      <div className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Format: schițe de lecție.docx
          </span>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Salvat cu succes!
            </span>
          )}
          {copiedText && (
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              <Check className="w-3.5 h-3.5" /> Textul a fost copiat!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            title="Copiază tot textul schiței pentru a-l lipi în alt document"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Copiază text</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isEditing
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" /> Încheie Editarea
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> Editează Direct
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            title="Salvează modificările"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Salvează</span>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descarcă Word (.docx)</span>
          </button>

          <button
            onClick={() => window.print()}
            title="Tipărește direct pe hârtie sau exportă ca PDF"
            className="p-1.5 text-stone-700 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts to Tweak via Methodologist */}
      <div className="no-print bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-stone-500 font-semibold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Optimizări rapide cu Metodistul:
        </span>
        <button
          onClick={() =>
            onAskMethodologistToTweak(
              'Te rog să adaptezi această schiță pentru lucru pe grupe interactive și manipulare de cărți sau jetoane pe bănci.'
            )
          }
          className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-800 rounded-md border border-stone-200 transition-colors cursor-pointer"
        >
          + Lucru pe grupe & bănci
        </button>
        <button
          onClick={() =>
            onAskMethodologistToTweak(
              'Completează cu noi exemple vizuale la tablă, subliniate cu cretă roșie.'
            )
          }
          className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-800 rounded-md border border-stone-200 transition-colors cursor-pointer"
        >
          + Marcaje la tablă cu roșu
        </button>
        <button
          onClick={() =>
            onAskMethodologistToTweak(
              'Propune un joc suplimentar Wordwall adaptat la finalul orei.'
            )
          }
          className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-800 rounded-md border border-stone-200 transition-colors cursor-pointer"
        >
          + Joc Wordwall nou
        </button>
      </div>

      {/* Main Printable Document Canvas */}
      <div className="p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg border border-stone-200 rounded-2xl p-6 sm:p-12 font-sans print-card">
          {/* Header Title */}
          <div className="text-center pb-6 border-b-2 border-stone-800 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight">
              SCHIȚĂ DE LECȚIE
            </h1>
            <p className="text-xs text-stone-500 font-semibold tracking-wide uppercase mt-1">
              Conform formatului oficial din „schițe de lecție.docx”
            </p>
          </div>

          {/* Antet Metadata Didactică */}
          <div className="border border-stone-300 rounded-xl overflow-hidden mb-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              {/* Clasa */}
              <div className="p-3 bg-stone-50/60 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[110px]">Clasa:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.clasa}
                    onChange={(e) =>
                      setEditedPlan({ ...editedPlan, clasa: e.target.value })
                    }
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-bold"
                  />
                ) : (
                  <span className="font-bold text-stone-900">{editedPlan.clasa}</span>
                )}
              </div>

              {/* Profesorul */}
              <div className="p-3 bg-stone-50/60 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[110px]">Profesorul:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.profesor}
                    onChange={(e) =>
                      setEditedPlan({ ...editedPlan, profesor: e.target.value })
                    }
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-medium"
                  />
                ) : (
                  <span className="font-semibold text-blue-900">
                    {editedPlan.profesor || 'Neacsu Roxana'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-stone-200">
              {/* Data */}
              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[110px]">Data:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.data}
                    onChange={(e) =>
                      setEditedPlan({ ...editedPlan, data: e.target.value })
                    }
                    className="bg-white border rounded px-2 py-1 text-sm flex-1"
                  />
                ) : (
                  <span className="font-medium text-stone-800">{editedPlan.data}</span>
                )}
              </div>

              {/* Disciplina */}
              <div className="p-3 flex items-center gap-3">
                <span className="font-bold text-stone-600 min-w-[110px]">Disciplina:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.disciplina}
                    onChange={(e) =>
                      setEditedPlan({ ...editedPlan, disciplina: e.target.value })
                    }
                    className="bg-white border rounded px-2 py-1 text-sm flex-1 font-semibold"
                  />
                ) : (
                  <span className="font-bold text-blue-900">
                    {editedPlan.disciplina}
                  </span>
                )}
              </div>
            </div>

            {/* Subiectul Lecției */}
            <div className="p-4 bg-blue-50/40 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-bold text-stone-700 min-w-[130px] uppercase text-xs tracking-wider">
                Subiectul lecției:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPlan.subiectulLectiei}
                  onChange={(e) =>
                    setEditedPlan({
                      ...editedPlan,
                      subiectulLectiei: e.target.value,
                    })
                  }
                  className="bg-white border border-stone-300 rounded px-2 py-1 text-base font-bold text-blue-950 flex-1"
                />
              ) : (
                <span className="font-extrabold text-base sm:text-lg text-blue-950">
                  {editedPlan.subiectulLectiei}
                </span>
              )}
            </div>

            {/* Tipul Lecției */}
            <div className="p-3 bg-stone-50/60 border-t border-stone-200 flex items-center gap-3">
              <span className="font-bold text-stone-600 min-w-[110px]">Tipul lecției:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPlan.tipulLectiei}
                  onChange={(e) =>
                    setEditedPlan({ ...editedPlan, tipulLectiei: e.target.value })
                  }
                  className="bg-white border rounded px-2 py-1 text-sm flex-1"
                />
              ) : (
                <span className="font-medium text-stone-800">
                  {editedPlan.tipulLectiei}
                </span>
              )}
            </div>
          </div>

          {/* Obiective Operaționale */}
          <div className="mb-6 p-4 rounded-xl border border-stone-200 bg-stone-50/30">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
                Obiective operaționale:
              </h2>
              {isEditing && (
                <button
                  onClick={addObjective}
                  className="flex items-center gap-1 text-xs text-blue-700 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Adaugă obiectiv
                </button>
              )}
            </div>

            <ul className="space-y-2 mt-3">
              {editedPlan.obiectiveOperationale?.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-stone-800">
                  <span className="font-bold text-blue-700 shrink-0 select-none">
                    •
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => {
                          const updated = [...editedPlan.obiectiveOperationale];
                          updated[i] = e.target.value;
                          setEditedPlan({
                            ...editedPlan,
                            obiectiveOperationale: updated,
                          });
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
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
              Activitățile planificate (Desfășurarea pe etape):
            </h2>

            {/* Table layout matching the official Word document */}
            <div className="border border-stone-300 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-900 text-white font-semibold divide-x divide-stone-800">
                    <th className="p-3 w-1/4">Etapele lecției / Timp</th>
                    <th className="p-3 w-5/12">
                      Activitatea profesorului
                      <div className="text-[11px] font-normal text-stone-300">
                        (Exemple la tablă, marcaje cu roșu)
                      </div>
                    </th>
                    <th className="p-3 w-1/4">
                      Activitatea elevilor
                      <div className="text-[11px] font-normal text-stone-300">
                        (Cărți pe bancă, lucru practic)
                      </div>
                    </th>
                    <th className="p-3 w-1/6">Metode & Mijloace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {editedPlan.activitatiPlanificate?.map((stage, idx) => (
                    <tr
                      key={stage.id || idx}
                      className={`divide-x divide-stone-200 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'
                      }`}
                    >
                      {/* Nume Etapă & Timp */}
                      <td className="p-3.5 align-top">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={stage.numeEtapa}
                              onChange={(e) =>
                                updateStage(idx, 'numeEtapa', e.target.value)
                              }
                              className="font-bold text-xs bg-white border border-stone-300 rounded px-1.5 py-0.5 w-full"
                            />
                            <input
                              type="text"
                              value={stage.timpAlocat}
                              onChange={(e) =>
                                updateStage(idx, 'timpAlocat', e.target.value)
                              }
                              className="text-xs text-stone-600 bg-white border border-stone-300 rounded px-1.5 py-0.5 w-20"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-bold text-stone-900 text-sm leading-snug">
                              {stage.numeEtapa}
                            </div>
                            <div className="inline-block mt-1 text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {stage.timpAlocat}
                            </div>
                          </>
                        )}

                        {stage.resurseFizice && (
                          <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 rounded p-1.5 text-emerald-900">
                            <strong className="block font-bold">
                              Materiale pe bancă:
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={stage.resurseFizice}
                                onChange={(e) =>
                                  updateStage(idx, 'resurseFizice', e.target.value)
                                }
                                rows={2}
                                className="w-full text-xs p-1 border rounded"
                              />
                            ) : (
                              <span>{stage.resurseFizice}</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Activitatea Profesorului */}
                      <td className="p-3.5 align-top leading-relaxed text-stone-800">
                        {isEditing ? (
                          <textarea
                            value={stage.activitateaProfesorului}
                            onChange={(e) =>
                              updateStage(
                                idx,
                                'activitateaProfesorului',
                                e.target.value
                              )
                            }
                            rows={5}
                            className="w-full text-xs p-1.5 border rounded"
                          />
                        ) : (
                          <div className="whitespace-pre-line text-xs sm:text-sm font-normal">
                            {stage.activitateaProfesorului}
                          </div>
                        )}

                        {stage.marcajeTablaVizuale && (
                          <div className="mt-2.5 p-2 bg-red-50/80 border-l-4 border-red-600 rounded-r text-xs text-red-950">
                            <strong className="font-bold block text-red-800">
                              La tablă (vizual / marcat cu roșu):
                            </strong>
                            {isEditing ? (
                              <textarea
                                value={stage.marcajeTablaVizuale}
                                onChange={(e) =>
                                  updateStage(
                                    idx,
                                    'marcajeTablaVizuale',
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full text-xs p-1 border rounded mt-1"
                              />
                            ) : (
                              <span className="italic">
                                {stage.marcajeTablaVizuale}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Activitatea Elevilor */}
                      <td className="p-3.5 align-top leading-relaxed text-stone-800">
                        {isEditing ? (
                          <textarea
                            value={stage.activitateaElevilor}
                            onChange={(e) =>
                              updateStage(idx, 'activitateaElevilor', e.target.value)
                            }
                            rows={4}
                            className="w-full text-xs p-1.5 border rounded"
                          />
                        ) : (
                          <div className="whitespace-pre-line text-xs sm:text-sm font-normal">
                            {stage.activitateaElevilor}
                          </div>
                        )}
                      </td>

                      {/* Metode & Mijloace */}
                      <td className="p-3.5 align-top text-xs text-stone-600">
                        {isEditing ? (
                          <textarea
                            value={stage.metodeMijloace}
                            onChange={(e) =>
                              updateStage(idx, 'metodeMijloace', e.target.value)
                            }
                            rows={3}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span className="leading-snug block">{stage.metodeMijloace}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback la finalul orei */}
          <div className="mb-6 p-5 rounded-xl bg-stone-50 border border-stone-200">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Feedback la finalul orei:
            </h2>

            <div className="space-y-3 text-sm text-stone-800">
              <div className="flex items-start gap-2">
                <span className="font-bold text-stone-700 min-w-[160px]">
                  Timp alocat:
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.feedbackFinal?.timpAlocat || '5 min'}
                    onChange={(e) =>
                      setEditedPlan({
                        ...editedPlan,
                        feedbackFinal: {
                          ...editedPlan.feedbackFinal,
                          timpAlocat: e.target.value,
                        },
                      })
                    }
                    className="bg-white border rounded px-2 py-0.5 text-xs font-semibold"
                  />
                ) : (
                  <span className="font-bold text-blue-800">
                    {editedPlan.feedbackFinal?.timpAlocat || '5 min'}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold text-stone-700 min-w-[160px]">
                  Metoda de verificare:
                </span>
                {isEditing ? (
                  <textarea
                    value={editedPlan.feedbackFinal?.metodaVerificare || ''}
                    onChange={(e) =>
                      setEditedPlan({
                        ...editedPlan,
                        feedbackFinal: {
                          ...editedPlan.feedbackFinal,
                          metodaVerificare: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="bg-white border rounded px-2 py-0.5 text-xs flex-1"
                  />
                ) : (
                  <div className="flex-1 whitespace-pre-line font-medium">
                    {editedPlan.feedbackFinal?.metodaVerificare ||
                      'Metoda "Arată și spune", recapitulare'}
                  </div>
                )}
              </div>

              {/* Wordwall Interactive Banner */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-xs mb-1">
                  <Gamepad2 className="w-4 h-4 text-indigo-600" />
                  <span>Jocuri didactice interactive (Wordwall):</span>
                </div>
                <p className="text-xs text-stone-700 mb-2">
                  {editedPlan.feedbackFinal?.jocuriDigitaleSiInteractive ||
                    'Joc Wordwall adaptat conținutului'}
                </p>

                {editedPlan.feedbackFinal?.linkWordwallExemplu && (
                  <a
                    href={editedPlan.feedbackFinal.linkWordwallExemplu}
                    target="_blank"
                    rel="noreferrer"
                    className="no-print inline-flex items-center gap-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                  >
                    <span>Deschide jocul Wordwall</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-start gap-2 pt-1">
                <span className="font-bold text-stone-700 min-w-[160px]">
                  Aprecieri și concluzii:
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan.feedbackFinal?.aprecieriSiConcluzii || ''}
                    onChange={(e) =>
                      setEditedPlan({
                        ...editedPlan,
                        feedbackFinal: {
                          ...editedPlan.feedbackFinal,
                          aprecieriSiConcluzii: e.target.value,
                        },
                      })
                    }
                    className="bg-white border rounded px-2 py-0.5 text-xs flex-1"
                  />
                ) : (
                  <span className="italic text-stone-600">
                    {editedPlan.feedbackFinal?.aprecieriSiConcluzii ||
                      'Aprecieri verbale încurajatoare'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Schița Tablei */}
          {editedPlan.schemaTablei && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                Schița tablei:
              </h2>
              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl border-2 border-stone-800 font-mono text-xs whitespace-pre-wrap shadow-inner leading-relaxed">
                {editedPlan.schemaTablei}
              </div>
            </div>
          )}

          {/* Footer Official Year */}
          <div className="pt-6 border-t border-stone-300 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">
            An școlar 2026 - 2027
          </div>
        </div>
      </div>
    </div>
  );
};
