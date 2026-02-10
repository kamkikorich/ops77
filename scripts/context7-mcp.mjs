import { spawn } from 'node:child_process';

function buildArgs({ apiKey, extraArgs }) {
  const args = ['-y', '@upstash/context7-mcp@latest'];

  if (apiKey) args.push('--api-key', apiKey);

  if (extraArgs.length > 0) args.push(...extraArgs);

  return args;
}

const apiKey = process.env.CONTEXT7_API_KEY?.trim();
const extraArgs = process.argv.slice(2);

if (extraArgs.includes('--print')) {
  const filtered = extraArgs.filter((arg) => arg !== '--print');
  const args = buildArgs({ apiKey, extraArgs: filtered });
  const safeArgs = args.map((arg, idx, arr) => {
    if (arg === '--api-key') return arg;
    if (idx > 0 && arr[idx - 1] === '--api-key') return 'REDACTED';
    return arg;
  });

  process.stdout.write(
    JSON.stringify(
      {
        command: 'npx',
        args: safeArgs,
        env: { CONTEXT7_API_KEY: apiKey ? '(set)' : '(not set)' },
      },
      null,
      2,
    ) + '\n',
  );
  process.exit(0);
}

const child = spawn('npx', buildArgs({ apiKey, extraArgs }), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
