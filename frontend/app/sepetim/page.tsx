import { FaShoppingCart } from 'react-icons/fa'
import { PageHeader } from '../components/general/PageHeader'
import Header from '../components/Header/Header'
import CartContent from './CartContent'

const SepetimPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div>
        <Header />
      </div>

      <div className='mt-7'>
        <PageHeader
          title="Sepetim"
          backGroundColor='bg-linear-to-r from-yellow-700 to-amber-900'
          titleColor='text-white font-bold'
          subTitleColor='text-blue-100 italic'
          subTitle='Sepetiniz ve sipariş özetiniz'
         icon={<FaShoppingCart size={300} className='text-blue-200' />}
        />
      </div>

      <div className='w-full xl:container mx-auto'>
          <div>
            <CartContent />
          </div>
      </div>
    </div>
  )
}

export default SepetimPage  