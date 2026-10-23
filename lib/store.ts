"use client";

import { Vehicle, Customer, Booking, RentalAgreement, MaintenanceRecord, PaymentRecord } from "./types";
import { SAMPLE_STARTER_VEHICLES } from "./mock-data";

// Default Manager Credentials for Manager Portal
export const DEFAULT_MANAGER = {
  id: "mgr-001",
  name: "Fleet & Operations Manager",
  email: "manager@rentago.rw",
  password: "admin123",
  role: "MANAGER" as const,
};

const STORAGE_KEYS = {
  CUSTOMERS: "rcrms_customers_data",
  VEHICLES: "rcrms_vehicles_data",
  BOOKINGS: "rcrms_bookings_data",
  AGREEMENTS: "rcrms_agreements_data",
  PAYMENTS: "rcrms_payments_data",
  MAINTENANCES: "rcrms_maintenances_data",
  CUSTOMER_SESSION: "rcrms_auth_customer",
  MANAGER_SESSION: "rcrms_auth_manager",
};

const notifyStoreUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rcrms_store_updated"));
  }
};

// Safe JSON reading
function readItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Safe JSON writing
function writeItem<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyStoreUpdate();
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// --- Customer Store ---
export function getCustomers(): Customer[] {
  return readItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
}

export function saveCustomer(customer: Customer): void {
  const list = getCustomers();
  const index = list.findIndex((c) => c.email.toLowerCase() === customer.email.toLowerCase());
  if (index >= 0) {
    list[index] = customer;
  } else {
    list.unshift(customer);
  }
  writeItem(STORAGE_KEYS.CUSTOMERS, list);
}

export function findCustomerByEmail(email: string): Customer | undefined {
  const list = getCustomers();
  return list.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
}

// --- Customer Session ---
export function getCustomerSession(): Customer | null {
  return readItem<Customer | null>(STORAGE_KEYS.CUSTOMER_SESSION, null);
}

export function setCustomerSession(customer: Customer | null): void {
  if (customer) {
    writeItem(STORAGE_KEYS.CUSTOMER_SESSION, customer);
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER_SESSION);
      notifyStoreUpdate();
    }
  }
}

// --- Manager Session ---
export function getManagerSession(): typeof DEFAULT_MANAGER | null {
  return readItem<typeof DEFAULT_MANAGER | null>(STORAGE_KEYS.MANAGER_SESSION, null);
}

export function setManagerSession(manager: typeof DEFAULT_MANAGER | null): void {
  if (manager) {
    writeItem(STORAGE_KEYS.MANAGER_SESSION, manager);
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.MANAGER_SESSION);
      notifyStoreUpdate();
    }
  }
}

// --- Vehicle Store ---
export function getVehicles(): Vehicle[] {
  return readItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, []);
}

export function saveVehicle(vehicle: Vehicle): void {
  const list = getVehicles();
  const index = list.findIndex((v) => v.id === vehicle.id);
  if (index >= 0) {
    list[index] = vehicle;
  } else {
    list.unshift(vehicle);
  }
  writeItem(STORAGE_KEYS.VEHICLES, list);
}

export function updateVehicleStatus(id: string, status: Vehicle["status"]): void {
  const list = getVehicles();
  const updated = list.map((v) => (v.id === id ? { ...v, status } : v));
  writeItem(STORAGE_KEYS.VEHICLES, updated);
}

export function deleteVehicle(id: string): void {
  const list = getVehicles().filter((v) => v.id !== id);
  writeItem(STORAGE_KEYS.VEHICLES, list);
}

export function seedStarterVehicles(): Vehicle[] {
  writeItem(STORAGE_KEYS.VEHICLES, SAMPLE_STARTER_VEHICLES);
  return SAMPLE_STARTER_VEHICLES;
}

// --- Booking Store ---
export function getBookings(): Booking[] {
  return readItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
}

export function saveBooking(booking: Booking): void {
  const list = getBookings();
  const index = list.findIndex((b) => b.id === booking.id);
  if (index >= 0) {
    list[index] = booking;
  } else {
    list.unshift(booking);
  }
  writeItem(STORAGE_KEYS.BOOKINGS, list);

  // Automatically update vehicle status to RESERVED
  if (booking.vehicleId) {
    updateVehicleStatus(booking.vehicleId, "RESERVED");
  }

  // Record deposit payment automatically
  if (booking.depositAmount > 0) {
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      reference: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: booking.customerName || "Customer",
      vehicleName: booking.vehicleName || "Vehicle",
      amount: booking.depositAmount,
      paymentMethod: "MOBILE_MONEY",
      provider: "MTN MoMo (*182#)",
      paymentType: "DEPOSIT",
      status: "COMPLETED",
      transactionId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    savePayment(payment);
  }
}

export function updateBookingStatus(id: string, status: Booking["status"]): void {
  const list = getBookings();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  writeItem(STORAGE_KEYS.BOOKINGS, updated);
}

// --- Agreements Store ---
export function getAgreements(): RentalAgreement[] {
  return readItem<RentalAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
}

export function saveAgreement(agreement: RentalAgreement): void {
  const list = getAgreements();
  const index = list.findIndex((a) => a.id === agreement.id);
  if (index >= 0) {
    list[index] = agreement;
  } else {
    list.unshift(agreement);
  }
  writeItem(STORAGE_KEYS.AGREEMENTS, list);
}

// --- Payments Store ---
export function getPayments(): PaymentRecord[] {
  return readItem<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
}

export function savePayment(payment: PaymentRecord): void {
  const list = getPayments();
  const index = list.findIndex((p) => p.id === payment.id);
  if (index >= 0) {
    list[index] = payment;
  } else {
    list.unshift(payment);
  }
  writeItem(STORAGE_KEYS.PAYMENTS, list);
}

// --- Maintenance Store ---
export function getMaintenances(): MaintenanceRecord[] {
  return readItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCES, []);
}

export function saveMaintenance(maintenance: MaintenanceRecord): void {
  const list = getMaintenances();
  const index = list.findIndex((m) => m.id === maintenance.id);
  if (index >= 0) {
    list[index] = maintenance;
  } else {
    list.unshift(maintenance);
  }
  writeItem(STORAGE_KEYS.MAINTENANCES, list);
}

// --- Dynamic Live Dashboard Calculations ---
export function calculateDashboardStats() {
  const vehicles = getVehicles();
  const bookings = getBookings();
  const payments = getPayments();
  const maintenances = getMaintenances();
  const customers = getCustomers();

  const availableCars = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const currentlyRented = vehicles.filter((v) => v.status === "RENTED").length;
  const reserved = vehicles.filter((v) => v.status === "RESERVED").length;
  const underMaintenance = vehicles.filter((v) => v.status === "MAINTENANCE").length;

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const monthExpenses = maintenances.reduce((sum, m) => sum + (m.serviceCost || 0), 0);

  const outstandingPayments = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "ACTIVE")
    .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

  const fleetUtilizationRate = vehicles.length > 0
    ? Math.round(((currentlyRented + reserved) / vehicles.length) * 100)
    : 0;

  return {
    totalCars: vehicles.length,
    availableCars,
    currentlyRented,
    reserved,
    underMaintenance,
    todayRevenue: totalRevenue,
    monthRevenue: totalRevenue,
    monthExpenses,
    netProfit: totalRevenue - monthExpenses,
    outstandingPayments,
    fleetUtilizationRate,
    totalCustomers: customers.length,
    totalBookings: bookings.length,
  };
}
