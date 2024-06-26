import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const myFont = localFont({ src: "./fonts/aria_black.woff2" });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${myFont.className} bg-fooBlue`}>
        <header>
          <Navbar />
        </header>
        <main className="px-10 py-10 justify-center flex md:px-20">{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
