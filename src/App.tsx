import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { LessonPlanView } from './components/LessonPlanView';
import { OfficialTemplateView } from './components/OfficialTemplateView';
import { SavedPlansView } from './components/SavedPlansView';
import { QuickLessonCreatorModal } from './components/QuickLessonCreatorModal';
import { ChatMessage, LessonPlan, UploadedAttachment } from './types';
import { SAMPLE_LESSON_PLANS } from './data/curriculumData';

const LOCAL_STORAGE_KEY = 'metodist_primar_saved_plans_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'lesson' | 'template' | 'saved'>('lesson');
  const [currentLesson, setCurrentLesson] = useState<LessonPlan | null>(SAMPLE_LESSON_PLANS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [isQuickCreatorOpen, setIsQuickCreatorOpen] = useState(false);

  // Initial welcome message from the Methodologist
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Bună ziua! Sunt Metodistul dumneavoastră didactic și Expert în Învățământul Primar.

Vă asist cu bucurie în proiectarea unor schițe de lecție interactive, captivante și riguros structurate, adaptate specificului vârstei școlare mici (Clasa Pregătitoare, Clasa I, a II-a, a III-a, a IV-a).

Cum doriți să începem?
1. Apăsați butonul „Generează Rapid” pentru a configura o lecție nouă în 3 pași simpli (clasă, disciplină, subiect).
2. Sau scrieți-mi direct în chat ori atașați o poză/fișier cu o pagină din manual.
3. Puteți explora oricând cele 3 schițe de referință din bara de sus (Componentele cărții, Semne de punctuație, Numerele naturale 0-10 000).

Toate schițele sunt conforme cu formatul oficial «schițe de lecție.docx», includ obiective măsurabile, etape clare, exemple cu roșu la tablă și jocuri interactive Wordwall!`,
      timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Vreau o schiță nouă la Limba română, Clasa a III-a',
        'Lecție MEM Clasa a II-a: Adunarea cu trecere peste ordin',
        'Științe ale naturii Clasa a IV-a: Părțile plantei',
        'Deschide formatul oficial schițe de lecție.docx',
      ],
    },
  ]);

  // Load saved plans on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      } else {
        setSavedPlans(SAMPLE_LESSON_PLANS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_LESSON_PLANS));
      }
    } catch (e) {
      console.error('Eroare la citirea din localStorage:', e);
      setSavedPlans(SAMPLE_LESSON_PLANS);
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Serverul a răspuns cu codul ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'Am analizat solicitarea dumneavoastră.',
        timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        missingQuestions: data.needsMoreInfo ? data.clarifyingQuestions : undefined,
        lessonPlan: data.lessonPlan || undefined,
        suggestedPrompts: data.suggestedPrompts || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.lessonPlan) {
        setCurrentLesson(data.lessonPlan);
        savePlanToStorage(data.lessonPlan);
      }
    } catch (err: any) {
      console.error('Eroare trimitere mesaj:', err);
      const errorMessage: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: `A apărut o problemă la comunicarea cu metodistul: ${err.message}. Vă rugăm să reîncercați.`,
        timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPrompt = (prompt: string) => {
    if (prompt.includes('Deschide formatul oficial')) {
      setActiveTab('template');
      return;
    }
    handleSendMessage(prompt, []);
  };

  const handleOpenLesson = (lesson: LessonPlan) => {
    setCurrentLesson(lesson);
    setActiveTab('lesson');
  };

  const handleLoadSample = (sample: LessonPlan) => {
    setCurrentLesson(sample);
    setActiveTab('lesson');
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100 text-stone-900 font-sans overflow-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLesson={currentLesson}
        onOpenQuickCreator={() => setIsQuickCreatorOpen(true)}
        onSelectSampleLesson={(sample) => {
          setCurrentLesson(sample);
          setActiveTab('lesson');
        }}
        savedCount={savedPlans.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Split Screen for Desktop: Chat on Left, Content on Right */}
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Left: Chat Panel */}
          <div
            className={`w-full lg:w-5/12 xl:w-4/12 h-full flex flex-col ${
              activeTab === 'chat' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onOpenLesson={handleOpenLesson}
              currentLesson={currentLesson}
              onApplyPromptSuggestion={handleApplyPrompt}
            />
          </div>

          {/* Right: Tabbed Content (Lesson Plan / Official Template / Saved Collection) */}
          <div
            className={`flex-1 h-full flex flex-col overflow-hidden ${
              activeTab === 'chat' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeTab === 'template' ? (
              <OfficialTemplateView onLoadSample={handleLoadSample} />
            ) : activeTab === 'saved' ? (
              <SavedPlansView
                savedPlans={savedPlans}
                onOpenLesson={handleOpenLesson}
                onDeletePlan={deletePlanFromStorage}
              />
            ) : (
              <LessonPlanView
                lesson={currentLesson}
                onUpdateLesson={(updated) => {
                  setCurrentLesson(updated);
                  savePlanToStorage(updated);
                }}
                onSaveToHistory={savePlanToStorage}
                onAskMethodologistToTweak={(instruction) => {
                  setActiveTab('chat');
                  handleSendMessage(instruction, []);
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Quick Lesson Creator Wizard Modal */}
      <QuickLessonCreatorModal
        isOpen={isQuickCreatorOpen}
        onClose={() => setIsQuickCreatorOpen(false)}
        onSubmit={(prompt) => {
          setActiveTab('chat');
          handleSendMessage(prompt, []);
        }}
      />
    </div>
  );
}
