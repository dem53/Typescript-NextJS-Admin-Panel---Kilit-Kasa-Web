"use client";

import Link from 'next/link'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { useAuth } from '@/app/context/AuthContext';
import { RiAdminFill } from 'react-icons/ri';


const SearchAndCart = () => {

  const { user, auth, cartLength } = useAuth();


  return (
    <div className='flex items-center justify-center gap-2'>
      <div className='flex items-center justify-center'>
        <span className='p-1 border rounded-lg border-gray-300 bg-gray-100'>
          <IoSearch size={20} />
        </span>

      </div>
      <Link href={'/sepetim'}>
        <div className='flex relative items-center justify-center'>
          <span className='p-1 border  rounded-lg border-gray-300 bg-gray-100'>
            <FaShoppingCart size={20} />
            <span className='absolute -right-1 -bottom-2 text-xs font-bold  opacity-90 text-white rounded-xl '>
              <h2 className='bg-orange-500 rounded-full px-1'>{cartLength}</h2>
            </span>
          </span>
        </div>
      </Link>

      {user?.role === 'admin' && auth && (
        <Link href={'/admin/panel'}>
          <div className='flex relative items-center justify-center'>
            <span className='p-1 border  rounded-lg border-gray-300 bg-gray-100'>
              <RiAdminFill size={20} />
            </span>
          </div>
        </Link>
      )}

      {user?.role === 'manager' || user?.role === 'personel' && auth && (
        <Link href={'/admin/panel'}>
          <div className='flex relative items-center justify-center'>
            <span className='p-1 border  rounded-lg border-gray-300 bg-gray-100'>
              <FaUser size={20} />
            </span>
          </div>
        </Link>
      )}
    </div>
  )
}

export default SearchAndCart