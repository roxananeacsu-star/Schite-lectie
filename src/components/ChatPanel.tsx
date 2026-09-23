import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  HelpCircle,
  Gamepad2,
  FileDown,
  ArrowRight,
  Eye,
  CheckCircle2,
  BookOpen,
  Info,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { ChatMessage, UploadedAttachment, LessonPlan } from '../types';
import { processUploadedFile } from '../utils/fileParser';
import { downloadBlob, generateDocxBlob } from '../utils/docxExport';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments: UploadedAttachment[]) => void;
  isLoading: boolean;
  onOpenLesson: (lesson: LessonPlan) => void;
  currentLesson: LessonPlan | null;
  onApplyPromptSuggestion: (prompt: string) => void;
  onDeleteLesson?: (id: string) => void;
  onRegenerateLesson?: (lesson: LessonPlan) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onOpenLesson,
  currentLesson,
  onApplyPromptSuggestion,
  onDeleteLesson,
  onRegenerateLesson,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: UploadedAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const att = await processUploadedFile(files[i]);
        newAttachments.push(att);
      } catch (err) {
        console.error('Eroare procesare fișier:', err);
      }
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newAttachments: UploadedAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const att = await processUploadedFile(files[i]);
        newAttachments.push(att);
      } catch (err) {
        console.error('Eroare procesare fișier drop:', err);
      }
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    if ((!inputText.trim() && attachments.length === 0) || isLoading) return;
    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportLesson = async (lesson: LessonPlan) => {
    try {
      const blob = await generateDocxBlob(lesson);
      downloadBlob(blob, `Schita_Lectie_${lesson.clasa.replace(/\s+/g, '_')}.docx`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-stone-50 border-r border-stone-200"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Top Banner / Guidance */}
      <div className="p-3.5 bg-white border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-stone-800">
            Metodist Didactic Activ
          </span>
          <span className="text-stone-400">·</span>
          <span className="hidden sm:inline">
            Încarcă imagini din manual, PDF sau solicită o temă didactică
          </span>
        </div>
        <div className="text-stone-500 font-medium">
          Format: <span className="font-semibold text-blue-700">schițe de lecție.docx</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-stone-500">
              {msg.sender === 'assistant' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Metodist Didactic</span>
                </>
              ) : (
                <span className="font-medium">Dumneavoastră (Cadrul Didactic)</span>
              )}
              <span>·</span>
              <span className="text-[11px] text-stone-400">{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-sm shadow-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-700 text-white rounded-tr-xs'
                  : 'bg-white text-stone-900 border border-stone-200 rounded-tl-xs'
              }`}
            >
              {/* Attached files preview in user message */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  <div className="text-xs font-semibold opacity-90">
                    Materiale atașate spre analiză didactică:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-800/80 text-white border border-blue-600'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {att.previewUrl ? (
                          <img
                            src={att.previewUrl}
                            alt={att.name}
                            className="w-10 h-10 object-cover rounded-sm border border-stone-300"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-sm bg-stone-200 flex items-center justify-center text-stone-700">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div className="truncate flex-1">
                          <p className="font-medium truncate">{att.name}</p>
                          <p className="text-[10px] opacity-75 uppercase">
                            {att.type} · {(att.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans text-stone-900">
                {msg.sender === 'user' ? (
                  <span className="text-white">{msg.text}</span>
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>

              {/* Proactive Clarification Questions Card */}
              {msg.missingQuestions && msg.missingQuestions.length > 0 && (
                <div className="mt-3.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-stone-800">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900 text-xs mb-2">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Detalii necesare pentru o schiță completă și adaptată:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                    {msg.missingQuestions.map((q, idx) => (
                      <li key={idx} className="font-medium">
                        {q}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-800 mt-2 italic">
                    Răspundeți pe scurt în căsuța de mai jos sau încărcați o poză cu pagina din manual.
                  </p>
                </div>
              )}

              {/* Generated Lesson Plan Card Indicator */}
              {msg.lessonPlan && (
                <div className="mt-4 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-stone-900">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Schiță de Lecție Proiectată
                      </div>
                      <h4 className="font-semibold text-sm text-stone-900 mt-1">
                        {msg.lessonPlan.subiectulLectiei}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {msg.lessonPlan.clasa} · {msg.lessonPlan.disciplina} ·{' '}
                        {msg.lessonPlan.durata}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100">
                    <button
                      onClick={() => onOpenLesson(msg.lessonPlan!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Deschide în Vizualizator
                    </button>
                    <button
                      onClick={() => handleExportLesson(msg.lessonPlan!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-blue-900 border border-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-700" />
                      Descarcă Word (.docx)
                    </button>
                    {onRegenerateLesson && (
                      <button
                        onClick={() => onRegenerateLesson(msg.lessonPlan!)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Regenerează această schiță dacă doriți idei noi"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Regenerează
                      </button>
                    )}
                    {onDeleteLesson && (
                      <button
                        onClick={() => onDeleteLesson(msg.lessonPlan!.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        title="Șterge schița dacă nu e bună"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Șterge
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quick follow-up suggestions */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {msg.suggestedPrompts.map((sugg, i) => (
                    <button
                      key={i}
                      onClick={() => onApplyPromptSuggestion(sugg)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-blue-50 hover:text-blue-800 text-stone-700 rounded-md text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                      {sugg}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 max-w-xs shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Metodistul elaborează schița didactică...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="p-4 mx-4 mb-2 bg-blue-50 border-2 border-dashed border-blue-400 rounded-xl text-center text-blue-800 text-xs font-semibold animate-pulse">
          Plasați aici fișierele (PDF, DOCX, imagine pagină manual) pentru analiză didactică
        </div>
      )}

      {/* Attachment Preview Bar */}
      {attachments.length > 0 && (
        <div className="p-3 bg-white border-t border-stone-200 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-100 rounded-lg border border-stone-200 text-xs"
            >
              {att.previewUrl ? (
                <img
                  src={att.previewUrl}
                  alt={att.name}
                  className="w-6 h-6 object-cover rounded-xs"
                />
              ) : (
                <FileText className="w-4 h-4 text-stone-600" />
              )}
              <span className="max-w-[140px] truncate text-stone-800 font-medium">
                {att.name}
              </span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-200">
        {/* Quick Didactic Themes */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] text-stone-600">
          <span className="font-semibold text-stone-400 shrink-0">Exemple:</span>
          <button
            onClick={() =>
              onApplyPromptSuggestion(
                'Vreau o schiță de lecție la Limba și literatura română, Clasa a III-a, despre Substantiv (lecție de predare).'
              )
            }
            className="shrink-0 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Substantivul (Clasa a III-a)
          </button>
          <button
            onClick={() =>
              onApplyPromptSuggestion(
                'Proiectează o lecție de Matematică și explorarea mediului la Clasa a II-a: Adunarea cu trecere peste ordin (27 + 5).'
              )
            }
            className="shrink-0 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Adunarea 0-100 MEM (Clasa a II-a)
          </button>
          <button
            onClick={() =>
              onApplyPromptSuggestion(
                'Lecție Științe ale naturii la Clasa a IV-a: Părțile unei plante și rolul lor.'
              )
            }
            className="shrink-0 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Planta și părțile ei (Clasa a IV-a)
          </button>
        </div>

        <div className="flex items-end gap-2 bg-stone-50 border border-stone-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrieți solicitarea sau detaliile lecției (ex: clasa, disciplina, subiectul dorit sau întrebări didactice)..."
            rows={2}
            className="flex-1 bg-transparent resize-none text-stone-900 text-sm focus:outline-none placeholder:text-stone-400"
          />

          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.docx,.doc"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Atașează pagini de manual (imagini), PDF sau DOCX"
              className="p-2 text-stone-500 hover:text-blue-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={(!inputText.trim() && attachments.length === 0) || isLoading}
              className="p-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-lg transition-colors shadow-xs"
              title="Trimite solicitarea"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
          <span>Puteți atașa: PDF, DOCX, imagini cu manualul sau programa școlară.</span>
          <span>Shift + Enter pentru rând nou</span>
        </div>
      </div>
    </div>
  );
};
