import Header from '../components/Header/Header'
import { PageHeader } from '../components/general/PageHeader'
import { MdOutlineConnectWithoutContact } from 'react-icons/md'
import ContactContent from './ContactContent'

const IletisimPage = () => {
    return (
        <div className='min-h-screen flex flex-col'>
            <div>
                <Header />
            </div>

            <div className="mt-7 w-full">
                <PageHeader
                    title='İletişim'
                    subTitle='İletim adreslerimizden veya destek iletişim formundan bize ulaşabilirsiniz.'
                    icon={<MdOutlineConnectWithoutContact size={300} className='text-blue-200' />}
                    backGroundColor='bg-linear-to-r from-yellow-700 to-amber-900'
                    titleColor='text-white font-bold'
                    subTitleColor='text-blue-100 italic'
                />
            </div>

            <div className='w-full xl:container mx-auto '>
                <ContactContent />
            </div>
        </div>
    )
}

export default IletisimPage