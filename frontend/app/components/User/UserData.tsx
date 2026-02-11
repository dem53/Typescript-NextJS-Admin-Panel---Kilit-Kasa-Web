import userServices from "@/app/services/userServices";
import { IUser } from "@/app/types/userType";
import { useState, useEffect, useMemo } from "react"
import Pagination from "../general/Pagination";
import CreateUserForm from "./CreateUserForm";
import ConfirmBox from "../general/ConfirmBox";
import UpdateUserForm from "./UpdateUserForm";
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserShield,
  FaCrown,
  FaUserTie,
  FaUserCog,
  FaUser
} from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import { BiSolidUserCircle } from "react-icons/bi";

const UserData = () => {

  const [userData, setUserData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>("");

  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState<boolean>(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);


  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await userServices.getAllUser();
      if (response.success && Array.isArray(response.data)) {
        setUserData(response.data);
        setMessage("Kullanıcılar Başarıyla Getirildi!");
      } else {
        setError(response.error || response.message || 'Kullanıcılar getirilirken hata!');
      }
    } catch (error) {
      setError("Kullanıcılar getirilemedi! API Hatası!");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(userData)) {
      return [];
    }

    return userData.filter(user => {

      if (!user) return false;

      const matchesSearch =
        searchTerm === "" ||
        (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      return matchesSearch;

    });

  }, [userData, searchTerm]);


  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);


  const handleDeleteEdit = (id: string) => {
    setShowDeleteUserModal(true);
    setSelectedUserId(id)
  }

  const handleUpdateEdit = (user: IUser) => {
    setShowUpdateUserModal(true);
    setSelectedUser(user);
  }


  const handleDelete = async (): Promise<void> => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await userServices.deleteUser(selectedUserId as string);
      if (response.success) {
        setMessage("Kullanıcı başarıyla silindi!");
        setShowDeleteUserModal(false);
        fetchUserData();
      } else {
        setError(response.error || response.message || "Kullanıcı silinirken hata meydana geldi!");
      }
    } catch (error) {
      setError("Kullanıcı silinemedi! Lütfen tekrar deneyiniz!");
    } finally {
      setLoading(false);
    }
  }


  const userAdminText = (type: boolean) => {
    switch (type) {
      case true:
        return 'Evet';
      case false:
        return 'Hayır'
    }
  }

  const userRoleText = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Müşteri';
      case 'personel':
        return 'Personel';
      case 'manager':
        return 'Yönetici';
      case 'admin':
        return 'Admin'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FaCrown className="text-yellow-500" size={16} />;
      case 'manager':
        return <FaUserTie className="text-green-500" size={16} />;
      case 'personel':
        return <FaUserCog className="text-blue-500" size={16} />;
      case 'customer':
        return <FaUser className="text-gray-500" size={16} />;
      default:
        return <FaUser className="text-gray-500" size={16} />;
    }
  }


  return (

    <>
      <div className="bg-gray-50 min-h-screen">

        <div className="bg-white rounded-xl shadow-md p-3 mb-3">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <FaUsers className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
              <p className="text-gray-600 mt-1">Sistem kullanıcılarını görüntüleyin ve yönetin</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Master Admin</p>
                  <p className="text-xl font-bold text-red-900">
                    {userData.filter(u => u.role === 'admin').length} kişi
                  </p>
                </div>
                <FaCrown className="text-red-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Yönetici</p>
                  <p className="text-xl font-bold text-green-900">
                    {userData.filter(u => u.role === 'manager').length} kişi
                  </p>
                </div>
                <FaUserTie className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Personel</p>
                  <p className="text-xl font-bold text-blue-900">{userData.filter(u => u.role === 'personel').length} kişi</p>
                </div>
                <FaUsers className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Müşteriler</p>
                  <p className="text-xl font-bold text-purple-900">
                    {userData.filter(u => u.role === 'customer').length} kişi
                  </p>
                </div>
                <FaUser className="text-purple-500" size={24} />
              </div>
            </div>


          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-3">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Kullanıcı adı, e-posta veya ID'ye göre arama yap..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium text-sm">Sayfa başına:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border-2 border-gray-300 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-700 font-medium text-sm">kayıt</span>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateUserModal(true)}
              className="bg-gradient-to-r from-green-500 text-sm to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <FaUserPlus size={18} />
              Yeni Kullanıcı
            </button>
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
                      <BiSolidUserCircle size={16} />
                      ID
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUser size={14} />
                      Kullanıcı
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MdEmail size={16} />
                      E-Posta
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaUserShield size={14} />
                      Admin
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaUserCog size={14} />
                      Rol
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdDateRange size={16} />
                      Oluşturulma
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdDateRange size={16} />
                      Güncellenme
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdDateRange size={16} />
                      Son Giriş
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <h2 className="font-semibold text-gray-700 text-lg">Kullanıcı verileri yükleniyor...</h2>
                      </div>
                    </td>
                  </tr>
                ) :
                  paginatedUsers.length > 0 ?
                    paginatedUsers.map((user, index) => (
                      <tr
                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                        key={user._id}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-700 border border-gray-300">
                            {user._id.slice(5, 15)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MdEmail className="text-gray-400" size={16} />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-md ${user.isAdmin === true
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            }`}>
                            {user.isAdmin === true ? <FaUserShield size={12} /> : null}
                            {userAdminText(user.isAdmin)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold`}>
                            {userRoleText(user.role)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-xs text-gray-700 font-medium">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-xs text-gray-700 font-medium">
                            {formatDate(user.updatedAt)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-xs text-gray-700 font-medium">
                            {formatDate(user.endLoginTime)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleUpdateEdit(user)}
                              type="button"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                              <FaEdit size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteEdit(user._id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="text-center py-12 bg-gray-50" colSpan={9}>
                          <div className="flex flex-col items-center justify-center">
                            <FaUsers className="text-gray-300 mb-4" size={64} />
                            <h2 className="font-semibold text-gray-700 text-lg">Kullanıcı verisi bulunamadı!</h2>
                            <p className="text-gray-500 text-sm mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                          </div>
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </table>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <Pagination
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>



      {showCreateUserModal && (
        <CreateUserForm
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={fetchUserData}
        />
      )}


      {showDeleteUserModal && selectedUserId && (
        <ConfirmBox
          isOpen={showDeleteUserModal}
          onClose={() => setShowDeleteUserModal(false)}
          secondMessage="(Kullanıcı kalıcı olarak silinecektir!)"
          message={'Kullanıcıyı silmek istediğinize emin misiniz ?'}
          onSuccess={handleDelete}
        />
      )}


      {showUpdateUserModal && selectedUser && (
        <UpdateUserForm
          isOpen={showUpdateUserModal}
          onClose={() => setShowUpdateUserModal(false)}
          onSuccess={fetchUserData}
          id={selectedUser._id}
          userData={selectedUser}
        />
      )}



    </>
  )
}

export default UserData
