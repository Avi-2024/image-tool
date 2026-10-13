import { ArrowRight } from 'lucide-react';
import type { Selection } from '@/lib/converter/types';

type ConversionSettingsProps = {
  from: Selection;
  to: Selection;
  quality: number;
  background: string;
  locked: boolean;
  disabled: boolean;
  webp: boolean;
  alpha: boolean;
  setFrom: (value: Selection) => void;
  setTo: (value: Selection) => void;
  setQuality: (value: number) => void;
  setBackground: (value: string) => void;
};

export default function ConversionSettings({ from, to, quality, background, locked, disabled, webp, alpha, setFrom, setTo, setQuality, setBackground }: ConversionSettingsProps) {
  const qualityPercent = Math.round(quality * 100);
  const rangeFill = (quality - .1) / .9 * 100;

  return (
    <div className="settings">
      <div className="format-controls">
        <label className="field-label source-field">
          From
          <select value={from} onChange={event => setFrom(event.target.value as Selection)} disabled={disabled || locked}>
            <option value="any">Auto-detect</option><option value="jpg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option>
          </select>
        </label>
        <ArrowRight className="format-arrow" size={18} aria-hidden="true" />
        <label className={`field-label output-field ${to !== 'any' ? 'is-selected' : ''}`}>
          Convert to
          <select value={to} onChange={event => setTo(event.target.value as Selection)} disabled={disabled || locked}>
            <option value="any">Choose format</option><option value="jpg">JPG</option><option value="png">PNG</option><option value="webp" disabled={!webp}>WebP{webp ? '' : ' — unavailable'}</option>
          </select>
        </label>
      </div>
      <div className="settings-extra">
        {to === 'jpg' || to === 'webp' ? (
          <label className="quality-control">
            <span className="control-heading">Quality <output>{qualityPercent}%</output></span>
            <input aria-label="Output quality" type="range" min="10" max="100" step="1" value={qualityPercent} disabled={disabled}
              style={{ background: `linear-gradient(to right,var(--accent) 0%,var(--accent) ${rangeFill}%,var(--border-strong) ${rangeFill}%,var(--border-strong) 100%)` }}
              onChange={event => setQuality(Number(event.target.value) / 100)} />
            <span className="control-note">Higher quality, usually larger files.</span>
          </label>
        ) : (
          <div className="quality-note">{to === 'png' ? 'Lossless PNG. Keeps transparency.' : 'Choose the format you want to download.'}</div>
        )}
        {to === 'jpg' && alpha && (
          <label className="background-control">
            <span className="control-heading">Background</span>
            <span className="color-control"><input type="color" aria-label="JPEG background color" value={background} disabled={disabled} onChange={event => setBackground(event.target.value)} /><span>{background.toUpperCase()}</span></span>
            <span className="control-note">Fills transparent areas.</span>
          </label>
        )}
      </div>
    </div>
  );
}
