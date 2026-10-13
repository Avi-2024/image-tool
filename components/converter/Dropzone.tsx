'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, ImagePlus, Plus } from 'lucide-react';
import type { Selection } from '@/lib/converter/types';
import { MIME } from '@/lib/converter/constants';

type DropzoneProps = {
  from: Selection;
  compact: boolean;
  disabled: boolean;
  onAdd: (files: File[]) => void;
};

export default function Dropzone({ from, compact, disabled, onAdd }: DropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [drag, setDrag] = useState(false);

  return (
    <div
      className={`dropzone ${compact ? 'compact' : ''} ${drag ? 'dragover' : ''}`}
      onDragEnter={event => {
        event.preventDefault();
        depth.current++;
        if (!disabled) setDrag(true);
      }}
      onDragLeave={event => {
        event.preventDefault();
        if (--depth.current <= 0) setDrag(false);
      }}
      onDragOver={event => event.preventDefault()}
      onDrop={event => {
        event.preventDefault();
        depth.current = 0;
        setDrag(false);
        if (!disabled) onAdd(Array.from(event.dataTransfer.files));
      }}
    >
      <input
        id="image-input"
        ref={input}
        type="file"
        hidden
        multiple
        accept={from === 'any' ? 'image/jpeg,image/png,image/webp' : MIME[from]}
        aria-label="Image files"
        disabled={disabled}
        onChange={event => {
          if (event.target.files) onAdd(Array.from(event.target.files));
          event.target.value = '';
        }}
      />
      {compact ? (
        <button type="button" className="text-button add-button" disabled={disabled} onClick={() => input.current?.click()}>
          <Plus size={17} /> Add images
        </button>
      ) : (
        <button
          type="button"
          className="dropzone-trigger"
          aria-label="Choose images"
          aria-describedby="upload-limits"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          <span className="upload-symbol" aria-hidden="true">
            <span className="upload-sheet sheet-back" />
            <span className="upload-sheet sheet-middle" />
            <span className="upload-sheet sheet-front"><ImagePlus size={31} strokeWidth={1.5} /></span>
          </span>
          <span className="upload-copy">
            <span className="upload-title">{drag ? 'Drop them here.' : 'Drop your images here.'}</span>
            <span className="upload-description">Drag and drop your files, or choose images from your device.</span>
            <span className="upload-limits" id="upload-limits">
              {from === 'any' ? 'JPG, PNG & WebP' : `${from.toUpperCase()} images`}
              <span aria-hidden="true">·</span>30 files<span aria-hidden="true">·</span>25 MB each
            </span>
          </span>
          <span className="upload-cta">
            <span className="button primary browse-button">Choose images <ArrowUpRight size={17} /></span>
            <span className="upload-cta-note">No sign-up needed</span>
          </span>
        </button>
      )}
    </div>
  );
}
