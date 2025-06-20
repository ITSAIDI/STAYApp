import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import SideBar from "@/app/sideBar";


config.autoAddCss = false;

export const metadata = {
  title: "STAY project application",
  description: "L’application s’intègre dans le cadre du projet STAY (Savoirs Techniques pour l'Autosuffisance) et a pour objectif d’explorer et d’analyser les données issues de la plateforme YouTube (vidéos et chaînes) sur le phénomène d’autosuffisance.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-row p-2 gap-3">
        <SideBar />
        <div className="flex-grow bg-gray-200 rounded-lg">
          {children}
        </div>
  
      </body>
    </html>
  )
}
