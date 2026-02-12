import { PageHeader } from "../components/general/PageHeader"
import Header from "../components/Header/Header"
import { GiAutoRepair } from "react-icons/gi"
import HizmetlerContent from "./HizmetlerContent"


const HizmetlerimizPage = () => {
    return (
        <div className="min-h-screen bg-zinc-50">
            <div>
                <Header />
            </div>

            <div className="mt-7 w-full">
                <PageHeader
                    title='Hizmetlerimiz'
                    subTitle='Kartlı kilit, mekanik kilit, çelik kasa tamiratı, montajı, bakımı yapılır.'
                    icon={<GiAutoRepair size={300} className='text-blue-200' />}
                    backGroundColor='bg-linear-to-r from-yellow-700 to-amber-900'
                    titleColor='text-white font-bold'
                    subTitleColor='text-blue-100 italic'
                />
            </div>
            
            <div className="w-full xl:container mx-auto">
                <HizmetlerContent />
            </div>
        </div>
    )
}

export default HizmetlerimizPage