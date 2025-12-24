import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { sendOtpFn, validateOtpFn } from '@/lib/auth/auth.server-functions'
import { Smartphone, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCode = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobile.match(/^09\d{9}$/)) {
      setError('لطفاً یک شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await sendOtpFn({ data: mobile })
      if (response.status === 'success' || response.result) {
        setStep('otp')
      } else {
        setError('خطا در ارسال کد. لطفاً دوباره تلاش کنید.')
      }
    } catch (err) {
      setError('خطایی رخ داد. لطفاً اتصال خود را بررسی کنید.')
    } finally {
      setIsLoading(false)
    }
  }, [mobile])

  const handleValidateCode = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) {
      setError('لطفاً کد تایید را به طور کامل وارد کنید')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await validateOtpFn({ data: { mobile, code } })
      if (response.success && response.result?.access_token) {
        // Store token in cookie
        Cookies.set('auth_token', response.result.access_token, { 
          expires: response.result.expires_in / 86400, // convert seconds to days
          secure: true,
          sameSite: 'strict'
        })
        
        // Store user info
        localStorage.setItem('user', JSON.stringify({ mobile }))
        
        // Redirect to home
        router.navigate({ to: '/' })
      } else {
        setError('کد وارد شده صحیح نیست یا منقضی شده است')
      }
    } catch (err) {
      setError('خطا در تایید کد. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsLoading(false)
    }
  }, [mobile, code, router])

  return (
    <div className="min-h-[calc(100-64px)] flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            خوش آمدید
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {step === 'mobile' 
              ? 'برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید' 
              : `کد تایید ارسال شده به ${mobile} را وارد کنید`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 'mobile' ? handleSendCode : handleValidateCode} className="space-y-6">
            {step === 'mobile' ? (
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-right block">شماره موبایل</Label>
                <div className="relative">
                  <Smartphone className="absolute right-3 top-3 text-gray-400" size={20} />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="pr-10 text-left ltr h-12 text-lg focus-visible:ring-blue-500"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-right block">کد تایید</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
                  <Input
                    id="code"
                    type="text"
                    placeholder="کد ۴ رقمی"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pr-10 text-center tracking-[1em] ltr h-12 text-lg focus-visible:ring-blue-500 font-bold"
                    disabled={isLoading}
                    maxLength={4}
                    autoFocus
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setStep('mobile')}
                  className="text-sm text-blue-600 hover:underline mt-2"
                >
                  ویرایش شماره موبایل
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 text-right">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold shadow-lg shadow-blue-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin ml-2" size={20} />
              ) : (
                <ArrowRight className="ml-2" size={20} />
              )}
              {step === 'mobile' ? 'دریافت کد تایید' : 'ورود به حساب'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

