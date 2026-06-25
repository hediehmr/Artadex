/**
 * IAM i18n — supports Persian (fa) and English (en).
 * Used by auth/login and auth/verify pages.
 */

export type Lang = 'fa' | 'en';

export const i18n = {
  fa: {
    dir: 'rtl' as const,
    brand: 'آرتادکس',
    // Login page
    loginTitle: 'ورود / ثبت‌نام',
    loginSubtitle: 'شماره موبایل خود را وارد کنید تا کد تأیید ارسال شود.',
    labelCountry: 'کشور',
    labelMobile: 'شماره موبایل',
    placeholderIran: '9123456789',
    placeholderCanada: '6045550123',
    sendCode: 'ارسال کد تأیید',
    sending: 'در حال ارسال...',
    securityNote: 'اطلاعات شما رمزنگاری شده و کاملاً امن است.',
    backHome: '← بازگشت به صفحه اصلی',
    errInvalidMobile: 'شماره موبایل معتبر نیست.',
    errNetwork: 'خطای شبکه. اتصال اینترنت خود را بررسی کنید.',
    // Verify page
    verifyTitle: 'تأیید شماره موبایل',
    verifySubtitle: 'کد ۶ رقمی ارسال شده به',
    verifyBtn: 'تأیید و ورود',
    verifying: 'در حال تأیید...',
    resendCooldown: (s: number) => `ارسال مجدد (${s}s)`,
    resend: 'ارسال مجدد کد',
    successTitle: 'ورود موفق!',
    successSub: 'در حال انتقال به داشبورد...',
    backToLogin: '← تغییر شماره موبایل',
    errIncomplete: 'لطفاً کد ۶ رقمی را کامل وارد کنید.',
    errWrongOtp: 'کد وارد شده اشتباه است.',
    errNetworkVerify: 'خطای شبکه. لطفاً دوباره تلاش کنید.',
    digitLabel: (i: number) => `رقم ${i + 1} از کد تأیید`,
  },
  en: {
    dir: 'ltr' as const,
    brand: 'Artadex',
    // Login page
    loginTitle: 'Sign In / Register',
    loginSubtitle: 'Enter your mobile number and we\'ll send you a verification code.',
    labelCountry: 'Country',
    labelMobile: 'Mobile Number',
    placeholderIran: '9123456789',
    placeholderCanada: '6045550123',
    sendCode: 'Send Code',
    sending: 'Sending...',
    securityNote: 'Your data is encrypted and completely secure.',
    backHome: '← Back to Home',
    errInvalidMobile: 'Invalid mobile number.',
    errNetwork: 'Network error. Please check your internet connection.',
    // Verify page
    verifyTitle: 'Verify Mobile Number',
    verifySubtitle: '6-digit code sent to',
    verifyBtn: 'Verify & Sign In',
    verifying: 'Verifying...',
    resendCooldown: (s: number) => `Resend Code (${s}s)`,
    resend: 'Resend Code',
    successTitle: 'Signed In!',
    successSub: 'Redirecting to dashboard...',
    backToLogin: '← Change mobile number',
    errIncomplete: 'Please enter the complete 6-digit code.',
    errWrongOtp: 'Incorrect verification code.',
    errNetworkVerify: 'Network error. Please try again.',
    digitLabel: (i: number) => `Digit ${i + 1} of verification code`,
  },
} satisfies Record<Lang, Record<string, unknown>>;
