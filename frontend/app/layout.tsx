import type { Metadata } from 'next';
import { Provider } from 'react-redux';
import './globals.css';
import { store } from '@/redux/store';

export const metadata: Metadata = {
  title: 'Zayma',
  description:
    'Marketplace de vente en ligne pour les acheteurs et les vendeurs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="fr">
        <body>
          <main className="min-h-screen w-full">{children}</main>
        </body>
      </html>
    </Provider>
  );
}
