import { convertOffscreen } from './engine';
import type { WorkerRequest, WorkerResponse } from './types';
const scope = globalThis as unknown as { onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null; postMessage: (response: WorkerResponse) => void };
scope.onmessage=async ({data}) => {
  try {scope.postMessage({id:data.id,result:await convertOffscreen(data.file,data.settings)});}
  catch(error) {scope.postMessage({id:data.id,error:error instanceof Error?error.message:'Conversion failed. Try another image.'});}
};
