"use client";

import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { useAuth } from '@/app/context/AuthContext';


const SearchAndCart = () => {

  const { user, auth, cartLength, logOutUser } = useAuth();


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
            <span className='absolute -right-1 -bottom-2 text-xs p-0.5 bg-blue-500/90 opacity-90 text-white rounded-xl px-1.5'>
              <h2>{cartLength}</h2>
            </span>
          </span>
        </div>
      </Link>
      {user && auth && (
        <div className='flex items-center justify-center'>
          <button
            type='button'
            onClick={logOutUser}
            className='text-xs font-bold cursor-pointer hover:text-red-600 duration-500 transition-all text-red-500'
          >
            Çıkış
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchAndCart