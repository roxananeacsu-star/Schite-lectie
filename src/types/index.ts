export type PrimaryGrade = 
  | 'Clasa Pregătitoare' 
  | 'Clasa I' 
  | 'Clasa a II-a' 
  | 'Clasa a III-a' 
  | 'Clasa a IV-a';

export type PrimarySubject = 
  | 'Comunicare în limba română'
  | 'Limba și literatura română'
  | 'Matematică și explorarea mediului'
  | 'Matematică'
  | 'Științe ale naturii'
  | 'Educație civică'
  | 'Istorie'
  | 'Geografie'
  | 'Arte vizuale și abilități practice'
  | 'Muzică și mișcare'
  | 'Joc și mișcare'
  | 'Dezvoltare personală'
  | 'Limba modernă (Engleză/Franceză)';

export type LessonType = 
  | 'Lecție de dobândire de noi cunoștințe'
  | 'Lecție de formare de priceperi și deprinderi'
  | 'Lecție de consolidare și sistematizare'
  | 'Lecție de evaluare a performanțelor școlare'
  | 'Lecție mixtă / combinată';

export interface LessonStage {
  id: string;
  numeEtapa: string; // ex: "Momentul organizatoric și captarea atenției"
  timpAlocat: string; // ex: "5 min"
  activitateaProfesorului: string;
  activitateaElevilor: string;
  metodeMijloace: string; // ex: "Conversația, explicația; Manual, caiet, fișe; Frontal"
  marcajeTablaVizuale?: string; // ex: "Scrie cu roșu data și titlul; subliniază cuvintele-cheie"
  resurseFizice?: string; // ex: "Cărți deschise pe bancă la pag. 42, jetoane colorate"
}

export interface FeedbackFinal {
  timpAlocat: string; // ex: "5 min"
  metodaVerificare: string; // ex: "Metoda 'Arată și spune', recapitulare frontală, autoevaluare cu semafor"
  jocuriDigitaleSiInteractive: string; // ex: "Joc Wordwall 'Roata cuvintelor', concurs pe grupe"
  linkWordwallExemplu?: string; // ex: "https://wordwall.net/ro/resource/..."
  aprecieriSiConcluzii: string; // ex: "Aprecieri verbale individuale și colective, recompense cu buline vesele"
}

export interface LessonPlan {
  id: string;
  titlu: string;
  clasa: string; // ex: "Clasa a III-a A"
  profesor: string; // ex: "Prof. înv. primar Elena Ionescu"
  data: string; // ex: "23 Septembrie 2026"
  disciplina: string; // ex: "Limba și literatura română"
  subiectulLectiei: string; // ex: "Substantivul - parte de vorbire"
  tipulLectiei: string; // ex: "Lecție de dobândire de noi cunoștințe"
  durata: string; // ex: "45-50 minute"
  obiectiveOperationale: string[]; // ex: ["O1: Să identifice substantivele...", "O2: Să recunoască..."]
  activitatiPlanificate: LessonStage[];
  feedbackFinal: FeedbackFinal;
  sugestiiDiferentiere?: string; // Pentru copii cu ritm rapid sau care au nevoie de sprijin suplimentar
  schemaTablei?: string; // Schița tablei (ce se scrie cu cretă albă/colorată, subliniat cu roșu)
  createdAt: number;
}

export interface UploadedAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'doc' | 'text' | 'file';
  size: number;
  previewUrl?: string;
  dataBase64?: string;
  mimeType?: string;
  extractedText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: UploadedAttachment[];
  lessonPlan?: LessonPlan;
  missingQuestions?: string[];
  suggestedPrompts?: string[];
  isAnalysisOnly?: boolean;
}
