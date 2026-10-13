// Accept the preview supervisor's Vite-style flags without passing them to Next.js.
import {spawn} from 'node:child_process';
const args=process.argv.slice(2),index=args.indexOf('--port');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','0.0.0.0','--port',index>=0?args[index+1]:'3000'],{stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
