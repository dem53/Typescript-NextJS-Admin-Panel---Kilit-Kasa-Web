import Link from 'next/link'

const NavBar = () => {

    return (
        <ul className='hidden lg:flex items-center font-semibold bebas-neue text-sm  justify-center gap-8'>

            <li className='p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out '>
                <Link href={'/'}>
                    <h2>Anasayfa</h2>
                </Link>
            </li>

            <li className={`p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out`}>
                <Link href={'/'}>
                    <h2>Kurumsal</h2>
                </Link>
            </li>

            <li className='p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out'>
                <Link href={'/urunlerimiz'}>
                    <h2>Ürünler</h2>
                </Link>
            </li>

            <li className='p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out'>
                <Link href={'/'}>
                    <h2>Hizmetler</h2>
                </Link>
            </li>

            <li className='p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out'>
                <Link href={'/'}>
                    <h2>Referanslar</h2>
                </Link>
            </li>

            <li className='p-1 rounded-sm cursor-pointer hover:text-blue-700 hover:font-extrabold hover:underline-offset-2 hover:underline hover:duration-300 transition-all ease-in-out'>
                <Link href={'/'}>
                    <h2>İletişim</h2>
                </Link>
            </li>
        </ul>
    )
}

export default NavBar