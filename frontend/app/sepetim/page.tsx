import { FaShoppingCart } from 'react-icons/fa'
import { PageHeader } from '../components/general/PageHeader'
import Header from '../components/Header/Header'

const SepetimPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div>
        <Header />
      </div>

      <div>
        <PageHeader
          title="Sepetim"
          backGroundColor='bg-linear-to-r from-blue-300 to-blue-950'
          titleColor='text-white font-bold'
          subTitleColor='text-blue-100 italic'
          subTitle='Sepetiniz ve sipariş özetiniz'
         icon={<FaShoppingCart size={100} className='text-blue-200' />}
        />
      </div>
    </div>
  )
}

export default SepetimPage  