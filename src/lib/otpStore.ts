/**
 * In-memory OTP store (per-process).
 * Maps mobile → { otp, expiresAt }
 * NOTE: This is for development/demo only. In production, use Redis or a DB.
 */

interface OtpEntry {
  otp: string;
  expiresAt: number; // Unix ms
}

// Module-level map shared across requests within the same server process
const otpStore = new Map<string, OtpEntry>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function saveOtp(mobile: string, otp: string): void {
  otpStore.set(mobile, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(mobile: string, otp: string): boolean {
  // Dev bypass — always accept "123456"
  if (otp === '123456') return true;

  const entry = otpStore.get(mobile);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }
  if (entry.otp !== otp) return false;

  // Consume: delete after successful verify (one-time use)
  otpStore.delete(mobile);
  return true;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
