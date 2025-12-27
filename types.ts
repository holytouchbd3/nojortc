export enum InstallStatus {
  NewOrder = 'নতুন অর্ডার',
  DeviceShipped = 'ডিভাইস পাঠানো হয়েছে',
  InstallationScheduled = 'ইন্সটলেশন নির্ধারিত',
  Completed = 'সম্পন্ন',
  PaymentPendingApproval = 'পেমেন্ট অনুমোদনের অপেক্ষায়',
  PaymentReceived = 'পেমেন্ট গৃহীত',
  Cancelled = 'বাতিল',
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  location: string;
  username: string;
  password: string; 
}

export interface TravelExpense {
  amount: number;
  status: 'pending' | 'approved';
}

export interface Note {
  text: string;
  date: string;
  authorId: string; // 'admin' or technician's ID
  authorName: string;
}

export interface PaymentDetails {
  amountReceived: number;
  receivedDate: string;
  approvedBy: 'admin';
}

export interface Install {
  id: string;
  customer: Customer;
  productPrice: number;
  technicianId: string | null;
  technicianFee: number;
  status: InstallStatus;
  orderDate: string;
  installationDateTime?: string;
  notes: Note[];
  deviceType?: 'Voice' | 'Non-Voice';
  courierService?: string;
  imei?: string;
  travelExpense?: TravelExpense;
  paymentDetails?: PaymentDetails;
}