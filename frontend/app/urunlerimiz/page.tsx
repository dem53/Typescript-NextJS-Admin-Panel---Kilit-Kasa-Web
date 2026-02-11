import Header from '../components/Header/Header'
import { PageHeader } from '../components/general/PageHeader'
import { FiPackage } from 'react-icons/fi'
import AllProductContent from './AllProductContent'
import { FaLock } from 'react-icons/fa'

const UrunlerPage = () => {

    return (
        <div className='min-h-screen flex flex-col w-full'>
            <div>
                <Header />
            </div>
            <div className='mt-7 w-full'>
                <PageHeader
                    title='Tüm Ürünler'
                    subTitle='Kartlı kilit sistemleri, çelik kasalar vb ürünlerimizle hizmetinizdeyiz.'
                    icon={<FaLock size={100} className='text-blue-200' />}
                    backGroundColor='bg-linear-to-r from-blue-300 to-blue-950'
                    titleColor='text-white font-bold'
                    subTitleColor='text-blue-100 italic'
                />
            </div>

            <section className='w-full xl:container mx-auto'>
                <div className='flex flex-1'>
                    <AllProductContent />
                </div>
            </section>
           
        </div>
    )
}

export default UrunlerPage