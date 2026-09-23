import { LessonPlan } from '../types';

export const PRIMARY_GRADES = [
  'Clasa Pregătitoare',
  'Clasa I',
  'Clasa a II-a',
  'Clasa a III-a',
  'Clasa a IV-a',
] as const;

export const PRIMARY_SUBJECTS: Record<string, string[]> = {
  'Clasa Pregătitoare': [
    'Comunicare în limba română (CLR)',
    'Matematică și explorarea mediului (MEM)',
    'Dezvoltare personală (DP)',
    'Arte vizuale și abilități practice (AVAP)',
    'Muzică și mișcare (MM)',
    'Joc și mișcare (JM)',
  ],
  'Clasa I': [
    'Comunicare în limba română (CLR)',
    'Matematică și explorarea mediului (MEM)',
    'Dezvoltare personală (DP)',
    'Arte vizuale și abilități practice (AVAP)',
    'Muzică și mișcare (MM)',
    'Limba modernă (Engleză)',
  ],
  'Clasa a II-a': [
    'Comunicare în limba română (CLR)',
    'Matematică și explorarea mediului (MEM)',
    'Dezvoltare personală (DP)',
    'Arte vizuale și abilități practice (AVAP)',
    'Muzică și mișcare (MM)',
    'Limba modernă (Engleză)',
  ],
  'Clasa a III-a': [
    'Limba și literatura română',
    'Matematică și științe ale naturii',
    'Matematică',
    'Științe ale naturii',
    'Educație civică',
    'Joc și mișcare',
    'Arte vizuale și abilități practice',
    'Muzică și mișcare',
    'Limba modernă (Engleză)',
  ],
  'Clasa a IV-a': [
    'Limba și literatura română',
    'Matematică',
    'Științe ale naturii',
    'Istorie',
    'Geografie',
    'Educație civică',
    'Joc și mișcare',
    'Arte vizuale și abilități practice',
    'Muzică și mișcare',
    'Limba modernă (Engleză)',
  ],
};

export const LESSON_TYPES = [
  'Lecție de dobândire de noi cunoștințe',
  'Formare de priceperi și deprinderi',
  'Lecție de consolidare și sistematizare',
  'Lecție de evaluare a performanțelor școlare',
  'Lecție mixtă / combinată',
] as const;

export const SAMPLE_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'sample_componentele_cartii',
    titlu: 'Componentele cărții (Coperta, cuprinsul, ilustrațiile, paginile)',
    clasa: 'Clasa a III-a A',
    profesor: 'Profesorul Neacsu Roxana',
    data: '14.09.2026',
    disciplina: 'Limba și literatura română',
    subiectulLectiei: 'Componentele cărții',
    tipulLectiei: 'Lecție de dobândire de noi cunoștințe',
    durata: '45-50 minute',
    obiectiveOperationale: [
      'O 1 Să identifice și să numească componentele principale ale unei cărți (coperta, cuprinsul, ilustrațiile, paginile).',
      'O 2 Să recunoască informațiile esențiale de pe coperta unei cărți (titlu, autor, editură).',
      'O 3 Să explice rolul ilustrațiilor în completarea textului scris.',
    ],
    activitatiPlanificate: [
      {
        id: 'stg_comp_1',
        numeEtapa: '1. Momentul organizatoric și captarea atenției',
        timpAlocat: '7 min',
        activitateaProfesorului: `• Momentul organizatoric (2 minute): Pregătirea materialelor: fiecare elev are pe bancă o carte (manual sau carte de lectură). Verificarea prezenței.\n• Captarea atenției și introducerea temei (5 minute): Profesorul prezintă 3-4 cărți diferite (povești, enciclopedii, manuale). Întrebări de motivare: "Ce vedeți pe aceste obiecte? Ce sunt acestea? La ce ne ajută cărțile?". Anunțarea subiectului: "Astăzi vom descoperi din ce este alcătuită o carte".`,
        activitateaElevilor: 'Elevii pregătesc cartea pe bancă, observă cărțile prezentate de învățătoare și răspund cu entuziasm la întrebările de motivare.',
        metodeMijloace: 'Conversația de motivare, observația dirijată; Diverse volume de cărți de povești și enciclopedii; Frontal.',
        marcajeTablaVizuale: 'Scrie pe tablă data: 14.09.2026. Notează titlul cu cretă albă și subliniază cu roșu: Componentele cărții.',
        resurseFizice: 'Fiecare elev are pe bancă o carte (manual sau carte de lectură preferată).',
      },
      {
        id: 'stg_comp_2',
        numeEtapa: '2. Prezentarea noilor cunoștințe',
        timpAlocat: '15 min',
        activitateaProfesorului: `A. Definiția cărții (3 minute): Scrie la tablă: "Cartea este o scriere cu un anumit subiect, tipărită și legată în volum". Explicație simplificată: "Cartea este formată din foi de hârtie tipărite, legate împreună, care ne povestesc despre ceva anume".\n\nB. Coperta cărții (5 minute): Arată coperta unei cărți și identifică împreună cu elevii: Titlul - numele cărții (ex: "Capra cu trei iezi"), Autorul - persoana care a scris cartea (ex: Ion Creangă), Editura - locul unde s-a tipărit cartea. 5-6 elevi citesc cu voce tare titlul și autorul cărții lor.\n\nC. Cuprinsul cărții (4 minute): Deschide o carte la cuprins: "Cuprinsul este o listă în care sunt enumerate capitolele și subcapitolele, titlurile textelor, cu indicarea paginii corespunzătoare". Demonstrează căutarea unei pagini.\n\nD. Ilustrațiile (3 minute): Arată ilustrații din diferite cărți. "Ilustrațiile nu sunt doar pentru înfrumusețare - ele ne dau informații importante despre ceea ce citim".`,
        activitateaElevilor: 'Observă cum sunt legate paginile. Caută pe coperta propriei cărți titlul, autorul și editura. Citesc cu voce tare. Deschid cartea la cuprins și caută un text după numărul paginii.',
        metodeMijloace: 'Învățarea prin descoperire, explicația euristică, exercițiul practic cu cartea pe bancă; Frontal și dirijat.',
        marcajeTablaVizuale: 'La tablă: 1. COPERTA (Titlu, Autor, Editură) - subliniat cu roșu; 2. CUPRINSUL (lista capitolelor + pagina); 3. ILUSTRAȚIILE (completează textul).',
        resurseFizice: 'Cărți deschise pe băncile elevilor, fișă reper.',
      },
      {
        id: 'stg_comp_3',
        numeEtapa: '3. Activitate de exersare - Explorarea cărții',
        timpAlocat: '10 min',
        activitateaProfesorului: 'Elevii lucrează individual cu cartea de pe bancă. Profesorul dictează/proiectează întrebările de orientare și ghidează elevii:\n1. Care este titlul cărții tale?\n2. Cine este autorul?\n3. La ce editură a apărut?\n4. Deschide cuprinsul. Câte capitole/texte are cartea?\n5. Caută o ilustrație. Ce reprezintă ea? Ce ne arată despre poveste?',
        activitateaElevilor: 'Elevii cercetează cartea de pe bancă, notează răspunsurile în caiete sau le formulează oral, indicând cu degetul elementele identificate.',
        metodeMijloace: 'Munca individuală dirijată, exercițiul de explorare a cărții; Caietul de română, cartea de lectură.',
        marcajeTablaVizuale: 'Model de notare pe tablă: Titlu: ... | Autor: ... | Editură: ...',
        resurseFizice: 'Cartea personală de lectură de pe bancă, caietul dictando.',
      },
      {
        id: 'stg_comp_4',
        numeEtapa: '4. Activitate creativă & Discuție finală despre ilustrații',
        timpAlocat: '16 min',
        activitateaProfesorului: `• Activitate creativă (12 minute):\nVarianta A - Realizarea unei coperți: Elevii primesc o foaie A4, desenează o copertă pentru povestea preferată (Titlu, Autor, Ilustrație).\nVarianta B - Crearea unui mini-cuprins: Elevii inventează titlurile a 3-4 capitole cu numărul paginii (ex: Capitolul 1 - Aventura începe ... pag. 5).\n\n• Discuție finală despre ilustrații (4 minute): "De ce sunt importante ilustrațiile într-o carte? Cum ne ajută imaginile să înțelegem mai bine textul? Ați citit vreodată o carte fără ilustrații? A fost mai greu?". Concluzie: Ilustrațiile completează cuvintele și ne ajută să ne imaginăm povestea.`,
        activitateaElevilor: 'Elevii creează cu entuziasm coperta sau cuprinsul pe foaia A4 folosind creioane colorate. Participă la discuția reflexivă despre importanța ilustrațiilor.',
        metodeMijloace: 'Activitate creativă, conversația reflexivă; Foi albe A4, creioane colorate; Individual și frontal.',
        marcajeTablaVizuale: 'Schiță cadru copertă la tablă pentru ghidare vizuală.',
        resurseFizice: 'Foi A4, carioci și creioane pe bancă.',
      },
    ],
    feedbackFinal: {
      timpAlocat: '5 min',
      metodaVerificare: `Metoda "Arată și spune" - Profesorul cere aleatoriu la 4-5 elevi să:
1. Arate coperta cărții și să citească titlul și autorul.
2. Deschidă cuprinsul și să găsească un anumit capitol.
3. Arate o ilustrație și să explice ce reprezintă.`,
      jocuriDigitaleSiInteractive: 'Joc interactiv de identificare a componentelor cărții sau joc Wordwall cu elementele cărții.',
      linkWordwallExemplu: 'https://wordwall.net/ro/resource/9567622/folosirea-corect%C4%83-a-virgulei',
      aprecieriSiConcluzii: 'Aprecieri verbale individuale și colective pentru creativitate, colaborare și atenția la detalii. An școlar 2026 - 2027.',
    },
    schemaTablei: `=================================================================
14.09.2026                                  SCHIȚA TABLEI

                    COMPONENTELE CĂRȚII (subliniat cu roșu)

1. COPERTA:
   • Titlul - numele cărții (ex: "Capra cu trei iezi")
   • Autorul - cel care a scris cartea (ex: Ion Creangă)
   • Editura - locul unde s-a tipărit cartea

2. CUPRINSUL:
   • Lista textelor / capitolelor și pagina corespunzătoare

3. ILUSTRAȚIILE:
   • Desenele care completează și explică povestea
=================================================================`,
    sugestiiDiferentiere: 'Elevii care termină mai repede pot adăuga pe copertă și un scurt rezumat de prezentare pe coperta a IV-a.',
    createdAt: Date.now() - 200000,
  },
  {
    id: 'sample_semne_de_punctuatie',
    titlu: 'Semne de punctuație (Semnul întrebării, semnul exclamării, două puncte)',
    clasa: 'Clasa a III-a A',
    profesor: 'Profesorul Neacsu Roxana',
    data: '15.09.2026',
    disciplina: 'Limba și literatura română',
    subiectulLectiei: 'Semne de punctuație',
    tipulLectiei: 'Formare de priceperi și deprinderi',
    durata: '45-50 minute',
    obiectiveOperationale: [
      'Recunoască și utilizeze corect două puncte în propoziții și liste.',
      'Formuleze întrebări și să le marcheze cu semnul întrebării.',
      'Exprime emoții și intenții folosind semnul exclamării în mod adecvat.',
      'Diferențieze între cele trei semne de punctuație și să le folosească corect în contexte variate.',
      'Identifice și corecteze greșelile frecvente legate de aceste semne de punctuație.',
    ],
    activitatiPlanificate: [
      {
        id: 'stg_punc_1',
        numeEtapa: '1. Moment organizatoric și captarea atenției & Reactualizarea cunoștințelor',
        timpAlocat: '8 min',
        activitateaProfesorului: 'Verificarea pregătirii caietelor și stilourilor pe bancă. Exercițiu de captare cu propoziții rostite cu intonații diferite (mirare, întrebare, afirmație). Întrebări scurte: "Ce semn punem când o propoziție se termină simplu? (Punctul)". Anunță tema: Semne de punctuație speciale.',
        activitateaElevilor: 'Sesizează diferențele de ton ale vocii învățătoarei și le asociază cu stări sufletești (curiozitate, bucurie, teamă).',
        metodeMijloace: 'Conversația euristică, jocul de intonație; Frontal.',
        marcajeTablaVizuale: 'Scrie data: 15.09.2026. Titlu: Semne de punctuație (?, !, :).',
        resurseFizice: 'Caietele pe bancă, stilourile deschise.',
      },
      {
        id: 'stg_punc_2',
        numeEtapa: '2. Transmiterea noilor cunoștințe (Semnul întrebării & Semnul exclamării)',
        timpAlocat: '10 min',
        activitateaProfesorului: `A. Semnul Întrebării (5 minute):
Explicați: "Semnul întrebării (?) îl punem la sfârșitul întrebărilor, când vrem să aflăm ceva."
Exemple la tablă:
• Cum te cheamă?
• Unde locuiești?
• Ce culoare îți place?
Exercițiu rapid: Cereți elevilor să formuleze oral 3 întrebări despre activitățile lor preferate. Scrieți câteva exemple la tablă, marcând semnul întrebării cu marker colorat.

B. Semnul Exclamării (5 minute):
Explicați: "Semnul exclamării (!) îl folosim când exprimăm emoții puternice: bucurie, surpriză, teamă, entuziasm sau când dăm ordine."
Exemple la tablă:
• Ce frumos este afară!
• Atenție la mașini!
• Bravo, ai reușit!
• Vai, ce spaimă!
Exercițiu rapid: Citiți propozițiile cu intonație potrivită și cereți elevilor să identifice emoția exprimată.`,
        activitateaElevilor: 'Formulează întrebări colegilor, citesc cu intonație propozițiile exclamative și identifică stările afective.',
        metodeMijloace: 'Explicația, modelarea intonației, exercițiul ghidat; Tablă, caiet.',
        marcajeTablaVizuale: 'Marcarea semnelor ? și ! cu cretă roșie sau marker colorat la sfârșitul fiecărui enunț.',
        resurseFizice: 'Caiete dictando pe bancă.',
      },
      {
        id: 'stg_punc_3',
        numeEtapa: '3. Transmiterea noilor cunoștințe (Două puncte & Liste)',
        timpAlocat: '12 min',
        activitateaProfesorului: `C. Două Puncte (5-7 minute):
Explicați: "Două puncte (:) le folosim înainte de liste sau când vrem să explicăm ceva mai detaliat."
Accent special pe liste (greșeala frecventă):
Exemplu corect:
• Pentru excursie avem nevoie de: rucsac, apă, sandvișuri și fructe.
Exemplu incorect (scrieți cu roșu):
• Pentru excursie avem nevoie de, rucsac, apă, sandvișuri. ✗
Alte exemple corecte:
• În grădină cresc: trandafiri, lalele și garoafe.
• Mama a spus: "Vino acasă la timp!"
Subliniați: "Două puncte vin ÎNAINTE de listă, nu după primul element!"`,
        activitateaElevilor: 'Notează regula în caiet. Observă cu atenție exemplul incorect marcat cu roșu la tablă și explică de ce este greșit.',
        metodeMijloace: 'Metoda contrastului (corect vs incorect), învățarea prin descoperire; Frontal.',
        marcajeTablaVizuale: 'Exemplul greșit tăiat cu X roșu la tablă: Pentru excursie avem nevoie de, rucsac... ✗. Exemplul corect marcat cu bifă verde: ...avem nevoie de: rucsac... ✓',
        resurseFizice: 'Caiete, manual.',
      },
      {
        id: 'stg_punc_4',
        numeEtapa: '4. Verificarea înțelegerii, aplicare și exersare',
        timpAlocat: '12 min',
        activitateaProfesorului: 'Distribuie o scurtă fișă cu texte fără semne de punctuație. Cheamă elevi la tablă să plaseze semnele magnetice potrivite (?, !, :).',
        activitateaElevilor: 'Completează semnele pe fișă, lucrează în perechi și justifică alegerea fiecărui semn.',
        metodeMijloace: 'Munca pe fișe, jocul semnelor la tablă; Fișă de exerciții, semne magnetice.',
        marcajeTablaVizuale: 'Exerciții interactive la tablă completate de elevi.',
        resurseFizice: 'Fișa de lucru pe bancă.',
      },
    ],
    feedbackFinal: {
      timpAlocat: '5 min',
      metodaVerificare: `Recapitulare frontală:
"Ce am învățat astăzi despre cele trei semne?"
"Când folosim două puncte?"
Elevii ridică palete cu semnele ?, ! și : la enunțurile citite de profesor.`,
      jocuriDigitaleSiInteractive: 'Joc interactiv Wordwall pentru fixarea semnelor de punctuație și a virgulei.',
      linkWordwallExemplu: 'https://wordwall.net/ro/resource/9567622/folosirea-corect%C4%83-a-virgulei',
      aprecieriSiConcluzii: 'Aprecieri pozitive pentru intonație corectă și atenție la detalii. An școlar 2026 - 2027.',
    },
    schemaTablei: `=================================================================
15.09.2026                                  SCHIȚA TABLEI

                 SEMNE DE PUNCTUAȚIE (subliniat cu roșu)

1. SEMNUL ÎNTREBĂRII (?):
   • La sfârșitul întrebărilor: "Unde locuiești?"

2. SEMNUL EXCLAMĂRII (!):
   • Exprimă emoții / îndemnuri: "Ce frumos este afară!"

3. DOUĂ PUNCTE (:):
   • Înaintea unei enumerări (liste):
     Corect: Pentru excursie avem nevoie de: rucsac, apă și fructe. ✓
     Greșit: Pentru excursie avem nevoie de, rucsac, apă... ✗ (cu roșu)
=================================================================`,
    sugestiiDiferentiere: 'Elevii care au dificultăți primesc cartonașe mari vizuale cu semnul întrebării și exclamării pentru sprijin.',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'sample_numerele_naturale_10000',
    titlu: 'Numerele naturale de la 0 la 10 000 (Scriere, citire, formare)',
    clasa: 'Clasa a III-a A',
    profesor: 'Profesorul Neacsu Roxana',
    data: '14.09.2026',
    disciplina: 'Matematică și științe ale naturii',
    subiectulLectiei: 'Numerele naturale de la 0 la 10 000',
    tipulLectiei: 'Lecție de dobândire de noi cunoștințe',
    durata: '45-50 minute',
    obiectiveOperationale: [
      'O 1 - scrierea cu cifre/litere a unor numere din intervalul 0-10 000',
      'O 2 - citirea numerelor naturale de la 0 la 10 000',
      'O 3 - identificarea cifrelor unităţilor/zecilor/sutelor/ miilor dintr-un număr',
    ],
    activitatiPlanificate: [
      {
        id: 'stg_num_1',
        numeEtapa: '1. Moment organizatoric și captarea atenției',
        timpAlocat: '5 min',
        activitateaProfesorului: `Activitate de început:
• Scrieți pe tablă numărul 3 457
• Întrebați: "Cine poate să citească acest număr?"
• Notați răspunsurile corecte și greșite pentru a identifica nivelul clasei
• Anunțați tema lecției: "Astăzi vom învăța să scriem, să citim și să înțelegem numerele mari, până la 10 000!"`,
        activitateaElevilor: 'Elevii încearcă să citească numărul 3 457. Își dau seama că este un număr mai mare decât 1 000 și sunt dornici să descopere miile.',
        metodeMijloace: 'Conversația introductivă, provocarea cognitivă; Tablă; Frontal.',
        marcajeTablaVizuale: 'Scrie pe tablă mare: 3 457.',
        resurseFizice: 'Caietele de matematică și numărătoare pe bancă.',
      },
      {
        id: 'stg_num_2',
        numeEtapa: '2. Reactualizarea cunoștințelor',
        timpAlocat: '5 min',
        activitateaProfesorului: `Recapitulare:
• "Ce numere am învățat până acum?" (0-1 000)
• Scrieți pe tablă: 234
• Întrebați: "Care este cifra unităților? Care este cifra zecilor? Care este cifra sutelor?"
• Elevii răspund oral, ridicând mâna
• Verificați înțelegerea: "Cum scriem cu litere numărul 234?" (două sute treizeci și patru)
Verificare rapidă: Dictați 2-3 numere sub 1 000, elevii le scriu pe caiete cu cifre și litere.`,
        activitateaElevilor: 'Identifică 4 unități, 3 zeci, 2 sute. Notează în caiet numerele dictate.',
        metodeMijloace: 'Calcul și scriere rapidă, conversația; Frontal și individual.',
        marcajeTablaVizuale: '234 -> U: 4 (galben), Z: 3 (albastru), S: 2 (verde).',
        resurseFizice: 'Caiete de matematică cu pătrățele.',
      },
      {
        id: 'stg_num_3',
        numeEtapa: '3. Prezentarea noilor conținuturi',
        timpAlocat: '12 min',
        activitateaProfesorului: `A. Introducerea numerelor până la 10 000
Scrieți pe tablă schema:
Mii | Sute | Zeci | Unități
 5  |  3   |  2   |    7
• "Acesta este numărul 5 327 (cinci mii trei sute douăzeci și șapte)"
• Explicați: "Avem acum patru poziții: unități, zeci, sute și mii"
• Subliniați cifra unităților (7) și cifra zecilor (2)

B. Scrierea cu cifre și cu litere - diferențe importante
Creați un tabel pe tablă:
Cu cifre: 1 234 | Cu litere: o mie două sute treizeci și patru
Cu cifre: 5 000 | Cu litere: cinci mii
Cu cifre: 8 067 | Cu litere: opt mii șaizeci și șapte`,
        activitateaElevilor: 'Desenează tabelul de poziție în caiet cu 4 coloane (Mii, Sute, Zeci, Unități) și completează cifrele. Exersează scrierea cu litere.',
        metodeMijloace: 'Algoritmizarea, explicația, modelarea pe tabelul pozițional; Tablă, cretă colorată.',
        marcajeTablaVizuale: 'Tabelul pozițional cu 4 coloane: MII | SUTE | ZECI | UNITĂȚI subliniat cu roșu.',
        resurseFizice: 'Rigle și creioane colorate pe bancă.',
      },
      {
        id: 'stg_num_4',
        numeEtapa: '4. Activități de exersare, aplicare sau creație',
        timpAlocat: '18 min',
        activitateaProfesorului: 'Propune exerciții de descompunere a numerelor în Mii + Sute + Zeci + Unități (ex: 5 327 = 5 000 + 300 + 20 + 7). Monitorizează lucrul la bancă și cheamă elevi la tablă.',
        activitateaElevilor: 'Elevii rezolvă pe caiete exercițiile, descompun numere și colaborează cu colegul de bancă pentru verificare.',
        metodeMijloace: 'Munca dirijată și independentă; Manual, fișă de matematică.',
        marcajeTablaVizuale: 'Descompuneri colorate la tablă.',
        resurseFizice: 'Fișa cu numere mari.',
      },
    ],
    feedbackFinal: {
      timpAlocat: '5 min',
      metodaVerificare: 'JOCURI Digitale interactive pe Wordwall:',
      jocuriDigitaleSiInteractive: 'JOCURI - Găsește numărul care...',
      linkWordwallExemplu: 'https://wordwall.net/resource/102974509/numerele-naturale-de-la-0-10000-g%C4%83se%C8%99te-num%C4%83rul-care',
      aprecieriSiConcluzii: 'Felicitări pentru descoperirea miilor și acuratețea calculelor! An școlar 2026 - 2027.',
    },
    schemaTablei: `=================================================================
14.09.2026                                  SCHIȚA TABLEI

           NUMERELE NATURALE DE LA 0 LA 10 000 (subliniat cu roșu)

Tabelul pozițional:
┌───────────┬───────────┬───────────┬───────────┐
│    MII    │   SUTE    │   ZECI    │  UNITĂȚI  │
├───────────┼───────────┼───────────┼───────────┤
│     5     │     3     │     2     │     7     │
└───────────┴───────────┴───────────┴───────────┘
5 327 = cinci mii trei sute douăzeci și șapte

Scriere cu cifre și litere:
• 1 234 -> o mie două sute treizeci și patru
• 5 000 -> cinci mii
• 8 067 -> opt mii șaizeci și șapte
=================================================================`,
    sugestiiDiferentiere: 'Elevii care întâmpină dificultăți folosesc tabelul pozițional plastifiat cu carioca lavabilă.',
    createdAt: Date.now(),
  },
];
