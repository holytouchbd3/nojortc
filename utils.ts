import type { Install } from './types';
import { InstallStatus } from './types';

export const generateWhatsappMessage = (install: Install): string => {
    const customerName = install.customer.name;
    const orderId = install.id.split('_')[1]; // Get a cleaner ID

    switch (install.status) {
        case InstallStatus.DeviceShipped:
            return `প্রিয় ${customerName}, আপনার জিপিএস ট্র্যাকারটি "${install.courierService}" কুরিয়ারের মাধ্যমে পাঠানো হয়েছে। IMEI: ${install.imei}. আমাদের টেকনিশিয়ান শীঘ্রই আপনার সাথে যোগাযোগ করবেন। ধন্যবাদ।`;
        
        case InstallStatus.InstallationScheduled:
            const formattedDate = install.installationDateTime 
                ? new Date(install.installationDateTime).toLocaleString('bn-BD', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                  })
                : 'শিঘ্রই';
            return `প্রিয় ${customerName}, আপনার জিপিএস ট্র্যাকার ইনস্টলেশনের জন্য ${formattedDate} সময় নির্ধারণ করা হয়েছে। আমাদের টেকনিশিয়ান আপনার সাথে যোগাযোগ করবেন। ধন্যবাদ।`;
        
        case InstallStatus.Completed:
            return `প্রিয় ${customerName}, আপনার জিপিএস ট্র্যাকার ইনস্টলেশন সফলভাবে সম্পন্ন হয়েছে। আমাদের পরিষেবা ব্যবহার করার জন্য ধন্যবাদ।`;
        
        case InstallStatus.PaymentReceived:
            return `প্রিয় ${customerName}, আমরা আপনার পেমেন্ট পেয়েছি। আপনার জিপিএস ট্র্যাকার পরিষেবাটি এখন সম্পূর্ণরূপে সক্রিয়। ধন্যবাদ।`;
        
        case InstallStatus.Cancelled:
            return `প্রিয় ${customerName}, দুঃখিত, আপনার জিপিএস ট্র্যাকার অর্ডারটি (ID: ${orderId}) বাতিল করা হয়েছে। আরো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।`;

        default:
            return ''; // No message for other statuses
    }
};
