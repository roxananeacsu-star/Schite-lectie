import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { LessonPlanView } from './components/LessonPlanView';
import { SavedPlansView } from './components/SavedPlansView';
import { QuickLessonCreatorModal } from './components/QuickLessonCreatorModal';
import { ChatMessage, LessonPlan, UploadedAttachment } from './types';

const LOCAL_STORAGE_KEY = 'metodist_primar_saved_plans_v4';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lesson' | 'chat' | 'saved'>('lesson');
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [currentLesson, setCurrentLesson] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [isQuickCreatorOpen, setIsQuickCreatorOpen] = useState(false);

  // Initial welcome message from the Methodologist
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Bună ziua, doamna profesor Neacsu Roxana! Sunt asistentul dumneavoastră metodic pentru învățământul primar.

Vă asist cu drag în proiectarea schițelor de lecție. Structura metodică din documentul oficial «schițe de lecție.docx» este utilizată automat ca reper pedagogic pentru generarea oricărei teme solicitate.

• Puteți atașa oricând imagini cu pagini din manual, documente Word sau PDF folosind butonul «+ Atașează fișier resursă».
• Puteți genera instant schițe apăsând «Lecție Nouă» sau scriind direct tema în chat.
• Dacă o schiță generată nu este pe placul dumneavoastră, folosiți butonul «Șterge» pentru a o elimina sau «Regenerează» pentru a încerca alte idei și jocuri didactice!`,
      timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Lecție nouă Limba română Clasa a III-a: Substantivul',
        'Lecție MEM Clasa a II-a: Adunarea cu trecere peste ordin',
        'Științe ale naturii Clasa a IV-a: Părțile plantei',
      ],
    },
  ]);

  // Load saved plans on mount (strictly user-saved, not static templates)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: LessonPlan[] = JSON.parse(stored);
        setSavedPlans(parsed);
        if (parsed.length > 0) {
          setCurrentLesson(parsed[0]);
        }
      }
    } catch (e) {
      console.error('Eroare citire localStorage:', e);
    }
  }, []);

  const savePlanToStorage = (plan: LessonPlan) => {
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== plan.id);
      const updated = [plan, ...filtered];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const deletePlanFromStorage = (id: string) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleDeleteLesson = (id?: string) => {
    const targetId = id || currentLesson?.id;
    if (targetId) {
      deletePlanFromStorage(targetId);
    }
    if (!id || currentLesson?.id === id) {
      setCurrentLesson(null);
    }
  };

  const handleSendMessage = async (text: string, attachments: UploadedAttachment[]) => {
    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          attachments,
          currentLessonPlan: currentLesson,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.reply || data.error || 'Serviciul a întâmpinat o problemă.');
      }

      const assistantMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'Am generat schița conform cerințelor dumneavoastră.',
        timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        missingQuestions: data.needsMoreInfo ? data.clarifyingQuestions : undefined,
        lessonPlan: data.lessonPlan || undefined,
        suggestedPrompts: data.suggestedPrompts || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.lessonPlan) {
        setCurrentLesson(data.lessonPlan);
        savePlanToStorage(data.lessonPlan);
        setActiveTab('lesson');
      }
    } catch (err: any) {
      console.error('Eroare comunicare metodist:', err);
      let userFriendlyText =
        'A apărut o mică problemă temporară. Puteți reîncerca generarea folosind butonul de mai jos.';
      if (err.message && !err.message.includes('{')) {
        userFriendlyText = err.message;
      }
      const errorMessage: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: userFriendlyText,
        timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateLesson = async (param?: string | LessonPlan) => {
    let targetPlan = currentLesson;
    let instruction = '';

    if (typeof param === 'object' && param !== null) {
      targetPlan = param;
    } else if (typeof param === 'string') {
      instruction = param;
    }

    if (!targetPlan && !instruction) {
      setIsQuickCreatorOpen(true);
      return;
    }

    const prompt = instruction
      ? targetPlan
        ? `Ajustează și regenerează schița de lecție pentru Clasa ${targetPlan.clasa}, Disciplina ${targetPlan.disciplina}, Subiectul „${targetPlan.subiectulLectiei}”. Indicații didactice: ${instruction}`
        : instruction
      : `Regenerează schița de lecție pentru Clasa ${targetPlan!.clasa}, Disciplina ${targetPlan!.disciplina}, Subiectul „${targetPlan!.subiectulLectiei}” (${targetPlan!.tipulLectiei}). Propune o abordare didactică nouă, activități antrenante pe bancă, marcaje cu cretă roșie la tablă și un joc Wordwall adaptat, respectând structura metodică oficială.`;

    setActiveTab('lesson');
    await handleSendMessage(prompt, []);
  };

  const handleApplyPrompt = (prompt: string) => {
    handleSendMessage(prompt, []);
  };

  const handleOpenLesson = (lesson: LessonPlan) => {
    setCurrentLesson(lesson);
    setActiveTab('lesson');
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100 text-stone-900 font-sans overflow-hidden">
      {/* Header cu Navigare, Buton Chat & Resurse și Ecran Împărțit */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLesson={currentLesson}
        onOpenQuickCreator={() => setIsQuickCreatorOpen(true)}
        savedCount={savedPlans.length}
        isSplitView={isSplitView}
        onToggleSplitView={() => setIsSplitView((prev) => !prev)}
      />

      {/* Spațiu Principal de Lucru */}
      <main className="flex-1 overflow-hidden relative">
        {/* Mod Ecran Împărțit: Schiță de Lecție + Chat & Resurse alăturate */}
        {isSplitView && activeTab !== 'saved' ? (
          <div className="flex h-full w-full overflow-hidden">
            {/* Stânga: Schiță de Lecție */}
            <div className="flex-1 h-full overflow-hidden border-r border-stone-200">
              <LessonPlanView
                lesson={currentLesson}
                onUpdateLesson={(updated) => {
                  setCurrentLesson(updated);
                  savePlanToStorage(updated);
                }}
                onSaveToHistory={savePlanToStorage}
                onDeleteLesson={handleDeleteLesson}
                onRegenerateLesson={handleRegenerateLesson}
                isRegenerating={isLoading}
                onOpenQuickCreator={() => setIsQuickCreatorOpen(true)}
                onSwitchToChat={() => setActiveTab('chat')}
              />
            </div>

            {/* Dreapta: Chat & Atașare Fișiere Resursă */}
            <div className="w-[440px] xl:w-[490px] shrink-0 h-full flex flex-col bg-white shadow-lg border-l border-stone-200">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onOpenLesson={handleOpenLesson}
                currentLesson={currentLesson}
                onApplyPromptSuggestion={handleApplyPrompt}
                onDeleteLesson={handleDeleteLesson}
                onRegenerateLesson={(plan) => handleRegenerateLesson(plan)}
              />
            </div>
          </div>
        ) : (
          /* Mod Clasic pe File Separate */
          <>
            {activeTab === 'lesson' && (
              <div className="h-full w-full">
                <LessonPlanView
                  lesson={currentLesson}
                  onUpdateLesson={(updated) => {
                    setCurrentLesson(updated);
                    savePlanToStorage(updated);
                  }}
                  onSaveToHistory={savePlanToStorage}
                  onDeleteLesson={handleDeleteLesson}
                  onRegenerateLesson={handleRegenerateLesson}
                  isRegenerating={isLoading}
                  onOpenQuickCreator={() => setIsQuickCreatorOpen(true)}
                  onSwitchToChat={() => setActiveTab('chat')}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full max-w-4xl mx-auto flex flex-col bg-white shadow-xs">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onOpenLesson={handleOpenLesson}
                  currentLesson={currentLesson}
                  onApplyPromptSuggestion={handleApplyPrompt}
                  onDeleteLesson={handleDeleteLesson}
                  onRegenerateLesson={(plan) => handleRegenerateLesson(plan)}
                />
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="h-full max-w-4xl mx-auto p-4 sm:p-6 overflow-y-auto">
                <SavedPlansView
                  savedPlans={savedPlans}
                  onOpenLesson={handleOpenLesson}
                  onDeletePlan={deletePlanFromStorage}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Generator Rapid de Lecție cu Atașare Resurse Multiple */}
      <QuickLessonCreatorModal
        isOpen={isQuickCreatorOpen}
        onClose={() => setIsQuickCreatorOpen(false)}
        onSubmit={(prompt, attachments) => {
          setActiveTab('lesson');
          handleSendMessage(prompt, attachments || []);
        }}
      />
    </div>
  );
}
