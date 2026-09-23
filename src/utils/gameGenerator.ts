import { InteractiveGameActivity, InteractiveGameQuestion, LessonPlan } from '../types';

/**
 * Asigură o activitate ludică completă cu întrebări didactice interactive,
 * fie din schița generată de AI, fie sintetizată inteligent pe baza temei și obiectivelor.
 */
export function ensureGameActivity(lesson: LessonPlan): InteractiveGameActivity {
  if (lesson.activitateLudica && Array.isArray(lesson.activitateLudica.intrebari) && lesson.activitateLudica.intrebari.length >= 3) {
    return lesson.activitateLudica;
  }

  // Generare dinamică automată adaptată temei și clasei
  const topic = lesson.subiectulLectiei || 'Lecție';
  const grade = lesson.clasa || 'Clasa a III-a';
  const subject = lesson.disciplina || 'Limba și literatura română';

  const generatedQuestions = generateCurriculumQuestions(topic, grade, subject, lesson.obiectiveOperationale);

  return {
    titluJoc: `Marea Provocare: ${topic}`,
    descriere: `Activitate ludică interactivă pentru ${grade} la ${subject}. Elevii răspund la întrebări, consolidează noțiunile și acumulează puncte în echipă sau individual!`,
    platformeRecomandate: ['Blooket', 'Wayground', 'Wordwall'],
    intrebari: generatedQuestions,
  };
}

/**
 * Generează un fișier CSV conform specificațiilor exacte de import pentru Blooket (blooket.com)
 * Format Blooket: Question,Answer 1,Answer 2,Answer 3,Answer 4,Time Limit,Correct Answer
 */
export function generateBlooketCsv(activity: InteractiveGameActivity): string {
  const headers = ['Question', 'Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Time Limit', 'Correct Answer'];
  const rows: string[] = [headers.join(',')];

  activity.intrebari.forEach((q) => {
    // Asigurăm 4 variante
    const options = [...q.variante];
    while (options.length < 4) {
      options.push('—');
    }

    // Găsim indexul răspunsului corect (1-indexed în Blooket: 1, 2, 3 sau 4)
    let correctIdx = options.findIndex((opt) => opt.trim().toLowerCase() === q.raspunsCorect.trim().toLowerCase());
    if (correctIdx === -1) {
      correctIdx = 0;
      options[0] = q.raspunsCorect;
    }
    const blooketCorrectAnswer = correctIdx + 1;

    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""').trim()}"`;

    rows.push([
      escapeCsv(q.intrebare),
      escapeCsv(options[0]),
      escapeCsv(options[1]),
      escapeCsv(options[2]),
      escapeCsv(options[3]),
      '20', // 20 secunde timp alocat
      blooketCorrectAnswer.toString(),
    ].join(','));
  });

  return rows.join('\r\n');
}

/**
 * Descarcă fișierul CSV gata de importat direct în Blooket
 */
export function downloadBlooketCsvFile(activity: InteractiveGameActivity, lesson: LessonPlan) {
  const csvContent = generateBlooketCsv(activity);
  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (lesson.subiectulLectiei || 'Joc')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  link.href = url;
  link.setAttribute('download', `Blooket_Set_${safeName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formatează setul de întrebări ca text structurat pentru Wayground (wayground.com)
 */
export function formatQuestionsForWayground(activity: InteractiveGameActivity, lesson?: LessonPlan): string {
  let text = `=== SET INTERACTIV PENTRU WAYGROUND (wayground.com) ===\n`;
  if (lesson) {
    text += `Tema: ${lesson.subiectulLectiei}\nClasa: ${lesson.clasa} | Disciplina: ${lesson.disciplina}\n\n`;
  }

  activity.intrebari.forEach((q, idx) => {
    text += `${idx + 1}. ${q.intrebare}\n`;
    const letters = ['A', 'B', 'C', 'D'];
    q.variante.forEach((v, vIdx) => {
      const isCorrect = v.trim().toLowerCase() === q.raspunsCorect.trim().toLowerCase();
      text += `   ${letters[vIdx] || '-'}. ${v} ${isCorrect ? '✅ [RĂSPUNS CORECT]' : ''}\n`;
    });
    if (q.explicatie) {
      text += `   Explicație didactică: ${q.explicatie}\n`;
    }
    text += `\n`;
  });

  return text;
}

/**
 * Formatează setul de întrebări ca text simplu pentru Blooket
 */
export function formatQuestionsForBlooket(activity: InteractiveGameActivity, lesson?: LessonPlan): string {
  let text = `=== SET ÎNTREBĂRI PENTRU BLOOKET (blooket.com) ===\n`;
  if (lesson) {
    text += `Titlu Set: ${activity.titluJoc} (${lesson.clasa})\n\n`;
  }

  activity.intrebari.forEach((q, idx) => {
    text += `Întrebarea ${idx + 1}: ${q.intrebare}\n`;
    text += `Răspuns Corect: ${q.raspunsCorect}\n`;
    const wrongOptions = q.variante.filter(v => v.trim().toLowerCase() !== q.raspunsCorect.trim().toLowerCase());
    text += `Răspunsuri Greșite: ${wrongOptions.join(' | ')}\n`;
    text += `Timp alocat: 20 secunde\n\n`;
  });

  return text;
}

/**
 * Generator intern de rezervă pentru întrebări didactice conform temelor uzuale din ciclul primar
 */
function generateCurriculumQuestions(
  topic: string,
  grade: string,
  subject: string,
  objectives?: string[]
): InteractiveGameQuestion[] {
  const lowerTopic = topic.toLowerCase();
  const lowerSubject = subject.toLowerCase();

  // 1. Limba română / CLR: Substantivul
  if (lowerTopic.includes('substantiv')) {
    return [
      {
        intrebare: 'Ce denumește substantivul?',
        variante: ['Ființe, lucruri, fenomene ale naturii', 'Doar acțiuni ale oamenilor', 'Doar calități și însușiri', 'Cifre și numere'],
        raspunsCorect: 'Ființe, lucruri, fenomene ale naturii',
        explicatie: 'Substantivul este partea de vorbire care denumește ființe (copil), lucruri (carte), fenomene (ploaie).',
      },
      {
        intrebare: 'Care dintre următoarele cuvinte este un substantiv comun?',
        variante: ['București', 'aleargă', 'ciocănitoare', 'vesel'],
        raspunsCorect: 'ciocănitoare',
        explicatie: '„Ciocănitoare” este un substantiv comun ce denumește o pasăre.',
      },
      {
        intrebare: 'Care este forma de plural pentru substantivul „caiet”?',
        variante: ['caiete', 'caieturi', 'caietii', 'caiet'],
        raspunsCorect: 'caiete',
        explicatie: 'Un caiet — două caiete.',
      },
      {
        intrebare: 'Care cuvânt este un substantiv PROPRIU scris corect?',
        variante: ['românia', 'Dunărea', 'munte', 'copil'],
        raspunsCorect: 'Dunărea',
        explicatie: 'Substantivele proprii se scriu întotdeauna cu literă inițială mare.',
      },
      {
        intrebare: 'Câte substantive se află în propoziția: „Băiatul citește o carte interesantă.”?',
        variante: ['1 substantiv', '2 substantive (băiatul, carte)', '3 substantive', 'Niciunul'],
        raspunsCorect: '2 substantive (băiatul, carte)',
        explicatie: '„Băiatul” și „carte” sunt cele două substantive.',
      },
    ];
  }

  // 2. Semne de punctuație
  if (lowerTopic.includes('punctua') || lowerTopic.includes('semne')) {
    return [
      {
        intrebare: 'Ce semn de punctuație se pune la sfârșitul unei propoziții interogative (o întrebare)?',
        variante: ['Semnul întrebării (?)', 'Punctul (.)', 'Semnul exclamării (!)', 'Două puncte (:)'],
        raspunsCorect: 'Semnul întrebării (?)',
        explicatie: 'La sfârșitul unei întrebări punem întotdeauna semnul întrebării (?).',
      },
      {
        intrebare: 'Ce semn de punctuație folosim pentru a exprima o bucurie, o mirare sau o poruncă?',
        variante: ['Semnul exclamării (!)', 'Virgula (,)', 'Punctul (.)', 'Semnul întrebării (?)'],
        raspunsCorect: 'Semnul exclamării (!)',
        explicatie: 'Semnul exclamării exprimă emoție vie, îndemn, salut sau mirare.',
      },
      {
        intrebare: 'Ce semn de punctuație anunță vorbirea directă sau o enumerare?',
        variante: ['Două puncte (:)', 'Semnul întrebării (?)', 'Linia de dialog (-)', 'Punct și virgulă (;)'],
        raspunsCorect: 'Două puncte (:)',
        explicatie: 'Două puncte anunță cuvintele cuiva sau o enumerare de obiecte.',
      },
      {
        intrebare: 'Ce semn marchează începutul replicilor fiecărui personaj dintr-un dialog?',
        variante: ['Linia de dialog (—)', 'Ghilimelele („ ”)', 'Punctul (.)', 'Virgula (,)'],
        raspunsCorect: 'Linia de dialog (—)',
        explicatie: 'Linia de dialog arată că o nouă persoană ia cuvântul.',
      },
      {
        intrebare: 'Alege propoziția scrisă complet corect:',
        variante: ['Ce frumos este afară!', 'Ce frumos este afară?', 'Ce frumos este afară.', 'Ce frumos este afară:'],
        raspunsCorect: 'Ce frumos este afară!',
        explicatie: 'Propoziția exprimă admirație și mirare, deci cere semnul exclamării (!).',
      },
    ];
  }

  // 3. Matematică / MEM: Adunarea / Înmulțirea / Numere
  if (lowerTopic.includes('adunar') || lowerTopic.includes('scader') || lowerTopic.includes('numere') || lowerSubject.includes('matemat')) {
    return [
      {
        intrebare: `În cadrul temei „${topic}”, care este rezultatul corect al unei estimări rapide?`,
        variante: ['Răspunsul verificat prin operația inversă', 'Doar aproximarea la zeci', 'Un calcul neterminat', 'Un număr la întâmplare'],
        raspunsCorect: 'Răspunsul verificat prin operația inversă',
        explicatie: 'Proba oricărei operații matematice se face prin operația inversă.',
      },
      {
        intrebare: 'Cum se numesc numerele care se adună?',
        variante: ['Termeni', 'Factori', 'Deîmpărțit și împărțitor', 'Descăzut și scăzător'],
        raspunsCorect: 'Termeni',
        explicatie: 'Termen 1 + Termen 2 = Sumă sau Total.',
      },
      {
        intrebare: 'Cum se numește rezultatul adunării?',
        variante: ['Sumă sau total', 'Diferență sau rest', 'Produs', 'Cât'],
        raspunsCorect: 'Sumă sau total',
        explicatie: 'Rezultatul adunării a două sau mai multe numere este suma.',
      },
      {
        intrebare: 'Dacă schimbăm ordinea termenilor unei adunări, rezultatul:',
        variante: ['Rămâne același (comutativitate)', 'Se dublează', 'Devine zero', 'Scade cu 1'],
        raspunsCorect: 'Rămâne același (comutativitate)',
        explicatie: 'Adunarea este comutativă: a + b = b + a.',
      },
      {
        intrebare: 'Care este cel mai mare număr natural scris cu 3 cifre distincte?',
        variante: ['987', '999', '989', '978'],
        raspunsCorect: '987',
        explicatie: '9, 8 și 7 sunt cele mai mari cifre distincte.',
      },
    ];
  }

  // 4. Științe / Părțile plantei / Mediul înconjurător
  if (lowerTopic.includes('plant') || lowerTopic.includes('anim') || lowerTopic.includes('ap') || lowerSubject.includes('științ')) {
    return [
      {
        intrebare: 'Care parte a plantei absoarbe apa și substanțele minerale din sol?',
        variante: ['Rădăcina', 'Tulpina', 'Frunza', 'Floarea'],
        raspunsCorect: 'Rădăcina',
        explicatie: 'Rădăcina fixează planta în sol și absoarbe apa cu sărurile minerale.',
      },
      {
        intrebare: 'În ce organ al plantei se prepară hrana prin procesul de fotosinteză?',
        variante: ['Frunză (bucătăria plantei)', 'Rădăcină', 'Tulpină', 'Fruct'],
        raspunsCorect: 'Frunză (bucătăria plantei)',
        explicatie: 'Frunzele captează lumina soarelui și prepară substanțele hrănitoare.',
      },
      {
        intrebare: 'Care este rolul tulpinii?',
        variante: ['Susține ramurile și conduce seva', 'Absoarbe lumina', 'Face semințe', 'Fixează planta în pământ'],
        raspunsCorect: 'Susține ramurile și conduce seva',
        explicatie: 'Tulpina susține organele aeriene și transportă apa spre frunze.',
      },
      {
        intrebare: 'Din ce parte a plantei se dezvoltă fructul și semințele?',
        variante: ['Din floare', 'Din rădăcină', 'Din coajă', 'Din frunză'],
        raspunsCorect: 'Din floare',
        explicatie: 'După polenizare și fecundație, floarea se transformă în fruct cu semințe.',
      },
      {
        intrebare: 'De ce au nevoie plantele pentru a crește sănătoase?',
        variante: ['Lumină, apă, aer, căldură și sol fertil', 'Doar de întuneric', 'Doar de mult nisip uscat', 'Doar de vânt rece'],
        raspunsCorect: 'Lumină, apă, aer, căldură și sol fertil',
        explicatie: 'Factorii de mediu esențiali sunt lumina, apa, aerul, temperatura și solul.',
      },
    ];
  }

  // 5. General adaptat pentru orice altă temă din ciclul primar
  return [
    {
      intrebare: `Care este ideea principală a lecției despre „${topic}”?`,
      variante: [
        `Înțelegerea și aplicarea corectă a noțiunilor despre ${topic}`,
        'Copierea mecanică din manual',
        'Memorarea fără explicații',
        'Completarea la întâmplare a fișei',
      ],
      raspunsCorect: `Înțelegerea și aplicarea corectă a noțiunilor despre ${topic}`,
      explicatie: `Obiectivul central este însușirea activă și conștientă a cunoștințelor despre ${topic}.`,
    },
    {
      intrebare: `Ce material de pe bancă este cel mai util la ora de ${subject}?`,
      variante: ['Manualul și caietul de clasă', 'Doar jucăria preferată', 'Reviste de benzi desenate', 'Telefonul mobil'],
      raspunsCorect: 'Manualul și caietul de clasă',
      explicatie: 'Manualul și caietul sunt instrumentele fundamentale ale elevului de primar.',
    },
    {
      intrebare: 'Cum demonstrăm cel mai bine că am înțeles lecția nouă?',
      variante: ['Rezolvând exercițiile și explicând cu cuvintele noastre', 'Rămânând tăcuți', 'Privind doar pe fereastră', 'Grăbindu-ne să terminăm primii fără atenție'],
      raspunsCorect: 'Rezolvând exercițiile și explicând cu cuvintele noastre',
      explicatie: 'Metoda „Arată și spune” și aplicarea practică demonstrează stăpânirea temei.',
    },
    {
      intrebare: 'Ce facem dacă întâmpinăm o dificultate la un exercițiu?',
      variante: ['Ridicăm mâna și cerem lămuriri doamnei învățătoare', 'Abandonăm exercițiul', 'Ștergem tot de pe caiet', 'Ne supărăm'],
      raspunsCorect: 'Ridicăm mâna și cerem lămuriri doamnei învățătoare',
      explicatie: 'Colaborarea și comunicarea deschisă sunt cheia învățării!',
    },
    {
      intrebare: `Cum putem folosi în viața de zi cu zi noțiunile despre ${topic}?`,
      variante: [
        'În comunicare, rezolvare de probleme și cunoașterea lumii',
        'Doar la evaluările din clasă',
        'Nu le vom folosi niciodată',
        'Doar în vacanța mare',
      ],
      raspunsCorect: 'În comunicare, rezolvare de probleme și cunoașterea lumii',
      explicatie: 'Învățarea din ciclul primar are aplicabilitate directă în viața de zi cu zi.',
    },
  ];
}
