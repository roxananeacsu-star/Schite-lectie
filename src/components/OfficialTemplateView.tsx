import React from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';
import { SAMPLE_LESSON_PLANS } from '../data/curriculumData';

interface OfficialTemplateViewProps {
  onLoadSample: (sample: LessonPlan) => void;
}

export const OfficialTemplateView: React.FC<OfficialTemplateViewProps> = ({
  onLoadSample,
}) => {
  const downloadBlankTemplate = async () => {
    const blankPlan: LessonPlan = {
      id: 'blank_template',
      titlu: 'Șablon Oficial - Schiță de Lecție Învățământ Primar',
      clasa: 'Clasa [ex: a III-a A]',
      profesor: '[Numele Cadrului Didactic]',
      data: new Date().toLocaleDateString('ro-RO'),
      disciplina: '[ex: Limba și literatura română / Matematică și explorarea mediului]',
      subiectulLectiei: '[Subiectul / Tema lecției]',
      tipulLectiei: 'Lecție de dobândire de noi cunoștințe',
      durata: '45-50 minute',
      obiectiveOperationale: [
        'O1: Să identifice...',
        'O2: Să explice...',
        'O3: Să recunoască...',
        'O4: Să aplice...',
      ],
      activitatiPlanificate: [
        {
          id: 'et1',
          numeEtapa: '1. Momentul organizatoric și captarea atenției',
          timpAlocat: '3-5 min',
          activitateaProfesorului: 'Asigură climatul de lucru, aerisirea sălii, verificarea rechizitelor. Captează atenția printr-un element surpriză sau ghicitoare.',
          activitateaElevilor: 'Pregătesc materialele necesare pe bancă. Răspund la stimulul de captare.',
          metodeMijloace: 'Conversația, jocul didactic; Materiale concrete; Frontal.',
          marcajeTablaVizuale: 'Se notează data la tablă.',
          resurseFizice: 'Caiete, manuale pe colțul băncii.',
        },
        {
          id: 'et2',
          numeEtapa: '2. Reactualizarea cunoștințelor',
          timpAlocat: '5-8 min',
          activitateaProfesorului: 'Adresează întrebări de verificare a noțiunilor ancoră din lecția precedentă. Verifică tema pentru acasă.',
          activitateaElevilor: 'Răspund frontal sau individual, oferă exemple concrete.',
          metodeMijloace: 'Conversația de verificare, calcul mintal; Frontal.',
          marcajeTablaVizuale: 'Exemple rapide cu cretă colorată.',
          resurseFizice: 'Caiete de temă.',
        },
        {
          id: 'et3',
          numeEtapa: '3. Transmiterea noilor cunoștințe / Prezentarea conținuturilor',
          timpAlocat: '15-20 min',
          activitateaProfesorului: 'Anunță titlul și obiectivele lecției. Explică noul conținut prin metode active. Notează schema la tablă.',
          activitateaElevilor: 'Descoperă noile concepte, notează titlul în caiete cu alineat, rezolvă primele sarcini ghidate.',
          metodeMijloace: 'Învățarea prin descoperire, explicația, modelarea; Manual, tablă; Frontal și dirijat.',
          marcajeTablaVizuale: 'Titlul subliniat cu roșu la tablă. Cuvintele cheie marcate distinct.',
          resurseFizice: 'Manualul deschis pe bancă la pagina temei.',
        },
        {
          id: 'et4',
          numeEtapa: '4. Activități de exersare, aplicare sau creație',
          timpAlocat: '10-15 min',
          activitateaProfesorului: 'Propune exerciții de aplicare practică, lucru pe fișe sau pe grupe mici. Oferă feedback continuu.',
          activitateaElevilor: 'Lucrează individual sau în perechi/echipe, rezolvă sarcinile, solicită lămuriri dacă este cazul.',
          metodeMijloace: 'Munca independentă, activitatea în echipă; Fișe de lucru, jetoane.',
          marcajeTablaVizuale: 'Exerciții model rezolvate la tablă.',
          resurseFizice: 'Fișe de lucru pe bancă, jetoane didactice.',
        },
      ],
      feedbackFinal: {
        timpAlocat: '5 min',
        metodaVerificare: 'Metoda «Arată și spune» sau semaforul învățării.',
        jocuriDigitaleSiInteractive: 'Joc Wordwall integrat (roata norocului, labirint, chestionar interactiv).',
        linkWordwallExemplu: 'https://wordwall.net/ro',
        aprecieriSiConcluzii: 'Aprecieri verbale pozitive pentru participare activă. Notarea temei pentru acasă.',
      },
      schemaTablei: `[SCHIȚA TABLEI - Se notează data, titlul cu roșu și principalele exemple/formule didactice]`,
      createdAt: Date.now(),
    };

    const blob = await generateDocxBlob(blankPlan);
    downloadBlob(blob, 'Sablon_Oficial_Schite_de_Lectie.docx');
  };

  return (
    <div className="flex-1 bg-stone-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-md border border-blue-200 uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" />
                Fișier de Referință: schițe de lecție.docx
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Ghidul Structurii Metodologice Obligatorii
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Conform standardelor didacticii învățământului primar din România și
                cerințelor inspecțiilor școlare.
              </p>
            </div>

            <button
              onClick={downloadBlankTemplate}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              Descarcă Șablonul (.docx)
            </button>
          </div>

          {/* Rubrici Obligatorii Breakdown */}
          <div className="mt-6 space-y-5">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Rubricile Obligatorii Generate de Metodist:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-blue-700 block uppercase">
                  1. Date de Identificare Didactică
                </span>
                <ul className="mt-2 space-y-1 text-xs text-stone-700 font-medium">
                  <li>• <strong>Clasa:</strong> ex: Clasa a III-a A / Clasa I B</li>
                  <li>• <strong>Profesorul:</strong> Cadrul didactic</li>
                  <li>• <strong>Data:</strong> Data calendaristică a susținerii orei</li>
                  <li>• <strong>Disciplina:</strong> ex: Limba și literatura română, MEM</li>
                  <li>• <strong>Subiectul lecției:</strong> Tema exactă curriculară</li>
                  <li>• <strong>Tipul lecției:</strong> Dobândire cunoștințe, consolidare, etc.</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-blue-700 block uppercase">
                  2. Obiective Operaționale
                </span>
                <p className="text-xs text-stone-600 mt-1">
                  Formulate clar, măsurabil, cu verbe de acțiune specifice nivelului de
                  vârstă:
                </p>
                <div className="mt-2 text-xs text-stone-800 space-y-1">
                  <span className="inline-block bg-white px-2 py-0.5 rounded border border-stone-200 font-mono text-[11px] mr-1">
                    Să identifice...
                  </span>
                  <span className="inline-block bg-white px-2 py-0.5 rounded border border-stone-200 font-mono text-[11px] mr-1">
                    Să explice...
                  </span>
                  <span className="inline-block bg-white px-2 py-0.5 rounded border border-stone-200 font-mono text-[11px] mr-1">
                    Să recunoască...
                  </span>
                  <span className="inline-block bg-white px-2 py-0.5 rounded border border-stone-200 font-mono text-[11px]">
                    Să aplice...
                  </span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 md:col-span-2">
                <span className="text-xs font-bold text-blue-700 block uppercase">
                  3. Activitățile Planificate (Etapele Lecției)
                </span>
                <p className="text-xs text-stone-600 mt-1 mb-3">
                  Tabelul metodologic cu cele 4 etape obligatorii, timp alocat și
                  responsabilități:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs">
                    <span className="font-bold text-blue-900 block">Etapa I</span>
                    <strong className="block text-stone-800 mt-0.5">
                      Moment organizatoric & captarea atenției
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      (3-5 min) Mascote, ghicitori, joc scurt.
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs">
                    <span className="font-bold text-blue-900 block">Etapa II</span>
                    <strong className="block text-stone-800 mt-0.5">
                      Reactualizarea cunoștințelor
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      (5-8 min) Ancorarea în lecțiile anterioare.
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs">
                    <span className="font-bold text-blue-900 block">Etapa III</span>
                    <strong className="block text-stone-800 mt-0.5">
                      Transmiterea noilor conținuturi
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      (15-20 min) Tablă marcată cu roșu, manual.
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs">
                    <span className="font-bold text-blue-900 block">Etapa IV</span>
                    <strong className="block text-stone-800 mt-0.5">
                      Activități de exersare, aplicare sau creație
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-1">
                      (10-15 min) Fișe, grupe, jetoane pe bancă.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 md:col-span-2">
                <span className="text-xs font-bold text-emerald-800 block uppercase">
                  4. Feedback la finalul orei & Evaluare
                </span>
                <p className="text-xs text-stone-700 mt-1">
                  Include metode active verificate la ciclu primar:
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-stone-200">
                    <strong className="block text-stone-800">
                      Metoda «Arată și spune»
                    </strong>
                    <span className="text-stone-500 text-[11px]">
                      Elevii arată cartonașul sau obiectul corespunzător.
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-stone-200">
                    <strong className="block text-stone-800">
                      Jocuri Digitale (Wordwall)
                    </strong>
                    <span className="text-stone-500 text-[11px]">
                      Roata norocului, cutia misterioasă, perechi.
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-stone-200">
                    <strong className="block text-stone-800">
                      Aprecieri pozitive & Concluzii
                    </strong>
                    <span className="text-stone-500 text-[11px]">
                      Recompense simbolice, motivare și sarcină acasă.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loadable Curriculum Samples */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Modele Complete Gata de Încărcat în Formatul Oficial:
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Puteți încărca direct aceste schițe elaborate conform cerințelor pentru a le
            inspecta, edita sau descărca în Word:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_LESSON_PLANS.map((sample) => (
              <div
                key={sample.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-blue-300 hover:shadow-xs bg-stone-50/50 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-blue-800">
                      {sample.clasa}
                    </span>
                    <span>{sample.disciplina}</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 leading-snug">
                    {sample.subiectulLectiei}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {sample.titlu}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {sample.activitatiPlanificate.length} etape · Wordwall inclus
                  </span>
                  <button
                    onClick={() => onLoadSample(sample)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Încarcă în editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
