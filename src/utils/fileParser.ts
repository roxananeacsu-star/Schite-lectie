import mammoth from 'mammoth';
import { UploadedAttachment } from '../types';

export async function processUploadedFile(file: File): Promise<UploadedAttachment> {
  const fileId = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type;

  // Image files
  if (mimeType.startsWith('image/')) {
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

  // PDF files
  if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
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

  // Word docx files
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.toLowerCase().endsWith('.docx')
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
        extractedText: result.value || '',
      };
    } catch {
      // Fallback
      return {
        id: fileId,
        name: fileName,
        type: 'docx',
        size: fileSize,
        extractedText: `[Fișier DOCX atașat: ${fileName}]`,
      };
    }
  }

  // Word doc (older binary) or text file
  if (fileName.toLowerCase().endsWith('.doc') || mimeType.includes('msword')) {
    // Binary doc format
    const text = await readFileAsTextFallback(file);
    return {
      id: fileId,
      name: fileName,
      type: 'doc' as any,
      size: fileSize,
      extractedText: text.slice(0, 5000),
    };
  }

  // Text fallback
  const textContent = await file.text();
  return {
    id: fileId,
    name: fileName,
    type: 'text',
    size: fileSize,
    extractedText: textContent,
  };
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
