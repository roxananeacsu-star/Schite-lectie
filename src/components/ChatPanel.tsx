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
  UploadCloud,
  File,
} from 'lucide-react';
import { ChatMessage, UploadedAttachment, LessonPlan } from '../types';
import { processMultipleFiles } from '../utils/fileParser';
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
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
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

    setIsProcessingFiles(true);
    try {
      const newAttachments = await processMultipleFiles(files);
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error('Eroare procesare fișiere:', err);
    } finally {
      setIsProcessingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    try {
      const newAttachments = await processMultipleFiles(files);
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error('Eroare procesare fișiere drop:', err);
    } finally {
      setIsProcessingFiles(false);
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
      <div className="p-3 bg-white border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-bold text-stone-800 shrink-0">
            Metodist Didactic
          </span>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <span className="text-stone-500 truncate hidden md:inline">
            Atașează orice resurse (foto manual, programă PDF, fișe Word)
          </span>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          title="Atașează mai multe fișiere: foto pagină manual, PDF, Word etc."
        >
          <Paperclip className="w-3.5 h-3.5 text-blue-700" />
          <span>+ Încarcă fișiere multiple</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'bg-blue-700 text-white rounded-tr-xs hover:shadow-sm'
                  : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs hover:shadow-sm hover:border-stone-300'
              }`}
            >
              {/* Message Header */}
              <div
                className={`flex items-center justify-between gap-3 text-[11px] mb-2 font-medium ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-stone-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {msg.sender === 'user' ? (
                    <span>Prof. Neacsu Roxana</span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" /> Metodist Învățământ Primar
                    </span>
                  )}
                </div>
                <span>{msg.timestamp}</span>
              </div>

              {/* Attachments preview if user attached files */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  <div
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-stone-500'
                    }`}
                  >
                    Resurse atașate ({msg.attachments.length}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-800/80 border-blue-600 text-white'
                            : 'bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        {att.previewUrl ? (
                          <img
                            src={att.previewUrl}
                            alt={att.name}
                            className="w-9 h-9 object-cover rounded-lg border border-white/20 shrink-0"
                          />
                        ) : att.type === 'pdf' ? (
                          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            PDF
                          </div>
                        ) : att.type === 'docx' || att.type === 'doc' ? (
                          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            DOC
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                            <File className="w-4 h-4" />
                          </div>
                        )}
                        <div className="truncate flex-1 min-w-0">
                          <p className="font-semibold truncate text-xs">{att.name}</p>
                          <p className="text-[10px] opacity-80 uppercase">
                            {formatFileSize(att.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans">
                {msg.sender === 'user' ? (
                  <span className="text-white">{msg.text}</span>
                ) : (
                  <div className="text-stone-800">{msg.text}</div>
                )}
              </div>

              {/* Proactive Clarification Questions Card */}
              {msg.missingQuestions && msg.missingQuestions.length > 0 && (
                <div className="mt-3.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-stone-800">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Detalii necesare pentru a personaliza schița:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside">
                    {msg.missingQuestions.map((q, idx) => (
                      <li key={idx} className="font-medium">
                        {q}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-800 mt-2 italic">
                    Răspundeți pe scurt sau atașați o fotografie cu pagina din manual / programa școlară.
                  </p>
                </div>
              )}

              {/* Generated Lesson Plan Card Indicator */}
              {msg.lessonPlan && (
                <div className="mt-3.5 p-3.5 bg-blue-50/90 border border-blue-200/90 rounded-2xl text-stone-900 shadow-xs hover:shadow-sm hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Schiță Proiectată Conform Formatului Oficial</span>
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-stone-900 mt-1">
                        {msg.lessonPlan.subiectulLectiei}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {msg.lessonPlan.clasa} · {msg.lessonPlan.disciplina} ({msg.lessonPlan.tipulLectiei})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onRegenerateLesson && (
                        <button
                          onClick={() => onRegenerateLesson(msg.lessonPlan!)}
                          title="Regenerează această schiță"
                          className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-150 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      {onDeleteLesson && (
                        <button
                          onClick={() => onDeleteLesson(msg.lessonPlan!.id)}
                          title="Șterge schița din ecran"
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-150 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Operational Objectives Preview */}
                  {msg.lessonPlan.obiectiveOperationale && (
                    <div className="mt-2.5 pt-2.5 border-t border-blue-200/60 text-xs text-stone-700">
                      <span className="font-bold text-stone-900 block mb-1">Obiective operaționale:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-600">
                        {msg.lessonPlan.obiectiveOperationale.slice(0, 3).map((obj, i) => (
                          <li key={i} className="truncate">
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-3 pt-2.5 border-t border-blue-200/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenLesson(msg.lessonPlan!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Deschide Schița Completă</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleExportLesson(msg.lessonPlan!)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                      title="Descarcă documentul Word formatat (.docx)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-700" />
                      <span>DOCX</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-2xl max-w-md shadow-xs animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              <Sparkles className="w-4 h-4 animate-spin text-blue-700" />
            </div>
            <div className="text-xs sm:text-sm text-stone-700">
              <span className="font-bold text-blue-950 block">Metodistul proiectează schița...</span>
              <span className="text-[11px] text-stone-500">
                Analizează resursele atașate, formulează obiectivele și etapele didactice.
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="p-4 mx-4 mb-2 bg-blue-100 border-2 border-dashed border-blue-500 rounded-2xl text-center text-blue-900 text-xs font-bold animate-pulse">
          Plasați aici fișierele (foto manual, programă PDF, Word DOCX etc.)
        </div>
      )}

      {/* Attachment Staged Preview Bar */}
      {attachments.length > 0 && (
        <div className="p-3 bg-blue-50/80 border-t border-blue-200">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-950 mb-2">
            <span>Resurse pregătite pentru trimitere ({attachments.length}):</span>
            <button
              onClick={() => setAttachments([])}
              className="text-red-600 hover:underline text-[10px] cursor-pointer"
            >
              Șterge toate
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-xl border border-blue-200 text-xs shadow-2xs hover:shadow-xs hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                {att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-6 h-6 object-cover rounded-md border border-stone-200 shrink-0"
                  />
                ) : att.type === 'pdf' ? (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 font-bold text-[9px] rounded">
                    PDF
                  </span>
                ) : att.type === 'docx' || att.type === 'doc' ? (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 font-bold text-[9px] rounded">
                    DOC
                  </span>
                ) : (
                  <File className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                )}
                <span className="max-w-[130px] truncate text-stone-900 font-semibold text-xs">
                  {att.name}
                </span>
                <span className="text-[10px] text-stone-400">
                  {formatFileSize(att.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-stone-400 hover:text-red-600 p-0.5 rounded-full transition-colors cursor-pointer"
                  title="Elimină"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-200/90 shadow-[0_-1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-end gap-2 bg-stone-50 border border-stone-300/90 rounded-2xl p-2 shadow-2xs focus-within:shadow-xs focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/30 focus-within:border-blue-600 transition-all duration-200">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              attachments.length > 0
                ? 'Precizați clasa sau cerințe pentru fișierele atașate (sau apăsați Trimite direct)...'
                : 'Scrieți solicitarea sau apăsați agrafa pentru a atașa foto din manual, PDF, Word...'
            }
            rows={2}
            className="flex-1 bg-transparent resize-none text-stone-900 text-xs sm:text-sm focus:outline-none placeholder:text-stone-400"
          />

          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Atașează mai multe fișiere (foto pagină manual, PDF, Word etc.)"
              className="p-2 text-stone-600 hover:text-blue-700 hover:bg-stone-200/70 hover:shadow-2xs hover:-translate-y-0.5 active:translate-y-0 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <Paperclip className="w-4 h-4 text-blue-700" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={(!inputText.trim() && attachments.length === 0) || isLoading || isProcessingFiles}
              className="p-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              title="Trimite către metodist"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
          <span>Puteți atașa oricâte imagini, PDF-uri sau documente simultan.</span>
          <span>Shift + Enter pentru rând nou</span>
        </div>
      </div>
    </div>
  );
};
