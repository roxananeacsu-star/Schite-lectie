import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Gamepad2,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Download,
  Copy,
  ExternalLink,
  Check,
  Star,
  Zap,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { InteractiveGameActivity, LessonPlan } from '../types';
import {
  downloadBlooketCsvFile,
  formatQuestionsForBlooket,
  formatQuestionsForWayground,
} from '../utils/gameGenerator';

interface InteractiveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: InteractiveGameActivity;
  lesson: LessonPlan;
  initialTab?: 'play' | 'blooket' | 'wayground' | 'questions';
}

export const InteractiveGameModal: React.FC<InteractiveGameModalProps> = ({
  isOpen,
  onClose,
  activity,
  lesson,
  initialTab = 'play',
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'blooket' | 'wayground' | 'questions'>(initialTab);
  const [copiedBlooket, setCopiedBlooket] = useState(false);
  const [copiedWayground, setCopiedWayground] = useState(false);

  // Stare pentru modul de joc interactiv la tablă
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<boolean[]>([]);

  if (!isOpen) return null;

  const currentQ = activity.intrebari[currentQuestionIdx];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ?.raspunsCorect;

  // Sunete Web Audio prietenoase pentru copii
  const playSound = (type: 'correct' | 'wrong' | 'win') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25); // A5
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option === currentQ.raspunsCorect;
    if (correct) {
      setScore((prev) => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }
    setAnswersHistory((prev) => [...prev, correct]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activity.intrebari.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsGameFinished(true);
      playSound('win');
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsGameFinished(false);
    setAnswersHistory([]);
  };

  const handleCopyBlooket = () => {
    const text = formatQuestionsForBlooket(activity, lesson);
    navigator.clipboard.writeText(text);
    setCopiedBlooket(true);
    setTimeout(() => setCopiedBlooket(false), 2000);
  };

  const handleCopyWayground = () => {
    const text = formatQuestionsForWayground(activity, lesson);
    navigator.clipboard.writeText(text);
    setCopiedWayground(true);
    setTimeout(() => setCopiedWayground(false), 2000);
  };

  const optionColors = [
    'from-red-500 to-rose-600 border-red-600 text-white',
    'from-blue-600 to-indigo-600 border-blue-700 text-white',
    'from-amber-500 to-orange-500 border-amber-600 text-white',
    'from-emerald-600 to-teal-600 border-emerald-700 text-white',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Antet cu stil ludic */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-gradient-to-r from-indigo-900 via-blue-900 to-violet-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Gamepad2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                  ACTIVITATE DIDACTICĂ LUDICĂ
                </span>
                <span className="text-xs text-blue-200 font-semibold">{lesson.clasa}</span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                {activity.titluJoc}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Taburi de Navigare: Joc la Tablă | Blooket | Wayground | Întrebări */}
        <div className="flex items-center bg-stone-100 p-1.5 border-b border-stone-200 gap-1 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('play')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'play'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-blue-600" />
            <span>🕹️ Joacă la Tablă (Pe ecran)</span>
          </button>

          <button
            onClick={() => setActiveTab('blooket')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'blooket'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="text-sm">🦊</span>
            <span>Blooket Hub (blooket.com)</span>
          </button>

          <button
            onClick={() => setActiveTab('wayground')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'wayground'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Wayground (wayground.com)</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span>Listă Întrebări ({activity.intrebari.length})</span>
          </button>
        </div>

        {/* Corp Modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 text-stone-800">
          {/* TAB 1: JOCUL INTERACTIV PE ECRAN / LA TABLĂ */}
          {activeTab === 'play' && (
            <div className="h-full flex flex-col justify-between max-w-2xl mx-auto">
              {!isGameFinished ? (
                <>
                  {/* Indicator progres și scor */}
                  <div className="flex items-center justify-between mb-4 text-xs font-bold text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>
                        Întrebarea {currentQuestionIdx + 1} din {activity.intrebari.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>Scor: {score} puncte</span>
                    </div>
                  </div>

                  {/* Bara de progres vizual */}
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIdx + 1) / activity.intrebari.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Cardul cu Întrebarea */}
                  <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-3xl shadow-sm text-center mb-5">
                    <span className="inline-block text-[11px] font-extrabold uppercase text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full mb-3 border border-blue-200">
                      Tema: {lesson.subiectulLectiei}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-stone-900 leading-snug">
                      {currentQ.intrebare}
                    </h2>
                  </div>

                  {/* Grilă Variante de Răspuns (Stil Blooket / Kahoot colorat) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {currentQ.variante.map((variant, idx) => {
                      const isThisSelected = selectedOption === variant;
                      const isThisCorrect = variant === currentQ.raspunsCorect;

                      let btnStyle = `p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base text-left transition-all border shadow-xs flex items-center justify-between cursor-pointer `;

                      if (!isAnswered) {
                        btnStyle += `bg-white hover:bg-stone-50 border-stone-300 hover:border-blue-500 hover:scale-[1.01] text-stone-900`;
                      } else {
                        if (isThisCorrect) {
                          btnStyle += `bg-emerald-600 text-white border-emerald-700 shadow-md ring-4 ring-emerald-500/20`;
                        } else if (isThisSelected) {
                          btnStyle += `bg-red-600 text-white border-red-700 shadow-md`;
                        } else {
                          btnStyle += `bg-stone-100 text-stone-400 border-stone-200 opacity-60`;
                        }
                      }

                      const letters = ['A', 'B', 'C', 'D'];

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(variant)}
                          disabled={isAnswered}
                          className={btnStyle}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                isAnswered
                                  ? isThisCorrect
                                    ? 'bg-white text-emerald-800'
                                    : isThisSelected
                                    ? 'bg-white text-red-800'
                                    : 'bg-stone-200 text-stone-600'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {letters[idx] || idx + 1}
                            </span>
                            <span>{variant}</span>
                          </div>

                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                          )}
                          {isAnswered && isThisSelected && !isThisCorrect && (
                            <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback și Explicație după răspuns */}
                  {isAnswered && (
                    <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                      <div className="flex items-start gap-2.5 text-xs text-stone-700">
                        {isCorrect ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                            <XCircle className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-sm text-stone-900">
                            {isCorrect ? 'Bravo! Răspuns corect! 🎉' : 'Mai încearcă! Răspunsul corect este marcat cu verde.'}
                          </div>
                          {currentQ.explicatie && (
                            <p className="text-[11px] text-stone-500 mt-0.5">{currentQ.explicatie}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all"
                      >
                        <span>
                          {currentQuestionIdx < activity.intrebari.length - 1 ? 'Următoarea' : 'Vezi Rezultatul'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* ECRAN FINAL DE PREMIERE */
                <div className="text-center py-6 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                    Felicitări elevilor Clasei {lesson.clasa}! 🏆
                  </h2>
                  <p className="text-xs text-stone-600 mb-4">
                    Ați parcurs cu succes activitatea ludică pentru tema «{lesson.subiectulLectiei}».
                  </p>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block mb-6">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                      Scor Total Obținut:
                    </div>
                    <div className="text-3xl font-black text-amber-700">
                      {score} / {activity.intrebari.length} puncte
                    </div>
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: activity.intrebari.length }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < score ? 'text-amber-500 fill-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      onClick={handleRestartGame}
                      className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reia Jocul la Tablă</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('blooket')}
                      className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>🦊 Trimite în Blooket</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BLOOKET HUB (blooket.com) */}
          {activeTab === 'blooket' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100">
                    <span>Platformă gratuită preferată</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Blooket (blooket.com)</h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Generează instant jocuri antrenante (Gold Quest, Tower Defense, Crypto Hack) pentru elevi.
                  </p>
                </div>
                <a
                  href="https://www.blooket.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white text-stone-900 rounded-xl text-xs font-extrabold shadow-sm hover:bg-amber-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Deschide Blooket</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Acțiuni Rapide de Export Blooket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => downloadBlooketCsvFile(activity, lesson)}
                  className="p-4 bg-white border-2 border-amber-300 hover:border-amber-500 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-sm text-stone-900">
                    Descarcă Fișier Blooket (.CSV)
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Gata de import direct în contul gratuit Blooket prin «Import Spreadsheet».
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleCopyBlooket}
                  className="p-4 bg-white border-2 border-stone-200 hover:border-blue-500 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {copiedBlooket ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </div>
                  <div className="font-extrabold text-sm text-stone-900">
                    {copiedBlooket ? 'Copiat în Clipboard! ✅' : 'Copiază Setul de Întrebări'}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Copiază întrebările și variantele pentru a le lipi direct în Blooket.
                  </p>
                </button>
              </div>

              {/* Ghid Pas cu Pas pentru Cadre Didactice */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900 uppercase text-[11px] tracking-wider">
                  Cum folosiți fișierul în Blooket în 20 de secunde (100% Gratuit):
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-600 font-medium">
                  <li>
                    Deschideți <strong className="text-stone-900">blooket.com</strong> și vă conectați (gratuit cu Google).
                  </li>
                  <li>
                    Apăsați butonul <strong className="text-amber-800">Create</strong> (sus în dreapta), apoi selectați <strong className="text-amber-800">CSV Import / Import Spreadsheet</strong>.
                  </li>
                  <li>
                    Încărcați fișierul <strong className="text-stone-900">.csv</strong> descărcat de mai sus. Toate întrebările și variantele se populează instant!
                  </li>
                  <li>
                    Apăsați <strong className="text-emerald-700">Host</strong> și lansați jocul preferat al copiilor (Tower Defense, Gold Quest, Battle Royale)!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: WAYGROUND HUB (wayground.com) */}
          {activeTab === 'wayground' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
                    <span>Chestionare interactive moderne</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Wayground (wayground.com)</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Platformă interactivă gratuită pentru evaluare formativă, jocuri și chestionare rapide.
                  </p>
                </div>
                <a
                  href="https://wayground.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white text-emerald-950 rounded-xl text-xs font-extrabold shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Deschide Wayground</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Acțiune Copiere pentru Wayground */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="font-extrabold text-sm text-stone-900">
                    Set de întrebări formatat pentru Wayground
                  </div>
                  <p className="text-xs text-stone-500">
                    Include cele {activity.intrebari.length} întrebări cu variante A/B/C/D și răspunsul corect indicat.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWayground}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  {copiedWayground ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWayground ? 'Copiat!' : 'Copiază Setul'}</span>
                </button>
              </div>

              {/* Previzualizare format Wayground */}
              <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-2xl border border-stone-800 max-h-64 overflow-y-auto whitespace-pre-wrap">
                {formatQuestionsForWayground(activity, lesson)}
              </div>
            </div>
          )}

          {/* TAB 4: LISTĂ COMPLETĂ ÎNTREBĂRI */}
          {activeTab === 'questions' && (
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                <span className="font-bold text-stone-900">
                  Total: {activity.intrebari.length} întrebări concepute pentru {lesson.clasa}
                </span>
                <button
                  onClick={() => downloadBlooketCsvFile(activity, lesson)}
                  className="text-blue-700 hover:underline font-bold text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descarcă fișier CSV</span>
                </button>
              </div>

              {activity.intrebari.map((q, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {idx + 1}. {q.intrebare}
                    </span>
                    <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full shrink-0">
                      20 sec
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {q.variante.map((v, vIdx) => {
                      const isCorrect = v.trim().toLowerCase() === q.raspunsCorect.trim().toLowerCase();
                      return (
                        <div
                          key={vIdx}
                          className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <span>{v}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explicatie && (
                    <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg">
                      💡 {q.explicatie}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span className="truncate">
            Activitate adaptată pentru: <strong>{lesson.subiectulLectiei}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};
