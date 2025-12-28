// File: whatsappApi.ts

/**
 * API থেকে কি ধরনের রেসপন্স আসবে তার টাইপ ডেফিনিশন।
 */
export interface ApiResponse {
  status: number;
  message: string;
  data: {
    messageId?: number;
  } | boolean;
}

// ===================================================================
//                 API Configuration (আপনার তথ্য)
// ===================================================================

// আপনার Smart SMS BD API Secret Key
const API_SECRET = 'f0d00593b3756fcdafe1f9571a434e78f2b21c7a';

// আপনার WhatsApp Account Unique ID
const WHATSAPP_ACCOUNT_ID = '1766676575f899139df5e1059396431415e770c6dd694d585fe3af4';

/**
 * API-এর মূল URL। ব্রাউজার থেকে সরাসরি API কল করার জন্য
 * CORS সমস্যা এড়াতে এখানে একটি প্রক্সি ব্যবহার করা হয়েছে।
 * প্রোডাকশন পরিবেশে, নিরাপত্তার জন্য আপনার নিজের ব্যাকএন্ড থেকে API কল করা উচিত।
 */
const API_BASE_URL = 'https://corsproxy.io/?http://smartsmsbd.com/api';


// ===================================================================
//                 মেসেজ পাঠানোর মূল ফাংশন
// ===================================================================

/**
 * Smart SMS BD API ব্যবহার করে একটি WhatsApp মেসেজ পাঠায়।
 * @param recipient - প্রাপকের ফোন নম্বর (যেমন: '+88019XXXXXXXX')
 * @param message - যে মেসেজটি পাঠাতে চান
 * @returns - API থেকে পাওয়া রেসপন্স
 */
export const sendWhatsappMessage = async (recipient: string, message: string): Promise<ApiResponse> => {
  // Validate recipient number format. It should start with 880.
  let formattedRecipient = recipient.replace(/\s+|-/g, ''); // remove spaces and dashes
  if (formattedRecipient.startsWith('+880')) {
      formattedRecipient = formattedRecipient.substring(1); // remove +
  } else if (formattedRecipient.startsWith('01')) {
      formattedRecipient = `88${formattedRecipient}`;
  }
  
  if (!/^(8801)\d{9}$/.test(formattedRecipient)) {
      console.error('Invalid recipient phone number format. It should be like 8801XXXXXXXXX.');
      throw new Error('ফোন নম্বরটি সঠিক ফরম্যাটে নেই।');
  }

  const endpoint = `${API_BASE_URL}/send/whatsapp`;

  const formData = new FormData();
  formData.append('secret', API_SECRET);
  formData.append('account', WHATSAPP_ACCOUNT_ID);
  formData.append('recipient', formattedRecipient);
  formData.append('type', 'text');
  formData.append('message', message);
  formData.append('priority', '1'); // ১ মানে মেসেজটি দ্রুত পাঠানো হবে

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || data.status !== 200) {
      throw new Error(`API Error: ${data.message || response.statusText}`);
    }

    return data;

  } catch (error) {
    console.error("WhatsApp মেসেজ পাঠাতে সমস্যা হয়েছে:", error);
    if (error instanceof Error) {
        throw new Error(`মেসেজ পাঠানো ব্যর্থ হয়েছে: ${error.message}`);
    }
    throw new Error('একটি অজানা ত্রুটি ঘটেছে।');
  }
};
