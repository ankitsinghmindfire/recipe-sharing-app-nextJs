import localFont from 'next/font/local';
import './globals.css';
import { Navbar } from './_components/navbar/Navbar';
import { ReduxProvider } from './redux-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Recipe sharing app',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          {children}
          <Navbar />
        </ReduxProvider>
      </body>
    </html>
  );
}
