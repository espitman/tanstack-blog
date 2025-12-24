import { Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Home, Menu, X, Plus, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Cookies from 'js-cookie'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ mobile: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    setIsOpen(false)
    router.navigate({ to: '/' })
  }

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
          <div className="flex items-center gap-2">
            {!user ? (
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                  <LogIn size={18} />
                  ورود
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-3 ml-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{user.mobile}</span>
              </div>
            )}
            <Link to="/admin/new">
              <Button className="hidden sm:flex">
                <Plus size={16} className="ml-2" />
                پست جدید
              </Button>
            </Link>
          </div>
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
          {user && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="bg-blue-600 p-2 rounded-full text-white">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-900">{user.mobile}</span>
                <span className="text-xs text-blue-600">کاربر سایت</span>
              </div>
            </div>
          )}

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

          <div className="mt-auto pt-4 border-t border-gray-100">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2 text-gray-900"
              >
                <LogIn size={20} />
                <span className="font-medium">ورود به حساب</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mb-2"
              >
                <LogOut size={20} />
                <span className="font-medium">خروج از حساب</span>
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}
