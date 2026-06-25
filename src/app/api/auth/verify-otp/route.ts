import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

const FULL_MOBILE_REGEX = /^\+[1-9]\d{1,14}$/;
const OTP_REGEX = /^[0-9]{6}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mobile: string = (body.mobile ?? '').trim();
    const otp: string = (body.otp ?? '').trim();

    if (!FULL_MOBILE_REGEX.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'شماره موبایل نامعتبر است.' },
        { status: 400 }
      );
    }

    if (!OTP_REGEX.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'کد باید ۶ رقم باشد.' },
        { status: 400 }
      );
    }

    const isValid = verifyOtp(mobile, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'کد وارد شده اشتباه یا منقضی شده است.' },
        { status: 401 }
      );
    }

    // In production: create JWT session / set httpOnly cookie here
    return NextResponse.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      user: { mobile },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'خطای سرور. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
