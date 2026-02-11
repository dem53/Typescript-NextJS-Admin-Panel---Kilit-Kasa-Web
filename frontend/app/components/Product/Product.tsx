"use client";

import { useEffect, useMemo, useState } from "react";
import CreateProductForm from "./CreateProductForm";
import { IProduct } from "@/app/types/productTypes";
import { productServices } from "@/app/services/productServices";
import { formatDate, getTurkishLira } from "@/app/utils/format";
import ConfirmBox from "../general/ConfirmBox";
import SoftDeletedProduct from "./SoftDeletedProduct";
import UpdateProductForm from "./UpdateProductForm";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaPalette,
  FaMoneyBillWave,
  FaWarehouse
} from "react-icons/fa";
import {
  MdRefresh,
  MdCategory,
  MdDateRange,
  MdInventory,
  MdShoppingCart
} from "react-icons/md";
import { BiSolidPackage } from "react-icons/bi";
import { BsCalendar3, BsTrash } from "react-icons/bs";

const Product = () => {

  const [productData, setProductData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>("");

  const [selectedProductId, setSelectedProductId] = useState<string | null>("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchSelling, setSearchSelling] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [showUpdateProductModal, setShowUpdateProductModal] = useState<boolean>(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);
  const [showSoftDeleteProductModal, setShowSoftDeleteProductModal] = useState<boolean>(false);
  const [showDeletedProductModal, setShowDeletedProductModal] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);


  const fetchProductData = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await productServices.getAllProduct();
      if (response.success && Array.isArray(response.data)) {
        setProductData(response.data);
        setMessage(response.message ? response.message : 'Ürünler başarıyla getirildi!');
        setTimeout(() => {
          setMessage("");
        }, 2000);

      } else {
        setError(response.error || response.message || 'Tüm ürünler getirilirken hata meydana geldi!');
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error: any) {
      setError('Tüm ürünler getirilirken hata meydana geldi!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, []);


  const getCategoryName = (name: string) => {
    switch (name) {
      case 'kapi':
        return 'Kapı';
      case 'kilit':
        return 'Kilit';
      case 'aksesuar':
        return 'Aksesuar';
      case 'kasa': 
        return 'Kasa';
      case 'elektronik-kilit':
        return 'Elektronik Kilit'
      case 'otel-elektronik-kilit':
        return 'Otel Elektronik Kilit'
      default:
        return '';
    }
  }

  const getCategoryColor = (name: string) => {
    switch (name) {
      case 'kapi':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'kilit':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'aksesuar':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  }


  const getProductSelling = (status: boolean) => {
    switch (status) {
      case false:
        return 'Satışta Değil';
      case true:
        return 'Satışta';
    }
  }

  const handleSoftDelete = (id: string) => {
    setShowSoftDeleteProductModal(true);
    setSelectedProductId(id);
  }

  const handleUpdateProduct = (data: IProduct) => {
    setShowUpdateProductModal(true);
    setSelectedProduct(data);
  }


  const softDeleteProduct = async (): Promise<void> => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await productServices.softDeleteProduct(selectedProductId as string);
      if (response.success) {

        setMessage(response.message ? response.message : 'Ürün sistemden geçici olarak kaldırıldı!');

        setTimeout(() => {
          setMessage("");
        }, 1000);

        setShowSoftDeleteProductModal(false);
        setSelectedProductId("");

        setTimeout(() => {
          fetchProductData();
        }, 2000);

      } else {
        setError(response.error || response.message || 'Ürün sistemden geçici olarak silinemedi!');
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error: any) {
      setError('Ürün sistemden geçici olarak kaldırılırken hata meydana geldi!' + error);
    } finally {
      setLoading(false);
    }
  }



  const filteredProduct = useMemo(() => {

    if (!Array.isArray(productData)) {
      return [];
    }

    return productData.filter((product) => {

      let matchesSearch = searchTerm === '' ||
        (product.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.price.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.category.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.color.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.stock.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product._id.toLowerCase() || '').includes(searchTerm.toLowerCase());


      let matchesSelling = searchSelling === '' || String(product.isSelling) === searchSelling;

      let productDate = new Date(product.createdAt).setHours(0, 0, 0, 0);

      let matchesDate =
        (!startDate || productDate >= new Date(startDate).setHours(0, 0, 0, 0)) &&
        (!endDate || productDate <= new Date(endDate).setHours(23, 59, 59, 999));

      return matchesSearch && matchesSelling && matchesDate;
    })


  }, [productData, searchTerm, searchSelling, startDate, endDate]);



  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        <div className="bg-white rounded-xl shadow-md p-3 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <BiSolidPackage className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Ürün Yönetimi</h1>
              <p className="text-gray-600 mt-1">Ürünleri görüntüleyin, ekleyin ve yönetin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Toplam Ürün</p>
                  <p className="text-xl font-bold text-blue-900">{productData.length} ürün</p>
                </div>
                <FaBoxOpen className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Satışta</p>
                  <p className="text-xl font-bold text-green-900">
                    {productData.filter(p => p.isSelling === true).length} ürün
                  </p>
                </div>
                <FaCheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Satışta Değil</p>
                  <p className="text-xl font-bold text-red-900">
                    {productData.filter(p => p.isSelling === false).length} ürün
                  </p>
                </div>
                <FaTimesCircle className="text-red-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Toplam Stok</p>
                  <p className="text-xl font-bold text-purple-900">
                    {productData.reduce((acc, p) => acc + p.stock, 0)} ürün
                  </p>
                </div>
                <FaWarehouse className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-md p-3 mb-6">
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setShowCreateProductModal(true)}
              className="bg-gradient-to-r from-green-500 text-sm to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <FaPlus size={16} />
              Ürün Ekle
            </button>

            <button
              type="button"
              onClick={() => setShowDeletedProductModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-sm hover:from-red-600 hover:to-red-700 text-white px-2 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <BsTrash size={16} />
              Silinenler
            </button>

            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-sm hover:from-blue-600 cursor-pointer hover:to-blue-700 text-white rounded-lg px-3 font-semibold "
            >
              {showFilter ? 'X' : 'Filtrele'}
            </button>
          </div>

          {showFilter && (
            <>
              <div className="mb-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="search"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    placeholder="Ürün ID, adı, kategorisi, rengi, stok sayısı veya fiyatına göre arama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MdShoppingCart size={16} />
                    Satış Durumu
                  </label>
                  <select
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    value={searchSelling}
                    onChange={(e) => setSearchSelling(e.target.value)}
                  >
                    <option value="">Tümü</option>
                    <option value="true">Satışta</option>
                    <option value="false">Satışta Değil</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BsCalendar3 size={14} />
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BsCalendar3 size={14} />
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    disabled={!startDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 opacity-0">Sıfırla</label>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setStartDate('');
                      setEndDate('');
                      setSearchSelling('');
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <MdRefresh size={20} />
                    Sıfırla
                  </button>
                </div>
              </div>
            </>
          )}


          {/* Result Count */}
          <div className="mt-4">
            {filteredProduct.length > 0 ? (
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
                <MdInventory className="text-blue-600" size={18} />
                <span className="text-blue-700 font-semibold text-sm">
                  {filteredProduct.length} ürün bulundu
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg border border-red-200">
                <FaTimesCircle className="text-red-600" size={16} />
                <span className="text-red-700 font-semibold text-sm">
                  Ürün bulunamadı!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <BiSolidPackage size={16} />
                      Ürün
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaBoxOpen size={14} />
                      Adı
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdCategory size={16} />
                      Kategori
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaMoneyBillWave size={14} />
                      Fiyat
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdShoppingCart size={16} />
                      Satış Durumu
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaWarehouse size={14} />
                      Stok
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaPalette size={14} />
                      Renk
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdDateRange size={16} />
                      Oluş / Güncel
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td className="text-center py-12 bg-gray-50" colSpan={9}>
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <h2 className="font-semibold text-gray-700 text-lg">Ürünler yükleniyor...</h2>
                      </div>
                    </td>
                  </tr>
                ) : filteredProduct.length > 0 ? (
                  filteredProduct.map((product) => (
                    <tr
                      className="hover:bg-purple-50 transition-colors duration-150"
                      key={product._id}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={`${product.imageUrls[0]}`}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-md border-2 border-gray-200"
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-900 text-sm">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-500 italic">
                            {product.description}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${getCategoryColor(product.category)}`}>
                          {getCategoryName(product.category)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-900 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          {getTurkishLira(product.price)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${product.isSelling === true
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                          }`}>
                          {product.isSelling === true ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
                          {getProductSelling(product.isSelling)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${product.stock > 10
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                          {product.stock} adet
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300">
                          {product.color}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-gray-600 font-medium">
                            {formatDate(product.createdAt as string)}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {formatDate(product.updatedAt as string)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleUpdateProduct(product)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Güncelle"
                          >
                            <FaEdit size={16} />
                          </button>

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleSoftDelete(product._id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sil"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-12 bg-gray-50" colSpan={9}>
                      <div className="flex flex-col items-center justify-center">
                        <FaBoxOpen className="text-gray-300 mb-4" size={64} />
                        <h2 className="font-semibold text-gray-700 text-lg">Mevcut ürün bulunamadı!</h2>
                        <p className="text-gray-500 text-sm mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <FaCheckCircle size={24} />
              <h2 className="font-bold text-base">{message}</h2>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <FaTimesCircle size={24} />
              <h2 className="font-bold text-base">{error}</h2>
            </div>
          </div>
        )}

      </div>

      {showCreateProductModal && (
        <CreateProductForm
          isOpen={showCreateProductModal}
          onClose={() => setShowCreateProductModal(false)}
          onSuccess={() => console.log("Ürün eklendi!")}
        />
      )}


      {showSoftDeleteProductModal && selectedProductId && (
        <ConfirmBox
          isOpen={showSoftDeleteProductModal}
          onClose={() => setShowSoftDeleteProductModal(false)}
          message={`Ürünü geçici olarak sistemden kaldırmak istediğinize emin misiniz ?`}
          onSuccess={softDeleteProduct}
        />
      )}

      {showDeletedProductModal && (
        <SoftDeletedProduct
          isOpen={showDeletedProductModal}
          onClose={() => setShowDeletedProductModal(false)}
          onSuccess={fetchProductData}
        />
      )}


      {showUpdateProductModal && selectedProduct && (
        <UpdateProductForm
          isOpen={showUpdateProductModal}
          onClose={() => setShowUpdateProductModal(false)}
          onSuccess={fetchProductData}
          data={selectedProduct}
          id={selectedProduct._id}
        />
      )}

    </>
  )
}

export default Product
