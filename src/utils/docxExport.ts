import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} from 'docx';
import { LessonPlan } from '../types';

export async function generateDocxBlob(lesson: LessonPlan): Promise<Blob> {
  const tableBorder = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: '999999',
  };

  const borders = {
    top: tableBorder,
    bottom: tableBorder,
    left: tableBorder,
    right: tableBorder,
  };

  // Header metadata rows
  const metadataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Clasa:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.clasa || 'Clasa a III-a', font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Profesorul / Învățător:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.profesor || 'Cadru didactic', font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Data:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.data || new Date().toLocaleDateString('ro-RO'), font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Disciplina:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.disciplina, font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Subiectul lecției:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.subiectulLectiei, bold: true, font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders,
            shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Tipul lecției:', bold: true, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: lesson.tipulLectiei, font: 'Calibri' })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Table header for stages
  const stageHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders,
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Etapele lecției / Timp', bold: true, color: 'FFFFFF', font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        borders,
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Activitatea profesorului\n(Exemple tablă / marcat cu roșu)', bold: true, color: 'FFFFFF', font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders,
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Activitatea elevilor\n(Practic, cărți pe bancă)', bold: true, color: 'FFFFFF', font: 'Calibri' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        borders,
        shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Metode & Mijloace', bold: true, color: 'FFFFFF', font: 'Calibri' })],
          }),
        ],
      }),
    ],
  });

  // Stages rows
  const stageRows = (lesson.activitatiPlanificate || []).map((stage, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : 'F9FAFB';

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders,
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: stage.numeEtapa, bold: true, font: 'Calibri' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `(${stage.timpAlocat})`, italics: true, color: '4B5563', font: 'Calibri' }),
              ],
            }),
            stage.resurseFizice ? new Paragraph({
              spacing: { before: 80 },
              children: [
                new TextRun({ text: 'Materiale pe bancă: ', bold: true, size: 18, color: '047857', font: 'Calibri' }),
                new TextRun({ text: stage.resurseFizice, size: 18, color: '047857', font: 'Calibri' }),
              ],
            }) : new Paragraph({}),
          ],
        }),
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          borders,
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: stage.activitateaProfesorului, font: 'Calibri' }),
              ],
            }),
            stage.marcajeTablaVizuale ? new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: 'La tablă (vizual / roșu): ', bold: true, color: 'DC2626', font: 'Calibri' }),
                new TextRun({ text: stage.marcajeTablaVizuale, italics: true, color: 'DC2626', font: 'Calibri' }),
              ],
            }) : new Paragraph({}),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders,
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: stage.activitateaElevilor, font: 'Calibri' }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          borders,
          shading: { fill: bgFill, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: stage.metodeMijloace, font: 'Calibri' }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  const stagesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [stageHeaderRow, ...stageRows],
  });

  // Obiective paragraphs
  const objectiveParagraphs = (lesson.obiectiveOperationale || []).map((obj) => (
    new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun({ text: obj, font: 'Calibri' })],
    })
  ));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'PROIECT DIDACTIC / SCHIȚĂ DE LECȚIE',
                bold: true,
                size: 32,
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
          }),

          // Metadata Table
          metadataTable,

          new Paragraph({
            spacing: { before: 300, after: 150 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Obiective operaționale:',
                bold: true,
                size: 24,
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
          }),
          ...objectiveParagraphs,

          new Paragraph({
            spacing: { before: 300, after: 150 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Activitățile planificate (Desfășurarea metodologică a lecției):',
                bold: true,
                size: 24,
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
          }),

          // Stages Table
          stagesTable,

          // Feedback final
          new Paragraph({
            spacing: { before: 300, after: 100 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Feedback la finalul orei și evaluare:',
                bold: true,
                size: 24,
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Timp alocat: ', bold: true, font: 'Calibri' }),
              new TextRun({ text: `${lesson.feedbackFinal?.timpAlocat || '5 min'}\n`, font: 'Calibri' }),
              new TextRun({ text: 'Metodă de verificare: ', bold: true, font: 'Calibri' }),
              new TextRun({ text: `${lesson.feedbackFinal?.metodaVerificare || 'Metoda «Arată și spune»'}\n`, font: 'Calibri' }),
              new TextRun({ text: 'Jocuri & Resurse Digitale (ex: Wordwall): ', bold: true, font: 'Calibri' }),
              new TextRun({ text: `${lesson.feedbackFinal?.jocuriDigitaleSiInteractive || 'Joc interactiv la videoproiector / tablete'}\n`, font: 'Calibri' }),
              new TextRun({ text: 'Aprecieri și concluzii: ', bold: true, font: 'Calibri' }),
              new TextRun({ text: `${lesson.feedbackFinal?.aprecieriSiConcluzii || 'Aprecieri verbale încurajatoare'}`, font: 'Calibri' }),
            ],
          }),

          ...(lesson.schemaTablei ? [
            new Paragraph({
              spacing: { before: 250, after: 100 },
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: 'Schița tablei (Reprezentare vizuală):',
                  bold: true,
                  size: 24,
                  color: 'B91C1C',
                  font: 'Calibri',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: lesson.schemaTablei, font: 'Consolas', size: 20 }),
              ],
            }),
          ] : []),

          ...(lesson.sugestiiDiferentiere ? [
            new Paragraph({
              spacing: { before: 200, after: 80 },
              heading: HeadingLevel.HEADING_3,
              children: [
                new TextRun({
                  text: 'Diferențiere pedagogică (Sprijin și aprofundare):',
                  bold: true,
                  size: 22,
                  color: '047857',
                  font: 'Calibri',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: lesson.sugestiiDiferentiere, font: 'Calibri' }),
              ],
            }),
          ] : []),

          new Paragraph({
            spacing: { before: 350, after: 100 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: '999999',
                size: 18,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 100 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'An școlar 2026 - 2027',
                bold: true,
                size: 20,
                color: '4B5563',
                font: 'Calibri',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
