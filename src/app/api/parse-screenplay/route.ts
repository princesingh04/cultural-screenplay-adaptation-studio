import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function parsePdfBuffer(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require('pdf2json');
    const parser = new PDFParser(null, 1);

    parser.on('pdfParser_dataError', (err: any) => {
      reject(err?.parserError || err);
    });

    parser.on('pdfParser_dataReady', (pdfData: any) => {
      const text = parser.getRawTextContent() || '';
      const pageCount = pdfData?.Pages?.length || 1;
      resolve({ text, pageCount });
    });

    parser.parseBuffer(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    const lowerName = filename.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    let pageCount = 1;

    if (lowerName.endsWith('.pdf')) {
      const result = await parsePdfBuffer(buffer);
      extractedText = result.text;
      pageCount = result.pageCount;
    } else {
      // Plain text, fountain, markdown
      extractedText = buffer.toString('utf-8');
      pageCount = Math.max(1, Math.ceil(extractedText.split('\n').length / 55));
    }

    // Clean up excessive whitespace while preserving scene breaks
    const normalizedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/----------------Page \(\d+\) Break----------------/g, '\n\n')
      .trim();

    return NextResponse.json({
      success: true,
      filename,
      pageCount,
      text: normalizedText,
    });
  } catch (err: any) {
    console.error('File parsing error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to parse screenplay file' },
      { status: 500 }
    );
  }
}
