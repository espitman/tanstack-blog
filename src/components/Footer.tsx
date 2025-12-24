import { Link } from '@tanstack/react-router'
import { Smartphone, Mail, MapPin, Instagram, Twitter, Linkedin, Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().toLocaleDateString('fa-IR', { year: 'numeric' })

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-right">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                لوگوی ما
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              ما در اینجا بهترین تجربه‌های سفر و اقامت را برای شما فراهم می‌کنیم. هدف ما ایجاد بستری امن و راحت برای رزرو آنلاین اقامتگاه و اشتراک‌گذاری تجربیات وبلاگ‌نویسی است.
            </p>
            <div className="flex gap-4 justify-end">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">دسترسی سریع</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/accommodations" className="hover:text-blue-600 transition-colors">اقامتگاه‌ها</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">وبلاگ</Link>
              </li>
              <li>
                <Link to="/admin/new" className="hover:text-blue-600 transition-colors">ساخت پست جدید</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">پشتیبانی</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">سوالات متداول</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">قوانین و مقررات</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">درباره ما</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">تماس با ما</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600 justify-end">
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳۴</span>
                <MapPin size={18} className="text-blue-600 shrink-0" />
              </li>
              <li className="flex items-center gap-3 text-gray-600 justify-end">
                <span className="ltr">۰۲۱-۸۸۸۸۸۸۸۸</span>
                <Smartphone size={18} className="text-blue-600 shrink-0" />
              </li>
              <li className="flex items-center gap-3 text-gray-600 justify-end">
                <span className="ltr">info@example.com</span>
                <Mail size={18} className="text-blue-600 shrink-0" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} تمامی حقوق محفوظ است.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">حریم خصوصی</a>
            <a href="#" className="hover:text-blue-600 transition-colors">نقشه سایت</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

