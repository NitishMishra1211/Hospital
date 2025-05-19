
import { NextResponse } from 'next/server';

// --- Configuration (SHOULD come from environment variables in a real app) ---
const SMS_GATEWAY_API_URL = process.env.SMS_GATEWAY_API_URL || 'https://api.mock-sms-gateway.com/send_otp';
const SMS_GATEWAY_API_KEY = process.env.SMS_GATEWAY_API_KEY || 'MOCK_SMS_GATEWAY_API_KEY';

/**
 * Generates a random 6-digit OTP.
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
    }

    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        return NextResponse.json({ success: false, message: 'Invalid phone number format. Please use E.164 format (e.g., +11234567890).' }, { status: 400 });
    }

    const otp = generateOtp();

    // In a real application, you would store this OTP temporarily (e.g., in a database, cache like Redis)
    // associated with the phoneNumber and an expiry time. It would then be checked by a separate /api/verify-otp endpoint.
    console.log(`Generated OTP ${otp} for ${phoneNumber}. This would be stored securely.`);


    // --- Simulate Calling External SMS Gateway ---
    // In a real scenario, you would use fetch or a library like axios here.
    // This part is crucial and would involve your actual SMS provider's API.
    console.log(`Simulating sending OTP ${otp} to ${phoneNumber} via ${SMS_GATEWAY_API_URL} with key ${SMS_GATEWAY_API_KEY}`);
    // const gatewayResponse = await fetch(SMS_GATEWAY_API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${SMS_GATEWAY_API_KEY}`, 
    //   },
    //   body: JSON.stringify({
    //     to: phoneNumber,
    //     message: `Your OTP for MediCore Lite is: ${otp}. This code is valid for 10 minutes.`,
    //   }),
    // });

    // if (!gatewayResponse.ok) {
    //   const errorData = await gatewayResponse.json().catch(() => ({})); 
    //   console.error('SMS Gateway Error:', errorData);
    //   throw new Error(errorData.message || `SMS Gateway request failed with status ${gatewayResponse.status}`);
    // }
    // const responseData = await gatewayResponse.json();
    // console.log('SMS Gateway API Success Response:', responseData);
    // ---- End of real gateway call example ----

    // For this conceptual integration, we'll assume the call was successful.
    const simulatedGatewayCallSuccessful = true; 

    if (simulatedGatewayCallSuccessful) {
      return NextResponse.json({ success: true, message: `OTP has been sent to ${phoneNumber}.` });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to send OTP via gateway.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in /api/send-otp route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
    