"use client";

import { GiAutoRepair } from "react-icons/gi";
import { IconType } from "react-icons";

type HizmetBoxProps = {
  backGround?: string;
  icon: IconType;
  title: string;
  description: string;
  imageUrl: string;
};

const HizmetBox = ({
  backGround = "bg-white",
  icon: Icon,
  title,
  description,
  imageUrl,
}: HizmetBoxProps) => {
  return (
    <div
      className={`${backGround} group relative cursor-pointer flex flex-col rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
    >
      <div className="w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-">
          <div className="p-2 bg-zinc-100 rounded-lg text-primary">
            <Icon size={28} />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {title}
          </h3>
        </div>

        <p className="text-sm border-t pt-2 raleway border-t-gray-300 text-justify text-gray-600 leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export const HizmetlerContent = ({ title }: any) => {
  const hizmetler = [
    {
      title: "Parmak İzi / Şifreli Kilit Sistemleri",
      description:
        "Akıllı kilit teknolojisi ile parmak izi, şifre veya mobil uygulama üzerinden kapınızı güvenle kontrol edebilirsiniz. Kablosuz ve pilli yapısı sayesinde kolay montaj imkanı sunar.",
    },
    {
      title: "Otel Kartlı Kilit Sistemleri",
      description:
        "Oteller için özel olarak tasarlanmış kartlı geçiş sistemleri ile güvenli ve pratik oda erişimi sağlar. Merkezi yazılım ile tüm odalar kontrol edilebilir.",
    },
    {
      title: "Özel / Çelik Kasa Sistemleri",
      description:
        "Yüksek güvenlikli çelik kasa çözümleri ile değerli eşyalarınızı maksimum koruma altında tutabilirsiniz. Mekanik ve dijital kasa seçenekleri mevcuttur.",
    },
    {
      title: "Geçiş Kontrol Sistemleri",
      description:
        "Kartlı, biyometrik veya şifreli geçiş sistemleri ile işletmenizde kontrollü giriş-çıkış sağlayın. Personel takibi ve raporlama özellikleri sunar.",
    },
    {
      title: "Yüksek Güvenlikli Kilit Sistemleri",
      description:
        "Anti-kırılma, anti-maymuncuk ve anti-delme özelliklerine sahip kilit sistemleri ile maksimum güvenlik sağlar. Konut ve ticari alanlara uygundur.",
    },
    {
      title: "Kilit Montajı ve Teknik Servis",
      description:
        "Her marka mekanik ve elektronik kilit montajı profesyonel ekip tarafından yapılır. Arıza, bakım ve teknik destek hizmeti sunulmaktadır.",
    },
  ];

  return (
    <section className="w-full px-4 md:px-8 bg-zinc-50">
      <div className="max-w-7xl  mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-600 font-extrabold w-full text-xl lg:text-2xl mt-4  mx-auto">
            Güvenlik ve kilit sistemleri alanında modern, güvenilir ve
            profesyonel çözümler sunuyoruz.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hizmetler.map((hizmet, index) => (
            <HizmetBox
              key={index}
              title={hizmet.title}
              description={hizmet.description}
              icon={GiAutoRepair}
              imageUrl="/images/web-logo.png"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HizmetlerContent;
