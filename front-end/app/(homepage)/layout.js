import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="top-bar">
          <Link href="/.">Dashboard</Link>
          <Link href="/[username]" as="/blakeminix">Profile</Link>
          <Link href="/settings">Settings</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
