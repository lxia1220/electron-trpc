import React, { useState } from 'react';
import { ipcLink } from 'electron-trpc/renderer';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../electron/api';
import { createRoot } from 'react-dom/client';


const trpcReact = createTRPCReact<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()],
    })
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelloElectron />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}

function HelloElectron() {
  const { data } = trpcReact.greeting.useQuery({ name: 'Electron' });
  trpcReact.subscription.useSubscription(undefined, {
    onData: (data) => {
      console.log(data);
    },
  });

  if (!data) {
    return null;
  }

  return <div data-testid="greeting">{data.text}</div>;
}

const root = createRoot(document.getElementById('react-root')!);
root.render(<App />);
