'use client'

import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

export default function CreateStore() {

    const { user } = useUser()
    const router = useRouter()
    const { getToken } = useAuth()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: null
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    // fetch store status
    const fetchSellerStatus = async () => {
        const token = await getToken()
        try {
            const { data } = await axios.get('/api/store/create', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (['approved', 'rejected', 'pending'].includes(data.status)) {
                setStatus(data.status)
                setAlreadySubmitted(true)
                switch (data.status) {
                    case "approved":
                        setMessage("Your store has been approved, redirecting to dashboard...")
                        setTimeout(() => router.push("/store"), 5000)
                        break;
                    case "rejected":
                        setMessage("Your store request was rejected, contact admin for details.")
                        break;
                    case "pending":
                        setMessage("Your store request is pending. Please wait for admin approval.")
                        break;
                }
            } else {
                setAlreadySubmitted(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    // submit store
    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!user) return toast.error("Please login to continue")
        if (!storeInfo.image) return toast.error("Please upload a store logo")

        try {
            const token = await getToken()
            const formData = new FormData()
            Object.entries(storeInfo).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const { data } = await axios.post('/api/store/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            toast.success(data.message)
            await fetchSellerStatus()
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchSellerStatus()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                <h1 className="text-2xl sm:text-4xl font-semibold">
                    Please <span className="text-slate-500">Login</span> to Continue
                </h1>
            </div>
        )
    }

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={onSubmitHandler} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        <h1 className="text-3xl">
                            Add Your <span className="text-slate-800 font-medium">Store</span>
                        </h1>
                        <p className="max-w-lg">
                            To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.
                        </p>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image
                                src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                                className="rounded-lg mt-2 h-16 w-auto"
                                alt="store logo"
                                width={150}
                                height={100}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                                hidden
                            />
                        </label>

                        {["username", "name", "description", "email", "contact", "address"].map((field) => (
                            <div key={field} className="w-full max-w-lg flex flex-col">
                                <p className="capitalize">{field}</p>
                                {field === "description" || field === "address" ? (
                                    <textarea
                                        name={field}
                                        value={storeInfo[field]}
                                        onChange={onChangeHandler}
                                        rows={field === "description" ? 5 : 5}
                                        placeholder={`Enter your store ${field}`}
                                        className="border border-slate-300 outline-slate-400 w-full p-2 rounded resize-none"
                                    />
                                ) : (
                                    <input
                                        name={field}
                                        type={field === "email" ? "email" : "text"}
                                        value={storeInfo[field]}
                                        onChange={onChangeHandler}
                                        placeholder={`Enter your store ${field}`}
                                        className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
                                    />
                                )}
                            </div>
                        ))}

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition">
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && (
                        <p className="mt-5 text-slate-400">
                            Redirecting to dashboard in <span className="font-semibold">5 seconds</span>
                        </p>
                    )}
                </div>
            )}
        </>
    ) : (<Loading />)
}
