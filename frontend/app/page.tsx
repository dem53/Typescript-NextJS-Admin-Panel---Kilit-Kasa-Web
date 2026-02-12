import Header from "./components/Header/Header";
import HeroSection from "./components/Main/HeroSection";
import MainContent from "./components/Main/MainContent";
import HizmetlerContent from "./hizmetlerimiz/HizmetlerContent";


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

      <div className="bg-zinc-50">
        <div className="w-full flex mt-12 items-center bg-zinc-50 justify-center">
          <h2 className="font-bold text-3xl underline underline-offset-4 mb-4">HİZMETLERİMİZ</h2>
        </div>
        <div>
          <HizmetlerContent />
        </div>

      </div>

    </div>
  );
}
