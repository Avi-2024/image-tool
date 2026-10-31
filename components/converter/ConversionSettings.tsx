import { ArrowRight } from 'lucide-react';
import type { Format, Selection } from '@/lib/converter/types';

type ConversionSettingsProps = {
  sourceLabel: string;
  to: Selection;
  suggestedTo?: Format;
  quality: number;
  background: string;
  locked: boolean;
  disabled: boolean;
  webp: boolean;
  alpha: boolean;
  setTo: (value: Selection) => void;
  setQuality: (value: number) => void;
  setBackground: (value: string) => void;
};

export default function ConversionSettings({ sourceLabel, to, suggestedTo, quality, background, locked, disabled, webp, alpha, setTo, setQuality, setBackground }: ConversionSettingsProps) {
  const qualityPercent = Math.round(quality * 100);
  const rangeFill = (quality - .1) / .9 * 100;

  return (
    <div className="settings">
      <div className="format-controls">
        <div className="field-label source-field"><span>Source</span><strong className="source-display">{sourceLabel}</strong></div>
        <ArrowRight className="format-arrow" size={18} aria-hidden="true" />
        <fieldset className={`field-label output-field ${to !== 'any' ? 'is-selected' : ''}`} disabled={disabled || locked}>
          <legend>Convert to</legend>
          <div className="format-options">
            {(['jpg', 'png', 'webp'] as const).map(format => <button key={format} type="button"
              aria-pressed={to === format} disabled={disabled || locked || (format === 'webp' && !webp)}
              onClick={() => setTo(format)}>{format.toUpperCase()}{suggestedTo === format && to === 'any' && webp && <span className="format-recommended">Suggested</span>}</button>)}
          </div>
        </fieldset>
      </div>
      <div className="settings-extra">
        {to === 'jpg' || to === 'webp' ? (
          <div className="quality-control">
            <span className="control-heading">Quality <output>{qualityPercent}%</output></span>
            <div className="quality-presets" role="group" aria-label="Quality presets">
              {([['Small file', .65], ['Balanced', .9], ['Best quality', .95]] as const).map(([label, value]) => (
                <button key={label} type="button" aria-pressed={quality === value} disabled={disabled}
                  onClick={() => setQuality(value)}>{label}</button>
              ))}
            </div>
            <input aria-label="Output quality" type="range" min="10" max="100" step="1" value={qualityPercent} disabled={disabled}
              style={{ background: `linear-gradient(to right,var(--accent) 0%,var(--accent) ${rangeFill}%,var(--border-strong) ${rangeFill}%,var(--border-strong) 100%)` }}
              onChange={event => setQuality(Number(event.target.value) / 100)} />
            <span className="control-note">Higher quality, usually larger files.</span>
          </div>
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
