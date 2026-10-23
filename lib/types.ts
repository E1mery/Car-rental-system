export type Role = "ADMIN" | "MANAGER" | "RENTAL_AGENT" | "CUSTOMER";

export type VehicleStatus = "AVAILABLE" | "RESERVED" | "RENTED" | "MAINTENANCE" | "UNAVAILABLE";

export type BookingStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type PaymentMethod = "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CREDIT_CARD";

export interface Vehicle {
  id: string;
  registrationNo: string;
  make: string;
  model: string;
  year: number;
  color: string;
  transmission: string;
  fuelType: string;
  seats: number;
  dailyRate: number;
  currentMileage: number;
  status: VehicleStatus;
  categoryId: string;
  categoryName?: string;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  lastServiceDate?: string;
  nextServiceMileage?: number;
  nextServiceDate?: string;
  imageUrl?: string;
  description?: string;
  features?: string[];
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  address?: string;
  nationalId?: string;
  licenseNumber: string;
  licenseExpiry?: string;
  balance: number;
  totalBookings?: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleId: string;
  vehicleName?: string;
  vehiclePlate?: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  dailyRate: number;
  totalDays: number;
  baseRentalFee: number;
  driverFee: number;
  insuranceFee: number;
  extraFees: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface RentalAgreement {
  id: string;
  rentalCode: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  customerLicense: string;
  customerPhone: string;
  customerEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  vehicleMileage: number;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  pickupMileage: number;
  pickupFuelLevel: number;
  pickupCondition?: string;
  pickupDamages?: string;
  customerSignature?: string;
  agentSignature?: string;
  returnMileage?: number;
  returnFuelLevel?: number;
  returnCondition?: string;
  newDamages?: string;
  baseRentalFee: number;
  driverFee: number;
  insuranceFee: number;
  lateFee: number;
  damageFee: number;
  extraMileageFee: number;
  finalTotal: number;
  depositPaid: number;
  amountPaid: number;
  outstandingBalance: number;
  status: BookingStatus;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  vehiclePlate?: string;
  serviceType: string;
  description: string;
  serviceCost: number;
  serviceMileage: number;
  serviceDate: string;
  nextDueMileage?: number;
  nextDueDate?: string;
  status: string;
  vendor?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  customerName: string;
  vehicleName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  provider?: string;
  paymentType: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}
