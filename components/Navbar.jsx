'use client'
import { useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Search, ShoppingCart, PackageIcon } from "lucide-react"
import { useUser, useClerk, UserButton, Protect} from "@clerk/nextjs"

const Navbar = () => {
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const cartCount = useSelector((state) => state.cart.total)
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/shop?search=${search}`)
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-4 sm:mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* Logo */}
          <Link href="/" className="relative text-3xl sm:text-4xl font-semibold text-slate-700">
            <span className="text-green-600">Evon</span>cart
            <span className="text-green-600 text-4xl sm:text-5xl">.</span>
            <Protect plan = 'plus'>
              <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              plus
            </p>
            </Protect>
            
          </Link>

          {/* Mobile Right Section (User button + Hamburger) */}
          <div className="flex items-center gap-3 sm:hidden">
            {/* Mobile User Button */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 transition text-white text-sm rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            {/* Hamburger Toggler */}
            <button
              className="text-slate-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full"
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
            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 left-3 text-[10px] text-white bg-slate-700 size-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop User */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-md flex flex-col items-center gap-4 py-4 text-slate-700">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/" onClick={() => setMenuOpen(false)}>Contact</Link>

          {/* Search (mobile) */}
          <form
            onSubmit={handleSearch}
            className="flex items-center w-4/5 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
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
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-slate-600">
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
