export const demoScenarios = [
  {
    id: "kyc-otp",
    title: "Fake bank KYC update",
    tag: "High-risk indicators",
    message:
      "Dear Customer, your SBI Bank account KYC is PENDING and will be BLOCKED within 24 hours. " +
      "To verify, share the OTP sent to your registered mobile number immediately. " +
      "Update now: http://sbi-kyc-verify.xyz/update",
  },
  {
    id: "job-offer",
    title: "Fake job offer with a fee",
    tag: "Suspicious indicators",
    message:
      "Congratulations! You are selected for a Work From Home part-time job. Earn Rs 4500 daily, no experience needed. " +
      "Pay a small refundable registration fee of Rs 499 via UPI to confirm your seat today only.",
  },
  {
    id: "appointment",
    title: "Normal appointment reminder",
    tag: "Low-risk indicators",
    message:
      "Hi Priya, this is a reminder for your dentist appointment tomorrow, 20th Nov at 4:30 PM at City Dental Clinic. " +
      "Reply YES to confirm or call the clinic to reschedule.",
  },
];
