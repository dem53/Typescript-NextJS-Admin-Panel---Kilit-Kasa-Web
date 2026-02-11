import React, { JSX, useEffect, useMemo, useState } from 'react'
import CreateJobForm from './CreateJobForm';
import { IJob } from '@/app/types/jobTypes';
import { jobServices } from '@/app/services/jobServices';
import { formatDate } from '@/app/utils/format';
import UpdateJobForm from './UpdateJobForm';
import userServices from '@/app/services/userServices';
import { IUserRole } from '@/app/types/userType';
import ConfirmBox from '../general/ConfirmBox';
import {
  FaCheck,
  FaShippingFast,
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserTie,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import {
  MdCancel,
  MdPending,
  MdWork,
  MdDateRange,
  MdPayment,
  MdLocationOn
} from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import { BsCalendar3, BsCash } from 'react-icons/bs';
import { BiSolidBriefcase } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';

const JobData = () => {

  const [jobData, setJobData] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<string>('');


  const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
  const [showUpdateJobModal, setShowUpdateJobModal] = useState<boolean>(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState<boolean>(false);

  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [selectedJobID, setSelectedJobID] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [user, setUser] = useState<{ role: IUserRole; username: string; firstName: string; } | null>(null);


  const fetchJobData = async () => {
    setLoading(true);
    setMessage("");
    setError(null);
    try {
      const response = await jobServices.getAllJob();
      if (response.success && Array.isArray(response.data)) {
        setJobData(response.data);
        setMessage(response.message ? response.message : 'Tüm iş kayıtları başarıyla getirildi!');
      } else {
        setError(response.error || response.message || 'Tüm iş kayıtları getirilirken hata!');
      }
    } catch (error: any) {
      setError('Tüm iş veri kayıtları getirilirken hata meydana geldi!' + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchJobData();

    const interval = setInterval(() => {
      fetchJobData();
    }, 30000);

    return () => clearInterval(interval);

  }, []);


  const handleJobEdit = (data: IJob) => {
    setShowUpdateJobModal(true);
    setSelectedJob(data);
    setSelectedJobID(data._id);
  }


  useEffect(() => {

    const checkAuth = async () => {

      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Token bulunamadı!');
        return false;
      }

      setLoading(true);

      try {
        const response = await userServices.getMe();
        if (!response || !response.success) {
          setError(response.message ? response.message : 'Hata kullanıcı verileri çekilemedi!');
          setLoading(false);
          return false;
        }

        if (response && response.data) {
          setMessage('Kullancı verileri başarıyla çekildi!');
          const data = response.data;
          setUser(data);
        }

      } catch (error: any) {
        setError('Kullanıcı verileri çekilirken hata!' + error.message);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);


  const getJobStatusText: Record<string, JSX.Element> = {
    pending: <MdPending className='text-yellow-500' size={25} />,
    cancelled: <MdCancel className='text-red-700' size={25} />,
    failed: <FcCancel className='text-red-500' size={25} />,
    success: <FaCheck className='text-emerald-500' size={20} />,
    ready: <FaShippingFast className='text-blue-500' size={20} />
  }

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'failed':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
      case 'ready':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  const getJobStatusTextLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Başarılı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      case 'cancelled':
        return 'İptal';
      case 'ready':
        return 'Yolda';
      default:
        return status;
    }
  }


  const getJobPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İade Edildi';
      case 'failed':
        return 'Başarısız';
      case 'success':
        return 'Başarılı';
    }
  }



  const handleJobDelete = (id: string) => {
    setShowDeleteJobModal(true);
    setSelectedJobID(id);
  }


  const handleDeleteJob = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const response = await jobServices.deleteJob(selectedJobID as string);
      if (response && response.success) {
        setMessage(response.message ? response.message : 'Seçilen iş verisi başarıyla silindi!');
        fetchJobData();
      } else {
        setError(response.error || response.message || 'Seçilen iş verisi silinemedi!');
      }
    } catch (error: any) {
      setError('Seçilen iş verisi silinirken hata meydana geldi!' + error.message);
    } finally {
      setLoading(false);
    }
  }


  const filteredJobs = useMemo(() => {

    if (!Array.isArray(jobData)) {
      return [];
    }

    return jobData.filter((job) => {

      if (!job) {
        return false;
      }

      let matchesSearch = searchTerm === '' ||
        (job._id.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.address.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.customer.fullName.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.customer.phone.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.customer.phone2.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.price.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.updatedBy?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const jobDate = new Date(job.createdAt).setHours(0, 0, 0, 0);

      let matchesDate =
        (!startDate || jobDate >= new Date(startDate).setHours(0, 0, 0, 0)) &&
        (!endDate || jobDate <= new Date(endDate).setHours(23, 59, 59, 999));

      return matchesSearch && matchesDate;
    })

  }, [jobData, searchTerm, startDate, endDate]);


  useEffect(() => {

    if (!startDate) {
      setEndDate('');
      return;
    }

    if (endDate && endDate < startDate) {
      setEndDate(startDate);
      return;
    }

  }, [startDate, endDate])


  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BiSolidBriefcase className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">İş Yönetimi</h1>
              <p className="text-gray-600 mt-1">İş kayıtlarını görüntüleyin ve yönetin</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Toplam İş</p>
                  <p className="text-xl font-bold text-blue-900">{jobData.length} adet</p>
                </div>
                <FaBriefcase className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Başarılı</p>
                  <p className="text-xl font-bold text-green-900">
                    {jobData.filter(j => j.jobStatus === 'success').length} adet
                  </p>
                </div>
                <FaCheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Bekleyen</p>
                  <p className="text-xl font-bold text-yellow-900">
                    {jobData.filter(j => j.jobStatus === 'pending').length} adet
                  </p>
                </div>
                <MdPending className="text-yellow-500" size={24} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700 font-medium">Yolda</p>
                  <p className="text-xl font-bold text-indigo-900">
                    {jobData.filter(j => j.jobStatus === 'ready').length} adet
                  </p>
                </div>
                <FaShippingFast className="text-indigo-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-4">
          {/* Add Job Button */}
          {user?.role === 'admin' && (
            <div className="mb-6">
              <button
                type='button'
                onClick={() => setShowCreateJobModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <FaPlus size={16} />
                Yeni İş Ekle
              </button>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type='search'
                name='searchTerm'
                id='searchTerm'
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                placeholder='ID, İş adı, iş adresi, irtibat(isim,telefon), tutara ve işi yapan kişiye göre arama...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                title='Genel arama'
              />
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BsCalendar3 size={14} />
                Başlangıç Tarihi
              </label>
              <input
                type='date'
                id='startDate'
                name='startDate'
                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title='Başlangıç Tarihi'
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BsCalendar3 size={14} />
                Bitiş Tarihi
              </label>
              <input
                type='date'
                id='endDate'
                name='endDate'
                disabled={!startDate}
                min={startDate}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                title='Bitiş Tarihi'
              />
            </div>
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
                      <BiSolidBriefcase size={16} />
                      ID
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MdWork size={16} />
                      İş
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MdLocationOn size={16} />
                      Adres
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaPhoneAlt size={14} />
                      İrtibat
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaMoneyBillWave size={14} />
                      Tutar
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
                      <FaUserTie size={14} />
                      İşi Yapan
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle size={14} />
                      Sonuç
                    </div>
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <MdPayment size={16} />
                      Ödeme
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
                    <td className="text-center py-12 bg-gray-50" colSpan={11}>
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <h2 className="font-semibold text-gray-700 text-lg">İş form verileri yükleniyor...</h2>
                      </div>
                    </td>
                  </tr>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className={`hover:bg-gray-100 cursor-pointer ${job.jobStatus === 'pending' ? 'bg-yellow-100 animate-pulse' : 
                        job.jobStatus === 'success' ? 'bg-emerald-100' : 
                        job.jobStatus === 'ready' ? 'bg-blue-200' :
                        job.jobStatus === 'cancelled' ? 'bg-orange-200' :
                        job.jobStatus === 'failed' ? 'bg-red-200' :
                        'bg-gray-100'} transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 border border-gray-300 font-bold">
                          {job.jobNumber}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{job.name}</span>
                        </div>
                      </td>

                      <td className="px-6 min-w-72 py-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" size={14} />
                          <span className="text-sm text-gray-700">{job.address}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-900">
                            <FaUser className="text-indigo-500" size={12} />
                            {job.customer.fullName}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                            <FaPhoneAlt className="text-green-500" size={10} />
                            {job.customer.phone}
                          </div>
                          {job.customer.phone2 && (
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                              <FaPhoneAlt className="text-green-500" size={10} />
                              {job.customer.phone2}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 bg-green-500 px-3 py-1.5 rounded-lg text-white font-bold text-sm shadow-md">
                          {job.price.toFixed(2)} ₺
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-xs text-gray-600 font-medium">
                          {formatDate(job.createdAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-xs text-gray-600 font-medium">
                          {formatDate(job.updatedAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                          <FaUserTie size={12} />
                          {job.updatedBy ? job.updatedBy : 'Yok'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${getJobStatusBadge(job.jobStatus)}`}>
                          {getJobStatusTextLabel(job.jobStatus)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${job.jobPaymentType === 'cash'
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            }`}>
                            {job.jobPaymentType === 'cash' ? 'Nakit' : 'Banka/Kredi'}
                          </span>
                          <span className="text-xs text-gray-600  font-medium">
                            {getJobPaymentStatusText(job.jobPaymentStatus)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type='button'
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={() => { handleJobEdit(job) }}
                          >
                            <FaEdit size={14} />
                          </button>

                          <button
                            type='button'
                            disabled={loading}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={() => { handleJobDelete(job._id) }}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-12 bg-gray-50" colSpan={11}>
                      <div className="flex flex-col items-center justify-center">
                        <FaBriefcase className="text-gray-300 mb-4" size={64} />
                        <h2 className="font-semibold text-gray-700 text-lg">İş form verisi bulunamadı!</h2>
                        <p className="text-gray-500 text-sm mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>


      {showCreateJobModal && (
        <CreateJobForm
          isOpen={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onSuccess={fetchJobData}
        />
      )}


      {showUpdateJobModal && selectedJob && selectedJobID && (
        <UpdateJobForm
          isOpen={showUpdateJobModal}
          onClose={() => setShowUpdateJobModal(false)}
          onSuccess={fetchJobData}
          data={selectedJob}
          id={selectedJobID}
        />
      )}


      {showDeleteJobModal && selectedJobID && (
        <ConfirmBox
          isOpen={showDeleteJobModal}
          onClose={() => setShowDeleteJobModal(false)}
          onSuccess={handleDeleteJob}
          message='Seçilen iş verisini silmek istediğinize emin misiniz ?'
        />
      )}

    </>
  )
}

export default JobData
