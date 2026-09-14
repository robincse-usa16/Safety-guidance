'use client';

import { FileImage, LoaderCircle, QrCode, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadAnalyzer({ mode, onExtract }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function processFile(file) {
    setError(''); setProgress(0);
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose a PNG, JPG or WebP image.');
    if (file.size > MAX_SIZE) return setError('Image must be smaller than 5 MB.');
    try {
      if (mode === 'qr') {
        setStatus('Reading QR code locally...');
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const objectUrl = URL.createObjectURL(file);
        try {
          const result = await new BrowserQRCodeReader().decodeFromImageUrl(objectUrl);
          onExtract(result.getText()); setProgress(100); setStatus('QR content extracted. Review it before scanning.');
        } finally { URL.revokeObjectURL(objectUrl); }
      } else {
        setStatus('Extracting text locally...');
        const { recognize } = await import('tesseract.js');
        const result = await recognize(file, 'eng', { logger: (message) => { if (message.status === 'recognizing text') setProgress(Math.round((message.progress || 0) * 100)); } });
        const text = result.data.text.trim();
        if (text.length < 5) throw new Error('Not enough readable text was found. Try a clearer screenshot.');
        onExtract(text); setProgress(100); setStatus('Text extracted. Review it before scanning.');
      }
    } catch (processError) { setError(processError.message || `Could not read this ${mode === 'qr' ? 'QR code' : 'image'}.`); setStatus(''); }
  }

  const Icon = mode === 'qr' ? QrCode : FileImage;
  return <div className="upload-analyzer"><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => processFile(event.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()}><span><Icon /></span><strong>{mode === 'qr' ? 'Upload a QR-code image' : 'Upload a message screenshot'}</strong><small>PNG, JPG or WebP · maximum 5 MB</small><em><UploadCloud size={17} />Choose image</em></button>{status && <div className="upload-status">{progress < 100 && <LoaderCircle className="spin" />}<span>{status}</span><b>{progress}%</b><i style={{ width: `${progress}%` }} /></div>}{error && <div className="form-error" role="alert">{error}</div>}</div>;
}
