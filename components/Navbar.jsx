"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingCart, Package } from "lucide-react";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const cartCount = useSelector((state) => state.cart.total);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // Scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${search.trim()}`);
      setMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
          : "bg-gradient-to-r from-white via-green-50/30 to-white shadow-sm"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-4 sm:mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* Logo with enhanced animations */}
          <Link
            href="/"
            className="relative group text-3xl sm:text-4xl font-semibold"
            aria-label="Evoncart home"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative">
              <span className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Evon
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm">
                  Evon
                </span>
              </span>
              <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                cart
              </span>
              <span className="text-green-600 text-4xl sm:text-5xl group-hover:text-green-500 transition-colors">
                .
              </span>
            </div>

            {/* Plus Badge */}
            <Protect plan="plus">
              <span className="absolute text-xs font-semibold -top-1 -right-8 px-3 py-0.5 rounded-full flex items-center gap-2 text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
                plus
              </span>
            </Protect>
          </Link>

          {/* Mobile Right Section (User button + Hamburger) */}
          <div className="flex items-center gap-3 sm:hidden">
            {/* Mobile User Button */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="relative group px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                aria-label="Login to your account"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </button>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            {/* Hamburger Toggler */}
            <button
              className="text-slate-700 p-2 hover:bg-green-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link
              href="/"
              className="relative font-medium group transition-colors hover:text-slate-900"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/shop"
              className="relative font-medium group transition-colors hover:text-slate-900"
            >
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/"
              className="relative font-medium group transition-colors hover:text-slate-900"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/"
              className="relative font-medium group transition-colors hover:text-slate-900"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-gradient-to-r from-slate-100 to-green-50 px-4 py-2.5 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-green-500/20 transition-all group"
              role="search"
            >
              <Search
                size={18}
                className="text-slate-600 group-hover:text-green-600 group-focus-within:text-green-600 transition-colors"
                aria-hidden="true"
              />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600 focus:placeholder-slate-400 transition-colors"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && handleClearSearch()}
                aria-label="Search products"
              />
            </form>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600 group px-3 py-2 rounded-full hover:bg-green-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingCart
                  size={18}
                  className="group-hover:text-green-600 transition-colors"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="font-medium group-hover:text-green-600 transition-colors">
                Cart
              </span>
            </Link>

            {/* Desktop User Button / Login */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="relative group px-8 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl overflow-hidden transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Login to your account"
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
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl animate-in slide-in-from-top duration-300"
        >
          <div className="flex flex-col items-center gap-1 py-4 px-6">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Shop
            </Link>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              About
            </Link>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 w-full text-center text-slate-700 font-medium hover:bg-green-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Contact
            </Link>

            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full text-sm gap-2 bg-gradient-to-r from-slate-100 to-green-50 px-4 py-2.5 rounded-full border border-gray-200 mt-2 focus-within:ring-2 focus-within:ring-green-500/20 transition-all"
              role="search"
            >
              <Search
                size={18}
                className="text-slate-600 flex-shrink-0"
                aria-hidden="true"
              />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600 focus:placeholder-slate-400"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && handleClearSearch()}
                aria-label="Search products"
              />
            </form>

            {/* Mobile Cart */}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-slate-600 py-3 px-4 w-full justify-center hover:bg-green-50 rounded-xl transition-all mt-2 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={18} />
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
