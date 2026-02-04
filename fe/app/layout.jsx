import { DietProvider } from './context/DietContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DietProvider>
          {children}
        </DietProvider>
      </body>
    </html>
  );
}
