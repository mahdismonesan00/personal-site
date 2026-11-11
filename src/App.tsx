import { useEffect } from "react";
import { I18nProvider } from "./lib/i18n";
import { StoreProvider, useStore } from "./lib/store";
import Background from "./components/Background";
import Nav from "./components/Nav";
import Hero, { Ticker } from "./components/Hero";
import Pulse from "./components/Pulse";
import Story from "./components/Story";
import Awards from "./components/Awards";
import Skills from "./components/Skills";
import RobotLab from "./components/RobotLab";
import QuizArena from "./components/QuizArena";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Favorites from "./components/Favorites";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import DetailModal from "./components/DetailModal";
import ChatBot from "./components/ChatBot";
import CommandPalette from "./components/CommandPalette";
import { Toasts } from "./components/ui";

function Shell() {
  const { route } = useStore();

  useEffect(() => {
    if (route === "dashboard") window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Background />
      <Nav />
      <main>
        {route === "site" ? (
          <>
            <Hero />
            <Ticker />
            <Pulse />
            <Story />
            <Awards />
            <Skills />
            <RobotLab />
            <Services />
            <Portfolio />
            <QuizArena />
            <Favorites />
            <Contact />
          </>
        ) : (
          <Dashboard />
        )}
      </main>
      <Footer />
      <DetailModal />
      <CommandPalette />
      <ChatBot />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </I18nProvider>
  );
}