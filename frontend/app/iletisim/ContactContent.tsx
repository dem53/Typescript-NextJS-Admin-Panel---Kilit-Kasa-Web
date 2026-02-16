"use client";

import { ChangeEvent, useEffect, useState } from "react"
import { ICreateContact } from "../types/contactTypes";

const ContactContent = () => {

  const [createContact, setCreateContact] = useState<ICreateContact>({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<string>("");


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateContact((prev) => ({
      ...prev,
      [name]: value
    }))
  }



  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* CONTACT */}
      <div>

      </div>



      {/* FORM */}
      <div className="mt-4 mx-2 lg:mx-0">

        <div className="my-2">
          <h2 className="quicksand text-xl border-b pb-1 border-gray-300">Destek Talep Formu</h2>
        </div>
        <form className="w-full p-5 cursor-pointer bg-gray-100 gap-3 flex flex-col" action="post">

          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex items-start flex-1 flex-col justify-center gap-1">
              <label htmlFor="name">Adınız</label>
              <input
                type="text"
                name="name"
                id="name"
                className="border-2 p-2 w-full rounded-lg border-gray-300"
                value={createContact.name}
                onChange={handleChange}
                placeholder="Adınız"
                required
                title="Adınız"
              />
            </div>


            <div className="flex flex-1 flex-col items-start justify-center gap-1">
              <label htmlFor="lastname">Soyadınız</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="border-2 p-2 rounded-lg w-full border-gray-300"
                value={createContact.lastname}
                placeholder="Soy Adınız"
                onChange={handleChange}
                required
                title="Soyadınız"
              />
            </div>
          </div>



          <div className="flex items-center justify-center gap-2">
            <div className="flex items-start flex-col flex-1 justify-center gap-1">
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                name="email"
                id="email"
                className="border-2 p-2 rounded-lg w-full border-gray-300"
                value={createContact.email}
                onChange={handleChange}
                placeholder="E-Mail Adresiniz"
                required
                title="E-Mail Adresiniz"
              />
            </div>


            <div className="flex items-start flex-col flex-1 justify-center gap-1">
              <label htmlFor="phone">Telefon</label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="border-2 p-2 rounded-lg w-full border-gray-300"
                value={createContact.phone}
                onChange={handleChange}
                placeholder="Telefon Numaranız"
                required
                title="Telefon Numaranız"
              />
            </div>
          </div>



          <div className="flex items-start  flex-1 flex-col w-full justify-center gap-2">
            <label htmlFor="message">Mesaj</label>
            <input
              type="text"
              name="message"
              id="message"
              className="border-2 p-2 rounded-lg w-full pb-16 border-gray-300"
              value={createContact.message}
              onChange={handleChange}
              placeholder="Mesajınız"
              required
              title="Mesajınız"
            />
          </div>


          <div>
            <button
              type="submit"
              disabled={loading ||
                !createContact.name || !createContact.lastname || !createContact.phone || !createContact.email || !createContact.message
              }
              className="w-full py-2.5 px-4 cursor-pointer rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-80 text-white text-center bg-orange-600 font-sans font-semibold"
            >
              <h2>Destek Talebi Gönder</h2>
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default ContactContent