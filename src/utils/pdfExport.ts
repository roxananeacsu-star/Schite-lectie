import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LessonPlan } from '../types';

/**
 * Descarcă schița de lecție în format PDF (.pdf).
 * Folosește randare de înaltă rezoluție a documentului cu fallback garantat pe fereastră de tipărire / PDF.
 */
export async function downloadLessonPlanPdf(lesson: LessonPlan, elementId: string = 'lesson-plan-document'): Promise<boolean> {
  const safeName = (lesson.subiectulLectiei || 'schita_de_lectie')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 35);
  const fileName = `Schita_Lectie_${safeName}.pdf`;

  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return true;
  }

  try {
    // Încercare randare grafică de calitate A4 prin html2canvas + jsPDF
    const canvas = await html2canvas(element, {
      scale: 2, // Rezoluție Retina / 300 DPI
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // 10mm margine
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;

    // Prima pagină
    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= (pdfHeight - margin * 2);

    // Pagini următoare dacă schița depășește o pagină A4
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - margin * 2);
    }

    pdf.save(fileName);
    return true;
  } catch (err) {
    console.warn('Randare html2canvas directă indisponibilă, se folosește generarea PDF via browser:', err);
    // Fallback transparent și imediat: dialogul nativ de Salvare ca PDF / Tipărire
    window.print();
    return false;
  }
}
