import mammoth from 'mammoth';
import { UploadedAttachment } from '../types';

/**
 * Procesează un fișier de orice tip încărcat de cadru didactic
 * (foto manual, fișă Word, programă PDF, prezentare, text etc.)
 */
export async function processUploadedFile(file: File): Promise<UploadedAttachment> {
  const fileId = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type || '';
  const lowerName = fileName.toLowerCase();

  // 1. Fișiere de tip Imagine (fotografii manual, pagini de caiet, scanări etc.)
  if (
    mimeType.startsWith('image/') ||
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    lowerName.endsWith('.webp') ||
    lowerName.endsWith('.heic') ||
    lowerName.endsWith('.gif') ||
    lowerName.endsWith('.bmp')
  ) {
    const base64Data = await readFileAsBase64(file);
    return {
      id: fileId,
      name: fileName,
      type: 'image',
      size: fileSize,
      mimeType: mimeType || 'image/jpeg',
      previewUrl: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`,
      dataBase64: base64Data,
    };
  }

  // 2. Fișiere PDF (programă școlară, manuale digitale PDF, fișe)
  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    const base64Data = await readFileAsBase64(file);
    return {
      id: fileId,
      name: fileName,
      type: 'pdf',
      size: fileSize,
      mimeType: 'application/pdf',
      dataBase64: base64Data,
    };
  }

  // 3. Documente Word DOCX (proiecte didactice anterioare, fișe de lucru)
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lowerName.endsWith('.docx')
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return {
        id: fileId,
        name: fileName,
        type: 'docx',
        size: fileSize,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extractedText: result.value || `[Conținut extras din document Word: ${fileName}]`,
      };
    } catch {
      return {
        id: fileId,
        name: fileName,
        type: 'docx',
        size: fileSize,
        extractedText: `[Fișier DOCX atașat: ${fileName}]`,
      };
    }
  }

  // 4. Documente Word vechi (.doc) sau Rich Text Format (.rtf)
  if (
    lowerName.endsWith('.doc') ||
    lowerName.endsWith('.rtf') ||
    mimeType.includes('msword') ||
    mimeType.includes('rtf')
  ) {
    const text = await readFileAsTextFallback(file);
    return {
      id: fileId,
      name: fileName,
      type: 'doc' as any,
      size: fileSize,
      mimeType: mimeType || 'application/msword',
      extractedText: text.slice(0, 10000),
    };
  }

  // 5. Fișiere Text, Markdown, CSV etc.
  if (
    mimeType.startsWith('text/') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.csv')
  ) {
    try {
      const textContent = await file.text();
      return {
        id: fileId,
        name: fileName,
        type: 'text',
        size: fileSize,
        mimeType: mimeType || 'text/plain',
        extractedText: textContent,
      };
    } catch {
      // Fallback
    }
  }

  // 6. Orice alt format (prezentări, tabele, etc.) - Încercare citire text sau fallback
  try {
    const textFallback = await file.text();
    if (textFallback && textFallback.length > 0 && !/[\x00-\x08\x0E-\x1F]/.test(textFallback.slice(0, 100))) {
      return {
        id: fileId,
        name: fileName,
        type: 'text',
        size: fileSize,
        mimeType: mimeType || 'application/octet-stream',
        extractedText: textFallback.slice(0, 10000),
      };
    }
  } catch {
    // Binary file fallback
  }

  const base64Data = await readFileAsBase64(file);
  return {
    id: fileId,
    name: fileName,
    type: 'text',
    size: fileSize,
    mimeType: mimeType || 'application/octet-stream',
    extractedText: `[Fișier resursă atașat: ${fileName} (${Math.round(fileSize / 1024)} KB)]`,
  };
}

/**
 * Procesează simultan un grup de fișiere de orice tip
 */
export async function processMultipleFiles(files: FileList | File[]): Promise<UploadedAttachment[]> {
  const fileArray = Array.from(files);
  const results: UploadedAttachment[] = [];

  for (const file of fileArray) {
    try {
      const attachment = await processUploadedFile(file);
      results.push(attachment);
    } catch (err) {
      console.error(`Eroare la procesarea fișierului ${file.name}:`, err);
    }
  }

  return results;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

async function readFileAsTextFallback(file: File): Promise<string> {
  try {
    return await file.text();
  } catch {
    return `[Conținut fișier ${file.name}]`;
  }
}
