import "./globals.css";

export const metadata = {
  title: "Kids Colouring Book",
  description: "Smart colouring app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
