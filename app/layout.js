import "./globals.css";

export const metadata = {
  title: "image-Hub",
  description: "Made by Subhash",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
