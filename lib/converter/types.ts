export type Format = 'jpg' | 'png' | 'webp';
export type Selection = Format | 'any';
export type Status = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export interface Settings { to: Format; quality: number; background: string }
export interface Result { blob: Blob; width: number; height: number }
export interface QueueFile { id: string; file: File; source?: Format; preview?: string; width?: number; height?: number; status: Status; error?: string; result?: Result }
export type WorkerRequest = { id: string; file: Blob; settings: Settings };
export type WorkerResponse = { id: string; result?: Result; error?: string };
