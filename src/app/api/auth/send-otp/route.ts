import { NextRequest, NextResponse } from 'next/server';
import { saveOtp, generateOtp } from '@/lib/otpStore';

/**
 * Validation rules per country dial code.
 * Pattern matches the LOCAL part (after the country code).
 * We store the full international number (+XX...) as the key.
 */
const COUNTRY_RULES: Record<string, { pattern: RegExp; label: string }> = {
  '+98': {
    // Iran: local part is 10 digits starting with 9 (e.g. 9123456789)
    pattern: /^9[0-9]{9}$/,
    label: 'Iran (+98)',
  },
  '+1': {
    // Canada/US: 10 digits
    pattern: /^[2-9][0-9]{9}$/,
    label: 'Canada/US (+1)',
  },
};

function buildFullNumber(dialCode: string, localNumber: string): string {
  return `${dialCode}${localNumber}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dialCode: string = (body.dialCode ?? '+98').trim();
    const localNumber: string = (body.localNumber ?? '').trim().replace(/\D/g, '');

    const rule = COUNTRY_RULES[dialCode];
    if (!rule) {
      return NextResponse.json(
        { success: false, message: 'Unsupported country code.' },
        { status: 400 }
      );
    }

    if (!rule.pattern.test(localNumber)) {
      return NextResponse.json(
        { success: false, message: `Invalid mobile number for ${rule.label}.` },
        { status: 400 }
      );
    }

    const fullMobile = buildFullNumber(dialCode, localNumber);
    const otp = generateOtp();
    saveOtp(fullMobile, otp);

    // Mock SMS — replace with Kavenegar / Twilio / etc. in production
    console.log(`\n📱 [MOCK SMS] → ${fullMobile}\n   OTP Code : ${otp}\n`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent.',
      fullMobile,
      ...(process.env.NODE_ENV === 'development' && { _devOtp: otp }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
