"use client";

import { useEffect, useMemo, useState } from "react";
import CreateContactForm from "./CreateContactForm";
import { IContact } from "@/app/types/contactTypes";
import { contactServices } from "@/app/services/contactServices";
import { formatDate } from "@/app/utils/format";
import Pagination from "../general/Pagination";
import UpdateContactForm from "./UpdateContactForm";
import ConfirmBox from "../general/ConfirmBox";

const Contact = () => {

    const [contactData, setContactData] = useState<IContact[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false);
    const [showUpdateContactModal, setShowUpdateContactModal] = useState<boolean>(false);
    const [showDeleteContactModal, setShowDeleteContactModal] = useState<boolean>(false);

    const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    useEffect(() => {
        fetchContactData();
    }, []);

    const fetchContactData = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await contactServices.getAllContact();
            if (response && response.success && Array.isArray(response.data)) {
                setContactData(response.data);
                setMessage("İletişim form kayıtları başarıyla getirildi!");
            } else {
                setError(response.message || response.error || 'İletişim form kayıtları getirilirken hata meydana geldi!');
            }
        } catch (error) {
            setError('İletişim form kayıtları getirilemedi! Lütfen tekrar deneyiniz!');
        } finally {
            setLoading(false);
        }
    }


    const getStatusContact = (status: boolean) => {
        switch (status) {
            case false:
                return <span className="border p-2 rounded-lg border-yellow-500 bg-yellow-50 text-lg">🟡</span>;
            case true:
                return <span className="border p-2 rounded-lg border-emerald-500 bg-emerald-50 text-lg">✅</span>;
            default:
                return <span>-</span>
        }
    }


    const filteredContact = useMemo(() => {
        if (!Array.isArray(contactData)) {
            return [];
        }

        return contactData.filter(contact => {
            if (!contact) return false;

            const matchesSearch =
                searchTerm === '' ||
                (contact._id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (contact.lastname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (contact.phone?.toLowerCase()).includes(searchTerm.toLowerCase())

            return matchesSearch;
        })

    }, [contactData, searchTerm]);


    const paginatedContact = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredContact.slice(startIndex, endIndex);
    }, [filteredContact, currentPage, itemsPerPage]);


    const handleEditContact = (data: IContact) => {
        setShowUpdateContactModal(true);
        setSelectedContact(data);
    }


    const handleDeleteContact = (id: string) => {
        setShowDeleteContactModal(true);
        setSelectedContactId(id);
    }


    const handleDelete = async (): Promise<void> => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await contactServices.deleteContact(selectedContactId as string);
            if (response.success) {
                setMessage("İletişim form kaydı başarıyla silindi!");
                setShowDeleteContactModal(false);
                setSelectedContactId(null);
                fetchContactData();
            } else {
                setError(response.message || response.error || 'İletişim form kaydı silinirken hata!');
            }
        } catch (error) {
            setError("İletişim form kaydı silinirken hata meydana geldi! Lütfen tekrar deneyiniz!");
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div>
                <button
                    type="button"
                    className="px-2 py-2 bg-emerald-500 text-center text-white text-sm cursor-pointer rounded-lg"
                    onClick={() => setShowAddContactModal(true)}
                >
                    Form Oluştur
                </button>

                <input
                    type="search"
                    className="p-2 rounded-lg w-full border-2 border-gray-300 mt-2"
                    placeholder="ID, Ad-Soyad, Email veya Telefona göre arama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex items-center text-sm mt-4 gap-2 mb-4">
                    <span>Sayfa başına:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="border p-1 rounded"
                    >
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>

                    <span>iletişim</span>
                </div>

                <div className="overflow-x-auto mt-3 rounded-lg">
                    <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                        <thead className="py-2 bg-gray-500 text-white rounded-lg">
                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                ID
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                AD SOYAD
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                E-MAİL
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                TELEFON
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                MESAJ
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                DURUM
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                OLUŞTURULMA
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                GÜNCELLENME
                            </th>

                            <th className="px-4 py-2 whitespace-nowrap font-sans font-bold text-center">
                                İŞLEMLER
                            </th>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className="py-8 text-center bg-gray-200" colSpan={9}>
                                        <h2>Veriler Yükleniyor...</h2>
                                    </td>
                                </tr>
                            ) : paginatedContact.length > 0 ? (
                                paginatedContact.map((contact) => (
                                    <tr className={`${contact.status === true ? 'bg-emerald-50' : contact.status === false ? 'bg-yellow-50' : 'bg-gray-50'} border-b text-sm cursor-pointer border-gray-400`} key={contact._id}>
                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {contact._id.slice(5, 15)}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {contact.name} {contact.lastname}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {contact.email}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {contact.phone}
                                        </td>

                                        <td className="line-clamp-1 mb-4 px-4 py-4 max-w-72 text-center">
                                            {contact.message}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {getStatusContact(contact.status)}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {formatDate(contact.createdAt)}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap font-sans font-semibold text-center">
                                            {formatDate(contact.updatedAt)}
                                        </td>

                                        <td className="flex items-center  justify-center gap-3 max-w-60 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleEditContact(contact)}
                                            >
                                                G
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteContact(contact._id)}
                                            >
                                                S
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedContact.length === 0 && (
                                <tr>
                                    <td className="py-8 bg-gray-200 text-center" colSpan={9}>
                                        <h2>İletişim formları bulunamadı!</h2>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                    <Pagination
                        totalItems={filteredContact.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />

                </div>
            </div>


            {showAddContactModal && (
                <CreateContactForm
                    isOpen={showAddContactModal}
                    onClose={() => setShowAddContactModal(false)}
                    onSuccess={() => console.log("Eklendi ve fonk çağrıldı!")}
                />
            )}


            {showUpdateContactModal && selectedContact && (
                <UpdateContactForm
                    isOpen={showUpdateContactModal}
                    onClose={() => setShowUpdateContactModal(false)}
                    onSuccess={fetchContactData}
                    data={selectedContact}
                    id={selectedContact._id}
                />
            )}


            {showDeleteContactModal && (
                <ConfirmBox
                    isOpen={showDeleteContactModal}
                    onClose={() => setShowDeleteContactModal(false)}
                    message="İletişim form kaydını silmek istediğinize emin misiniz ?"
                    onSuccess={handleDelete}
                />
            )}

        </>
    )
}

export default Contact