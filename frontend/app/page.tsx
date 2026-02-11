import Header from "./components/Header/Header";
import HeroSection from "./components/Main/HeroSection";
import MainContent from "./components/Main/MainContent";


export default function Home() {

  return (
    <div className="flex flex-col">
      <div>
        <Header />
      </div>
      <div>
        <HeroSection />
      </div>

      <div className="bg-gray-100">
        <MainContent />
      </div>

    </div>
  );
}
