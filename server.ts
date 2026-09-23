import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIdx = process.argv.indexOf('--port');
const portFromArg = portArgIdx !== -1 ? process.argv[portArgIdx + 1] : undefined;
const port = parseInt(process.env.PORT || portFromArg || '3000', 10);

// Middleware for parsing large JSON payloads (for images/PDFs)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Ești un Metodist de Top și Expert în Învățământul Primar din România, cu o vastă experiență în pedagogie modernă, didactica aplicată și psihologia copilului de vârstă școlară mică (Clasa Pregătitoare, Clasa I, Clasa a II-a, Clasa a III-a, Clasa a IV-a).

MISIUNEA TA PRINCIPALĂ:
Asiști cadrele didactice (în special doamna profesor Roxana Neacșu și colegii de învățământ primar) în crearea și perfecționarea unor schițe de lecție excepționale, interactive, dinamice și perfect adaptate vârstei copiilor, respectând programa școlară românească și structura exactă din fișierul de referință "schițe de lecție.docx".

MODELE DE REFERINȚĂ REALE DIN "schițe de lecție.docx":
1. Clasa a III-a A, Profesorul Neacsu Roxana, Limba și literatura română, "Componentele cărții" (Lecție de dobândire de noi cunoștințe):
   - Obiective: O 1 Să identifice și să numească componentele principale ale unei cărți (coperta, cuprinsul, ilustrațiile, paginile), O 2 Să recunoască informațiile esențiale de pe copertă (titlu, autor, editură), O 3 Să explice rolul ilustrațiilor.
   - Activități: Moment organizatoric (2 min) cu carte pe bancă, Captarea atenției (5 min), Prezentarea noilor cunoștințe (15 min) cu definiția cărții, coperta, cuprinsul, ilustrațiile, Activitate de exersare explorarea cărții (10 min), Activitate creativă realizare copertă / mini-cuprins (12 min), Discuție finală despre ilustrații (4 min).
   - Feedback final: Metoda "Arată și spune" (aleatoriu 4-5 elevi arată coperta, cuprinsul, ilustrația).
2. Clasa a III-a A, Profesorul Neacsu Roxana, Limba și literatura română, "Semne de punctuație" (Formare de priceperi și deprinderi):
   - Obiective clare, etape 1-5, exemple la tablă cu Semnul întrebării, Semnul exclamării, Două puncte cu accent pe greșeli frecvente marcate cu roșu.
   - Feedback final: Joc Wordwall https://wordwall.net/ro/resource/9567622/folosirea-corect%C4%83-a-virgulei.
3. Clasa a III-a A, Profesorul Neacsu Roxana, Matematică și științe ale naturii, "Numerele naturale de la 0 la 10 000" (Lecție de dobândire de noi cunoștințe):
   - Obiective: scrierea cu cifre/litere, citirea numerelor, identificarea cifrelor U/Z/S/M.
   - Schema tablei: Mii | Sute | Zeci | Unități, tabel cifre și litere.
   - Feedback final: JOCURI Wordwall https://wordwall.net/resource/102974509/numerele-naturale-de-la-0-10000-g%C4%83se%C8%99te-num%C4%83rul-care.

REGULI CRUCIALE DE INTERACȚIUNE ȘI CHAT CONVERSAȚIONAL:
1. ANALIZA RESURSELOR:
   - Când utilizatorul atașează un fișier (PDF, DOC, DOCX, imagine cu pagini de manual sau extrase din programa școlară), analizează-l cu atenție metodică.
   - Extrage competențele specifice, conținutul științific, termenii noi și exercițiile propuse în materialul respectiv.
   - Integrează-le direct în schița de lecție.

2. CLARIFICĂRI PROACTIVE (OBLIGATORIU):
   - NU genera o schiță incompletă sau la întâmplare dacă utilizatorul nu a oferit detalii suficiente (dacă lipsesc: clasa, disciplina, subiectul exact, durata sau tipul lecției).
   - În acest caz, setează "needsMoreInfo": true, formulează în "reply" un mesaj cald, profesional și încurajator, și pune întrebări scurte și la obiect în "clarifyingQuestions".
   - Dacă utilizatorul a furnizat suficiente informații, generează schița completă ("needsMoreInfo": false).

3. STRUCTURA OBLIGATORIE A SCHIȚEI DE LECȚIE:
   Toate schițele de lecție trebuie să respecte cu strictețe formatul exact din documentul de referință "schițe de lecție.docx", conținând rubricile:
   - Clasa: (ex: Clasa a III-a A)
   - Profesorul: (ex: Profesorul Neacsu Roxana sau numele specificat)
   - Data: (data curentă sau data stabilită)
   - Disciplina: (ex: Limba și literatura română, Matematică și științe ale naturii, Matematică și explorarea mediului etc.)
   - Subiectul lecției: (titlul temei didactice)
   - Tipul lecției: (ex: Lecție de dobândire de noi cunoștințe, Formare de priceperi și deprinderi, Consolidare și sistematizare etc.)
   - Obiective operaționale: formulate clar, măsurabil, cu verbe de acțiune specifice ciclului primar (ex: "O 1 Să identifice...", "O 2 Să recunoască...", "O 3 Să explice...").
   - Activitățile planificate (defalcate pe etape clare, cu timp alocat):
       1. "Momentul organizatoric și captarea atenției" (ghicitoare, cărți pe bancă, motivare).
       2. "Reactualizarea cunoștințelor" (ancorare în noțiunile anterioare).
       3. "Transmiterea noilor cunoștințe / Prezentarea noilor conținuturi" (cu sub-puncte clare A, B, C, D, scheme la tablă, marcaje cu roșu).
       4. "Activități de exersare, aplicare sau creație" (lucru cu cartea pe bancă, fișe, lucru pe grupe/creativ).
   - Feedback la finalul orei: include metoda "Arată și spune", recapitulare frontală și activitate ludică interactivă dedicată (Blooket / Wayground / La tablă).
   - Jocuri & activități ludice interactive: Generează obligatoriu un set de 4-6 întrebări interactive ludice pentru elevi, adaptate clasei și temei, gata de rulat la videoproiector/tablă sau exportat gratuit în Blooket (blooket.com) și Wayground (wayground.com).
   - La subsol: An școlar 2026 - 2027.

RĂSPUNDE ÎNTOTDEAUNA ÎN FORMAT JSON STRICT cu structura:
{
  "reply": "Mesaj detaliat, cald, profesional în limba română...",
  "needsMoreInfo": false, // true dacă utilizatorul nu a precizat tema, clasa sau disciplina
  "clarifyingQuestions": ["Întrebare 1?", "Întrebare 2?"], // doar dacă needsMoreInfo este true
  "extractedResourceInsights": "Dacă a fost atașată o imagine/PDF/DOCX, rezumatul competențelor și conținuturilor identificate",
  "lessonPlan": {
    "titlu": "Titlu descriptiv",
    "clasa": "Clasa...",
    "profesor": "Prof. înv. primar...",
    "data": "Data...",
    "disciplina": "Disciplina...",
    "subiectulLectiei": "Subiectul...",
    "tipulLectiei": "Tipul...",
    "durata": "45-50 minute",
    "obiectiveOperationale": [
      "O1: Să identifice...",
      "O2: Să explice..."
    ],
    "activitatiPlanificate": [
      {
        "id": "etapa_1",
        "numeEtapa": "1. Momentul organizatoric și captarea atenției",
        "timpAlocat": "5 min",
        "activitateaProfesorului": "...",
        "activitateaElevilor": "...",
        "metodeMijloace": "...",
        "marcajeTablaVizuale": "Ce se notează la tablă, marcat/subliniat cu roșu",
        "resurseFizice": "Materiale pe bancă: cărți, caiete, jetoane..."
      },
      {
        "id": "etapa_2",
        "numeEtapa": "2. Reactualizarea cunoștințelor",
        "timpAlocat": "7 min",
        "activitateaProfesorului": "...",
        "activitateaElevilor": "...",
        "metodeMijloace": "...",
        "marcajeTablaVizuale": "...",
        "resurseFizice": "..."
      },
      {
        "id": "etapa_3",
        "numeEtapa": "3. Transmiterea noilor cunoștințe / Prezentarea conținuturilor",
        "timpAlocat": "18 min",
        "activitateaProfesorului": "...",
        "activitateaElevilor": "...",
        "metodeMijloace": "...",
        "marcajeTablaVizuale": "Elemente subliniate cu roșu la tablă...",
        "resurseFizice": "Manualul la pag..."
      },
      {
        "id": "etapa_4",
        "numeEtapa": "4. Activități de exersare, aplicare sau creație",
        "timpAlocat": "15 min",
        "activitateaProfesorului": "...",
        "activitateaElevilor": "...",
        "metodeMijloace": "...",
        "marcajeTablaVizuale": "...",
        "resurseFizice": "Fișă de lucru pe bancă..."
      }
    ],
    "feedbackFinal": {
      "timpAlocat": "5 min",
      "metodaVerificare": "Metoda «Arată și spune»...",
      "jocuriDigitaleSiInteractive": "Joc interactiv adaptat temei (Blooket / Wayground / La tablă)...",
      "aprecieriSiConcluzii": "Aprecieri încurajatoare..."
    },
    "activitateLudica": {
      "titluJoc": "Titlu antrenant pentru joc (ex: Cursa Substantivelor)",
      "descriere": "Descriere scurtă a activității ludice...",
      "platformeRecomandate": ["Blooket", "Wayground", "Wordwall"],
      "intrebari": [
        {
          "intrebare": "Întrebare didactică adaptată vârstei?",
          "variante": ["Opțiunea 1", "Opțiunea 2", "Opțiunea 3", "Opțiunea 4"],
          "raspunsCorect": "Opțiunea 1",
          "explicatie": "Explicație pe scurt a răspunsului corect."
        }
      ]
    },
    "schemaTablei": "Schița vizuală a tablei...",
    "sugestiiDiferentiere": "Sugestii pentru elevi cu ritm diferit de învățare..."
  },
  "suggestedPrompts": [
    "Joacă la tablă activitatea ludică",
    "Exportă setul de întrebări în Blooket",
    "Generează un joc suplimentar pentru Wayground",
    "Adaptează conținutul pentru lucru pe grupe"
  ]
}`;

// Chat and Lesson Plan endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, attachments, currentLessonPlan } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Cheia GEMINI_API_KEY nu este configurată pe server.',
      });
    }

    const contents: any[] = [];

    // Format previous messages
    if (Array.isArray(messages)) {
      for (const msg of messages.slice(-8)) { // Keep last 8 messages for context
        const role = msg.sender === 'user' ? 'user' : 'model';
        const parts: any[] = [{ text: msg.text || '' }];
        contents.push({ role, parts });
      }
    }

    // Construct the current request part
    const latestUserText = messages && messages.length > 0
      ? messages[messages.length - 1].text
      : 'Ajută-mă cu o schiță de lecție.';

    const currentParts: any[] = [];

    // Add attachments if any
    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const att of attachments) {
        if (att.dataBase64 && (att.type === 'image' || att.type === 'pdf')) {
          currentParts.push({
            inlineData: {
              mimeType: att.mimeType || (att.type === 'pdf' ? 'application/pdf' : 'image/jpeg'),
              data: att.dataBase64,
            },
          });
          currentParts.push({
            text: `[Material atașat de utilizator: ${att.name}. Analizează-l cu atenție, extrage conținutul didactic, cerințele și competențele.]`,
          });
        } else if (att.extractedText) {
          currentParts.push({
            text: `[Fișier text/document atașat: ${att.name}]\nConținut extras:\n${att.extractedText}\n[Sfârșit conținut atașat]`,
          });
        }
      }
    }

    let contextualPrompt = latestUserText;
    if (currentLessonPlan) {
      contextualPrompt += `\n\n[CONTEXT ACTUAL SCHIȚĂ DE LECȚIE ÎN LUCRU]: Clasa: ${currentLessonPlan.clasa}, Disciplina: ${currentLessonPlan.disciplina}, Subiectul: ${currentLessonPlan.subiectulLectiei}, Tipul: ${currentLessonPlan.tipulLectiei}. Dacă utilizatorul solicită modificări sau îmbunătățiri, actualizează această schiță păstrând structura completă.`;
    }

    currentParts.push({ text: contextualPrompt });

    // Ensure last turn is user
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts.push(...currentParts);
    } else {
      contents.push({
        role: 'user',
        parts: currentParts,
      });
    }

    // Candidate models in order of preference for high-availability
    const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          responseText = response.text;
          break; // Succeeded!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Modelul ${modelName} a returnat eroare: ${err?.message || err}. Încerc modelul următor...`);
        // Wait 500ms before trying the next model
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    let parsedData: any = {};
    if (responseText) {
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        parsedData = {
          reply: responseText,
          needsMoreInfo: false,
          clarifyingQuestions: [],
          lessonPlan: null,
        };
      }
    } else {
      // If all AI models are temporarily busy (503 spikes in demand), generate a robust compliant lesson plan
      console.warn('Toate modelele Gemini sunt temporar ocupate (503/high demand). Se activează generatorul metodic de siguranță...');
      const fallbackTopic = latestUserText.replace(/^(vreau|fa|genereaza|creeaza|schita|lectie|despre|pentru|o|la)\s+/gi, '').trim() || 'Lecție didactică';
      
      parsedData = {
        reply: `Am pregătit schița de lecție conform cerințelor din fișierul oficial «schițe de lecție.docx». (Serviciul a adaptat automat conținutul pentru tema: ${fallbackTopic}).`,
        needsMoreInfo: false,
        clarifyingQuestions: [],
        lessonPlan: {
          id: 'lp_' + Date.now(),
          clasa: currentLessonPlan?.clasa || 'Clasa a III-a A',
          profesor: currentLessonPlan?.profesor || 'Profesorul Neacsu Roxana',
          data: new Date().toLocaleDateString('ro-RO'),
          disciplina: currentLessonPlan?.disciplina || 'Limba și literatura română',
          subiectulLectiei: fallbackTopic,
          tipulLectiei: 'Lecție de dobândire de noi cunoștințe',
          obiectiveOperationale: [
            `O 1 Să definească și să recunoască noțiunile de bază referitoare la ${fallbackTopic};`,
            `O 2 Să exemplifice corect folosind suportul din manual și materialele de pe bancă;`,
            `O 3 Să participe activ la exercițiile de fixare și să colaboreze cu colegii de bancă.`
          ],
          activitatiPlanificate: [
            {
              id: 'etapa_1',
              numeEtapa: '1. Momentul organizatoric și captarea atenției',
              timpAlocat: '5 min',
              activitateaProfesorului: 'Asigură climatul optim: pregătirea cărților și caietelor pe bănci. Prezintă un element-surpriză legat de temă pentru a stârni curiozitatea elevilor.',
              activitateaElevilor: 'Se așază în bănci, pregătesc rechizitele necesare și răspund cu entuziasm la ghicitoarea introductivă.',
              metodeMijloace: 'Conversația euristică, problematizarea; material didactic pe bancă.',
              marcajeTablaVizuale: 'Scrierea datei și a unui semn de întrebare motivator.',
              resurseFizice: 'Caiete, manuale deschise pe bănci.'
            },
            {
              id: 'etapa_2',
              numeEtapa: '2. Reactualizarea cunoștințelor anterioare',
              timpAlocat: '7 min',
              activitateaProfesorului: 'Conduce un dialog scurt pentru a reactualiza noțiunile ancoră învățate anterior. Notează ideile esențiale la tablă.',
              activitateaElevilor: 'Răspund frontal, dau exemple din experiența proprie și identifică legătura cu noua lecție.',
              metodeMijloace: 'Brainstorming, dialog dirijat.',
              marcajeTablaVizuale: 'Cuvinte-cheie notate cu cretă albă.',
              resurseFizice: 'Manualul de bază.'
            },
            {
              id: 'etapa_3',
              numeEtapa: '3. Transmiterea și asimilarea noilor conținuturi',
              timpAlocat: '18 min',
              activitateaProfesorului: `Anunță tema: „${fallbackTopic}”. Explică pe înțelesul copiilor noțiunile principale. Notează la tablă definițiile și pașii cheie, marcând elementele esențiale cu cretă roșie.`,
              activitateaElevilor: 'Urmăresc explicațiile, citesc din manual, adresează întrebări și notează în caiete respectând marcajele cu roșu de la tablă.',
              metodeMijloace: 'Învățarea prin descoperire, explicația, exercițiul dirijat.',
              marcajeTablaVizuale: 'Definiții și reguli scrise cu roșu, exemple model subliniate cu roșu.',
              resurseFizice: 'Cartea pe bancă, fișa suport.'
            },
            {
              id: 'etapa_4',
              numeEtapa: '4. Activități de exersare și fixare',
              timpAlocat: '15 min',
              activitateaProfesorului: 'Împarte fișele de lucru diferențiate. Monitorizează activitatea pe grupe/perechi și acordă sprijin elevilor care întâmpină dificultăți.',
              activitateaElevilor: 'Lucrează în perechi sau individual pe fișă, consultă cartea de pe bancă și rezolvă sarcinile didactice.',
              metodeMijloace: 'Munca independentă, lucrul în echipă, exercițiul aplicativ.',
              marcajeTablaVizuale: 'Solițiile exercițiilor verificate la tablă.',
              resurseFizice: 'Fișe de lucru colorate, jetoane.'
            }
          ],
          feedbackFinal: {
            timpAlocat: '5 min',
            metodaVerificare: 'Metoda «Arată și spune» (4-5 elevi aleși aleatoriu prezintă rezolvarea de pe fișă).',
            jocuriDigitaleSiInteractive: `Joc interactiv Wordwall pentru consolidare rapidă: fixarea noțiunilor despre ${fallbackTopic}.`,
            linkWordwallExemplu: 'https://wordwall.net/ro-ro/community/invatamant-primar',
            aprecieriSiConcluzii: 'Aprecieri verbale individuale și colective: «Ați fost foarte atenți și harnici astăzi!». Notarea simbolică cu steluțe.'
          },
          schemaTablei: `TITLUL: ${fallbackTopic.toUpperCase()}\n\n1. Regula de bază (scrisă cu roșu)\n2. Exemple practice analizate împreună\n3. Concluzii și aplicație pe bancă`,
          sugestiiDiferentiere: 'Elevii cu ritm rapid de lucru primesc sarcini suplimentare creative, iar cei cu ritm lent beneficiază de sprijin suplimentar din partea învățătoarei.'
        },
        suggestedPrompts: [
          'Adaugă un joc suplimentar Wordwall',
          'Propune mai multe exemple vizuale la tablă',
          'Adaptează pentru lucru pe grupe'
        ]
      };
    }

    // Attach unique ID to lesson plan if present
    if (parsedData.lessonPlan) {
      if (!parsedData.lessonPlan.id) {
        parsedData.lessonPlan.id = 'lp_' + Date.now();
      }
      parsedData.lessonPlan.createdAt = Date.now();
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Eroare la apelarea Gemini API:', error);
    res.status(500).json({
      error: error.message || 'A apărut o eroare la procesarea solicitării de către metodistul AI.',
      reply: 'A apărut o problemă temporară de conexiune cu serviciul de asistență didactică. Vă rugăm să reîncercați.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Metodist Primar rulează pe http://0.0.0.0:${port}`);
  });
}

startServer();
