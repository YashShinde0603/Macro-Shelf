import { DietProvider } from './context/DietContext';
import './globals.css';


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
