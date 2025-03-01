"use client"

import { useState } from "react"
import { Search, Camera, User, Menu, X, Heart, Bookmark } from "lucide-react"

const Navbar = ({ onSearch, searchValue, setSearchValue }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Camera className="h-8 w-8 text-sky-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">image-Hub</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-sky-500 px-3 py-2 rounded-md text-sm font-medium">
              Explore
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 px-3 py-2 rounded-md text-sm font-medium">
              Collections
            </a>
            <a href="#" className="text-gray-600 hover:text-sky-500 px-3 py-2 rounded-md text-sm font-medium">
              Upload
            </a>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bookmark className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-sky-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-gray-600 hover:bg-gray-100 hover:text-sky-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Explore
          </a>
          <a
            href="#"
            className="text-gray-600 hover:bg-gray-100 hover:text-sky-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Collections
          </a>
          <a
            href="#"
            className="text-gray-600 hover:bg-gray-100 hover:text-sky-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Upload
          </a>
          <div className="flex items-center justify-between px-3 py-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bookmark className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

