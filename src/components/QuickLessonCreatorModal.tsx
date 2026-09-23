import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  FileText,
  FileCode,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  File,
} from 'lucide-react';
import { PRIMARY_GRADES, PRIMARY_SUBJECTS, LESSON_TYPES } from '../data/curriculumData';
import { UploadedAttachment } from '../types';
import { processMultipleFiles } from '../utils/fileParser';

interface QuickLessonCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, attachments: UploadedAttachment[]) => void;
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
  const [specialRequests, setSpecialRequests] = useState<string>(
    'Include joc interactiv Wordwall, exemple la tablă cu roșu și metoda «Arată și spune».'
  );

  // Resurse multiple atașate (foto manual, programă PDF, fișe etc.)
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentSubjects = PRIMARY_SUBJECTS[selectedGrade] || PRIMARY_SUBJECTS['Clasa a III-a'];

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    const subjects = PRIMARY_SUBJECTS[grade] || [];
    if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0]);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const processed = await processMultipleFiles(files);
      setAttachments((prev) => [...prev, ...processed]);
    } catch (err) {
      console.error('Eroare la adăugarea fișierelor:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelected(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreate = () => {
    // Permitem crearea chiar dacă utilizatorul nu a tastat o temă, dacă a încărcat fișiere resursă!
    const effectiveTopic = topic.trim() || (attachments.length > 0 ? 'Conform resurselor și paginilor atașate' : '');
    if (!effectiveTopic) return;

    let fullPrompt = '';
    if (topic.trim()) {
      fullPrompt = `Vă rog să generați o schiță de lecție completă și detaliată conform formatului oficial "schițe de lecție.docx":
- Clasa: ${selectedGrade}
- Profesorul: ${teacherName}
- Data: ${new Date().toLocaleDateString('ro-RO')}
- Disciplina: ${selectedSubject}
- Subiectul lecției: ${topic.trim()}
- Tipul lecției: ${selectedType}
- Cerințe metodice specifice: ${specialRequests}
- Structură obligatorie: Obiective operaționale măsurabile (O 1, O 2, O 3...), Activitățile planificate defalcate pe etape cu timp și activitate profesor/elevi, exemple la tablă cu marcaje roșii, Feedback final cu joc Wordwall și metoda «Arată și spune», plus subsolul "An școlar 2026 - 2027".`;
    } else {
      fullPrompt = `Vă rog să analizați materialele atașate (${attachments.map((a) => a.name).join(', ')}) și să generați o schiță completă de lecție conform conținutului identificat în manual/programă pentru ${selectedGrade}, ${selectedSubject}:
- Profesorul: ${teacherName}
- Data: ${new Date().toLocaleDateString('ro-RO')}
- Tipul lecției: ${selectedType}
- Structură oficială conform "schițe de lecție.docx": obiective operaționale, etape cu timpi, activitate profesor (marcaje cu roșu la tablă), activitate elevi, feedback final cu joc Wordwall.`;
    }

    if (attachments.length > 0) {
      fullPrompt += `\n\n[ATENȚIE METODICĂ]: Au fost atașate ${attachments.length} resurse (fotografii manual / documente). Vă rog să extrageți conceptele, textul sau exercițiile din aceste fișiere și să le includeți nemijlocit în etapele lecției.`;
    }

    onSubmit(fullPrompt, attachments);
    onClose();
  };

  const quickTopicSuggestions: Record<string, string[]> = {
    'Limba și literatura română': [
      'Componentele cărții',
      'Semne de punctuație (?, !, :)',
      'Substantivul (felul, numărul)',
      'Adjectivul',
      'Textul narativ',
    ],
    'Matematică și științe ale naturii': [
      'Numerele naturale de la 0 la 10 000',
      'Adunarea cu trecere peste ordin',
      'Părțile unei plante',
      'Stările de agregare ale apei',
    ],
    'Comunicare în limba română (CLR)': [
      'Sunetul și litera A / a',
      'Despărțirea în silabe',
      'Cuvântul și propoziția',
    ],
    'Matematică și explorarea mediului (MEM)': [
      'Adunarea 0 - 100 cu trecere',
      'Corpul omenesc și sănătatea',
      'Plante și animale',
    ],
  };

  const activeSuggestions = quickTopicSuggestions[selectedSubject] || [
    'Componentele cărții',
    'Semne de punctuație',
    'Numerele naturale',
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const canSubmit = topic.trim().length > 0 || attachments.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Antet Simplu & Clar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">Lecție Nouă</h3>
              <p className="text-xs text-blue-200">
                Alegeți clasa, tema și atașați orice resurse (foto manual, programă PDF etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corp Formular - Aerisit și Intuitiv */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-stone-800 text-sm">
          {/* Pasul 1: Clasa & Disciplina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Clasa:
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {PRIMARY_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Disciplina:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {currentSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pasul 2: Subiectul Lecției */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Subiectul / Tema lecției:
              </label>
              {attachments.length > 0 && !topic.trim() && (
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                  Se va deduce din fișierele atașate
                </span>
              )}
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Substantivul, Semne de punctuație, Părțile plantei..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-900 placeholder:font-normal focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />

            {/* Sugestii rapide cu 1 clic */}
            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-stone-400 font-medium">Sugestii:</span>
              {activeSuggestions.map((sugg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(sugg)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-blue-100 hover:text-blue-900 text-stone-700 text-xs rounded-lg shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Pasul 3: ZONĂ DE ATAȘARE RESURSE MULTIPLE (Foto manual, Programă PDF, Fișe) */}
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-700" />
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Atașează Resurse pentru lecție (opțional):
                </label>
              </div>
              <span className="text-[11px] text-blue-800 font-medium">
                Multiple fișiere · orice format
              </span>
            </div>

            {/* Dropzone intuitiv */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-600 bg-blue-100/70 scale-[0.99]'
                  : 'border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFilesSelected(e.target.files)}
                multiple
                className="hidden"
              />

              <div className="flex flex-col items-center gap-1.5 text-stone-600">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-stone-800">
                  <span className="text-blue-700 underline">Apasă pentru a alege fișiere</span> sau trage-le direct aici
                </div>
                <p className="text-[11px] text-stone-500 max-w-sm">
                  Poți încărca: fotografii cu pagini din manual, programa școlară în PDF, fișe în Word/DOCX etc.
                </p>
              </div>
            </div>

            {/* Listă fișiere atașate */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="text-[11px] font-bold text-blue-900 flex items-center justify-between">
                  <span>Fișiere atașate ({attachments.length}):</span>
                  <button
                    type="button"
                    onClick={() => setAttachments([])}
                    className="text-red-600 hover:underline text-[10px]"
                  >
                    Șterge toate
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-2 bg-white border border-stone-200 rounded-xl shadow-2xs group"
                    >
                      {att.type === 'image' && att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                      ) : att.type === 'pdf' ? (
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          PDF
                        </div>
                      ) : att.type === 'docx' || att.type === 'doc' ? (
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          DOC
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                          <File className="w-4 h-4" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-stone-900 truncate" title={att.name}>
                          {att.name}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {formatFileSize(att.size)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(att.id);
                        }}
                        className="p-1 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Elimină acest fișier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Opțiuni Avansate (Compact / Expandabil) */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-xs font-bold text-stone-700 transition-colors"
            >
              <span>Opțiuni avansate (Tipul lecției, Cadru didactic, Cerințe)</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="p-3.5 space-y-3 bg-white border-t border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Tipul Lecției:
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      {LESSON_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Cadrul Didactic:
                    </label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Cerințe sau accente metodice:
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer cu Buton de Generare */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Anulează
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!canSubmit || isUploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {attachments.length > 0
                ? `Generează Schița (${attachments.length} ${attachments.length === 1 ? 'resursă' : 'resurse'})`
                : 'Generează Schița Didactică'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
