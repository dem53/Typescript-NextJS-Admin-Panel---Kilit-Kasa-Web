"use client";

import Image from 'next/image'

const HeaderLogo = () => {
  return (
    <>
      <div className='relative'>
        <a href='/'>
          <Image
            src={'/images/web-logo-as.png'}
            priority
            alt='web-logo'
            width={180}
            height={100}
            className='object-cover'
          />
        </a>
      </div>

    </>
  )
}

export default HeaderLogo