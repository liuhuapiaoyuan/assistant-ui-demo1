import type { Metadata } from "next";
import "./globals.css";
 

export const metadata: Metadata = {
  title: "assistant-ui App",
  description: "Generated by create-assistant-ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='antialiased'
      >
        {children}
      </body>
    </html>
  );
}
