import { NextRequest, NextResponse } from 'next/server';
import { saveOtp, generateOtp } from '@/lib/otpStore';

const IRAN_MOBILE_REGEX = /^09[0-9]{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mobile: string = (body.mobile ?? '').trim();

    // Validate Iranian mobile format
    if (!IRAN_MOBILE_REGEX.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'شماره موبایل معتبر نیست. فرمت: 09XXXXXXXXX' },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    saveOtp(mobile, otp);

    // Mock SMS — in production replace with Kavenegar / Melipayamak / etc.
    console.log(`\n📱 [MOCK SMS] → ${mobile}\n   OTP Code: ${otp}\n`);

    return NextResponse.json({
      success: true,
      message: 'کد تأیید ارسال شد.',
      // Only expose in development for easier testing
      ...(process.env.NODE_ENV === 'development' && { _devOtp: otp }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
