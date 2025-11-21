'use client'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Search, ShoppingCart, Package } from "lucide-react"
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"

const Navbar = () => {
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const cartCount = useSelector((state) => state.cart.total)
  const { user } = useUser()
  const { openSignIn } = useClerk()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/shop?search=${search}`)
    setMenuOpen(false)
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
        : 'bg-gradient-to-r from-white via-green-50/30 to-white shadow-sm'
    }`}>
      <div className="mx-4 sm:mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* Logo with light animation on hover */}
          <Link href="/" className="relative group text-3xl sm:text-4xl font-semibold">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative">
              <span className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Evon
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm">
                  Evon
                </span>
              </span>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">cart</span>
              <span className="text-green-600 text-4xl sm:text-5xl group-hover:text-green-500 transition-colors">.</span>
            </div>
          </Link>

          {/* Mobile Right Section (User button + Hamburger) */}
	@@ -42,17 +59,18 @@ const Navbar = () => {
            {!user ? (
              <button
                onClick={openSignIn}
                className="relative group px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-full overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            {/* Hamburger Toggler */}
            <button
              className="text-slate-700 p-2 hover:bg-green-100 rounded-full transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
	@@ -61,17 +79,29 @@ const Navbar = () => {

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/" className="relative font-medium group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop" className="relative font-medium group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/" className="relative font-medium group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/" className="relative font-medium group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-gradient-to-r from-slate-100 to-green-50 px-4 py-2.5 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
            >
              <Search size={18} className="text-slate-600 group-hover:text-green-600 transition-colors" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
	@@ -83,29 +113,33 @@ const Navbar = () => {
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 group px-3 py-2 rounded-full hover:bg-green-50 transition-all">
              <div className="relative">
                <ShoppingCart size={18} className="group-hover:text-green-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 size-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-medium group-hover:text-green-600 transition-colors">Cart</span>
            </Link>

            {/* Desktop User */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="relative group px-8 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            ) : (
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<Package size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
	@@ -118,37 +152,47 @@ const Navbar = () => {

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
          <div className="flex flex-col items-center gap-1 py-4 px-6">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all">
              Home
            </Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all">
              Shop
            </Link>
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all">
              About
            </Link>
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all">
              Contact
            </Link>

            {/* Search (mobile) */}
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full text-sm gap-2 bg-gradient-to-r from-slate-100 to-green-50 px-4 py-2 rounded-full border border-gray-200 mt-2"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            {/* Cart */}
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-slate-600 py-3 px-4 w-full justify-center hover:bg-green-50 rounded-xl transition-all mt-2 font-medium">
              <ShoppingCart size={18} />
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
