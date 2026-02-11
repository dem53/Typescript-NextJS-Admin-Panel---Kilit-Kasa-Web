import ProductCard from './ProductCard'

const MainContent = () => {
    return (
        <main className='flex flex-col mt-12 items-center container mx-auto justify-center gap-2 mb-10'>
            <div className='flex items-center justify-center text-center'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold font-sans border-b pb-2 text-black'>Ürünlerimiz</h2>
            </div>
            <div className='w-full mt-8'>
                <ProductCard />
            </div>

        </main>
    )
}

export default MainContent