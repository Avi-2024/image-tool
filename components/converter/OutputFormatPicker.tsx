import type { Format, Selection } from '@/lib/converter/types';

export default function OutputFormatPicker({ to, suggestedTo, webp, disabled, onChange }: {
  to: Selection;
  suggestedTo?: Format;
  webp: boolean;
  disabled: boolean;
  onChange: (format: Format) => void;
}) {
  return <div className="format-options">
    {(['jpg', 'png', 'webp'] as const).map(format => <button key={format} type="button"
      aria-pressed={to === format} disabled={disabled || (format === 'webp' && !webp)}
      onClick={() => onChange(format)}>
      {format === 'jpg' ? 'JPG (JPEG)' : format.toUpperCase()}
      {suggestedTo === format && to === 'any' && webp && <span className="format-recommended">Suggested</span>}
    </button>)}
  </div>;
}
