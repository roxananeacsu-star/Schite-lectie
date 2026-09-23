import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  Layers,
  ArrowRight,
  Upload,
  Check,
} from 'lucide-react';
import { PRIMARY_GRADES, PRIMARY_SUBJECTS, LESSON_TYPES } from '../data/curriculumData';

interface QuickLessonCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const QuickLessonCreatorModal: React.FC<QuickLessonCreatorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Clasa a III-a');
  const [selectedSubject, setSelectedSubject] = useState<string>('Limba și literatura română');
  const [topic, setTopic] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Lecție de dobândire de noi cunoștințe');
  const [teacherName, setTeacherName] = useState<string>('Profesorul Neacsu Roxana');
  const [specialRequests, setSpecialRequests] = useState<string>('Include joc interactiv Wordwall, exemple la tablă cu roșu și metoda «Arată și spune».');

  if (!isOpen) return null;

  const currentSubjects = PRIMARY_SUBJECTS[selectedGrade] || PRIMARY_SUBJECTS['Clasa a III-a'];

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    const subjects = PRIMARY_SUBJECTS[grade] || [];
    if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0]);
    }
  };

  const handleCreate = () => {
    if (!topic.trim()) return;

    const fullPrompt = `Vă rog să generați o schiță de lecție completă și detaliată conform formatului oficial "schițe de lecție.docx":
- Clasa: ${selectedGrade}
- Profesorul: ${teacherName}
- Data: ${new Date().toLocaleDateString('ro-RO')}
- Disciplina: ${selectedSubject}
- Subiectul lecției: ${topic.trim()}
- Tipul lecției: ${selectedType}
- Cerințe metodice specifice: ${specialRequests}
- Structură obligatorie: Obiective operaționale măsurabile (O 1, O 2, O 3...), Activitățile planificate defalcate pe etape cu timp și activitate profesor/elevi, exemple la tablă cu marcaje roșii, Feedback final cu joc Wordwall și metoda «Arată și spune», plus subsolul "An școlar 2026 - 2027".`;

    onSubmit(fullPrompt);
    onClose();
  };

  const quickTopicSuggestions: Record<string, string[]> = {
    'Limba și literatura română': [
      'Componentele cărții',
      'Semne de punctuație (?, !, :)',
      'Substantivul (felul, numărul)',
      'Adjectivul – prietenul substantivului',
      'Textul narativ – personajele și acțiunea',
    ],
    'Matematică și științe ale naturii': [
      'Numerele naturale de la 0 la 10 000',
      'Adunarea și scăderea cu trecere peste ordin',
      'Înmulțirea numerelor naturale când unul dintre factori este o sumă',
      'Părțile unei plante și rolul lor',
      'Stările de agregare ale apei',
    ],
    'Comunicare în limba română (CLR)': [
      'Sunetul și litera A / a',
      'Despărțirea cuvintelor în silabe',
      'Propoziția. Cuvântul. Sunetul',
    ],
    'Matematică și explorarea mediului (MEM)': [
      'Adunarea numerelor 0 - 100 cu trecere peste ordin',
      'Corpul omenesc și organele majore',
      'Animale sălbatice și domestice',
    ],
  };

  const activeSuggestions = quickTopicSuggestions[selectedSubject] || [
    'Componentele cărții',
    'Semne de punctuație',
    'Numerele naturale de la 0 la 10 000',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Generator Rapid de Schiță</h3>
              <p className="text-xs text-blue-200">
                Configurează în 3 pași simpli proiectul didactic conform programei
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-stone-800 text-sm">
          {/* Pasul 1: Selectare Clasă */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              1. Alegeți Clasa:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRIMARY_GRADES.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleGradeChange(grade)}
                  className={`p-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                    selectedGrade === grade
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{grade}</span>
                    {selectedGrade === grade && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pasul 2: Selectare Disciplină */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              2. Disciplina Didactică:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {currentSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Pasul 3: Subiectul Lecției */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                3. Subiectul / Tema Lecției:
              </label>
              <span className="text-[11px] text-stone-400">Ex: Componentele cărții</span>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Introduceți subiectul lecției (ex: Semne de punctuație, Substantivul, etc.)..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />

            {/* Quick Suggestions Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-stone-400 font-medium self-center">Sugestii rapide:</span>
              {activeSuggestions.map((sugg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(sugg)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-blue-100 hover:text-blue-900 text-stone-700 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Tipul Lecției & Cadru Didactic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Tipul Lecției:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Cadrul Didactic:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Anulează
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Generează Schița Didactică
          </button>
        </div>
      </div>
    </div>
  );
};
