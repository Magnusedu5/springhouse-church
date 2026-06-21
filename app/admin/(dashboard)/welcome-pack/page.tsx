'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';

const DEFAULT_PATH = '/new-member';

export default function WelcomePackPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-detect the current origin on mount so the URL is always correct
  useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}${DEFAULT_PATH}`;
    setBaseUrl(url);
    setInputVal(url);
  }, []);

  const registrationUrl = baseUrl || inputVal;

  function applyUrl() {
    const trimmed = inputVal.trim().replace(/\/$/, '');
    setBaseUrl(trimmed || window.location.origin + DEFAULT_PATH);
  }

  function resetUrl() {
    const url = `${window.location.origin}${DEFAULT_PATH}`;
    setBaseUrl(url);
    setInputVal(url);
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPng() {
    // Find the canvas element rendered by QRCodeCanvas
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Draw onto a larger canvas with padding + branding for a clean printable output
    const size = canvas.width;
    const pad = 48;
    const labelH = 80;
    const out = document.createElement('canvas');
    out.width = size + pad * 2;
    out.height = size + pad * 2 + labelH;
    const ctx = out.getContext('2d')!;

    // Background
    ctx.fillStyle = '#FEFAF3'; // brand-cream
    ctx.fillRect(0, 0, out.width, out.height);

    // Gold border
    ctx.strokeStyle = '#C8892A';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, out.width - 16, out.height - 16);

    // QR code
    ctx.drawImage(canvas, pad, pad);

    // Label text
    ctx.fillStyle = '#1A3560'; // brand-blue
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('The SpringHouse Church', out.width / 2, size + pad + 32);
    ctx.fillStyle = '#C8892A'; // brand-gold
    ctx.font = '14px serif';
    ctx.fillText('Scan to register as a new member', out.width / 2, size + pad + 56);

    const link = document.createElement('a');
    link.download = 'springhouse-new-member-qr.png';
    link.href = out.toDataURL('image/png');
    link.click();
  }

  function downloadSvg() {
    const svg = canvasRef.current?.previousElementSibling?.querySelector('svg');
    if (!svg) return;
    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'springhouse-new-member-qr.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Welcome Pack QR Code</h1>
        <p className="text-gray-500 text-sm mt-1">
          Print this QR code in your welcome packs. When scanned, it takes new members directly to the registration page.
          Update the URL below after you deploy to your live domain.
        </p>
      </div>

      {/* URL editor */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-brand-blue text-sm uppercase tracking-wide">Registration URL</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            placeholder="https://yourdomain.com/new-member"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-4 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={resetUrl}
            title="Reset to current site URL"
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate flex-1">
            {registrationUrl}
          </span>
          <button
            type="button"
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          After deploying your site, paste your live domain here (e.g. <span className="font-mono">https://springhousechurch.org/new-member</span>) and redownload the QR code before printing.
        </p>
      </div>

      {/* QR Code display */}
      {registrationUrl && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">

            {/* Preview card — what it'll look like printed */}
            <div className="flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 text-center">Print Preview</p>
              <div className="bg-[#FEFAF3] border-2 border-brand-gold/60 rounded-2xl p-6 flex flex-col items-center gap-4 w-[260px]">
                <p className="font-display text-sm font-semibold text-brand-blue text-center leading-snug">
                  The SpringHouse Church
                </p>
                {/* SVG version for display */}
                <div>
                  <QRCodeSVG
                    value={registrationUrl}
                    size={180}
                    bgColor="#FEFAF3"
                    fgColor="#1A3560"
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-[11px] text-brand-gold font-semibold text-center leading-tight">
                  Scan to register as a<br />new member
                </p>
              </div>
            </div>

            {/* Hidden canvas used for PNG export */}
            <div ref={canvasRef} className="hidden">
              <QRCodeCanvas
                value={registrationUrl}
                size={400}
                bgColor="#FEFAF3"
                fgColor="#1A3560"
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Info + download actions */}
            <div className="flex-1 space-y-5">
              <div>
                <h3 className="font-semibold text-brand-blue mb-2">Download for Printing</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Download the PNG for general use (Word, Canva, etc.) or SVG for
                  high-resolution professional printing. The PNG includes the church name
                  and caption ready to print.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={downloadPng}
                  className="flex items-center gap-3 px-5 py-3 bg-brand-blue text-white rounded-xl hover:bg-[#142d54] transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">Download PNG</p>
                    <p className="text-white/70 text-xs">With church name &amp; caption — ready to print</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={downloadSvg}
                  className="flex items-center gap-3 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">Download SVG</p>
                    <p className="text-gray-400 text-xs">Vector — best for professional print shops</p>
                  </div>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 space-y-1">
                <p className="font-semibold">How it works</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-600 text-xs leading-relaxed">
                  <li>Print the QR code and include it in your welcome packs</li>
                  <li>New members scan it with their phone camera</li>
                  <li>They are taken straight to the registration form</li>
                  <li>You see their details in the Members admin tab</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
