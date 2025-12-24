import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, Plus, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/lib/auth/auth.store'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('auth_token')
    logout()
    setIsOpen(false)
    setIsUserMenuOpen(false)
    router.navigate({ to: '/' })
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="باز کردن منو"
            >
              <Menu size={22} className="text-gray-700" />
            </button>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                وبلاگ من
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {!user ? (
              <Link to="/login">
                <Button variant="outline" className="hidden sm:flex items-center gap-2 border-gray-300 hover:bg-gray-50">
                  <LogIn size={18} />
                  ورود
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="bg-blue-600 p-1.5 rounded-full">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{user.mobile}</span>
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 p-1.5 rounded-full">
                            <User size={14} className="text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{user.mobile}</span>
                            <span className="text-xs text-gray-600">کاربر سایت</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 transition-colors text-right"
                      >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">خروج از حساب</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <Link to="/admin/new">
              <Button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
                <Plus size={18} />
                پست جدید
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white text-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">منوی ناوبری</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="بستن منو"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {user && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-full text-white shadow-md">
                <User size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{user.mobile}</span>
                <span className="text-xs text-gray-600">کاربر سایت</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all mb-2 text-gray-700 group"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all mb-2 text-white shadow-md',
              }}
            >
              <Home size={20} className="group-[.active]:text-white" />
              <span className="font-medium">خانه</span>
            </Link>

            <Link
              to="/admin/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all mb-2 text-gray-700 group"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all mb-2 text-white shadow-md',
              }}
            >
              <Plus size={20} className="group-[.active]:text-white" />
              <span className="font-medium">ایجاد پست</span>
            </Link>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all mb-2 border border-blue-100"
              >
                <LogIn size={20} />
                <span className="font-medium">ورود به حساب</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all mb-2 border border-red-100"
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
