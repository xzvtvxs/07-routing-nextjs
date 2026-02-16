// layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "07-routing-nextjs",
};

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function NotesLayout({ children, modal }: Props) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
