import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="باز کردن منو"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                وبلاگ من
              </span>
            </Link>
          </div>
          <Link to="/admin/new">
            <Button className="hidden sm:flex">
              <Plus size={16} className="ml-2" />
              پست جدید
            </Button>
          </Link>
        </div>
      </header>

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white text-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">منوی ناوبری</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="بستن منو"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2 text-gray-900"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Home size={20} />
            <span className="font-medium">خانه</span>
          </Link>

          <Link
            to="/admin/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2 text-gray-900"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors mb-2 text-white',
            }}
          >
            <Plus size={20} />
            <span className="font-medium">ایجاد پست</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
