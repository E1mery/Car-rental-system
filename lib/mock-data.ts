import { Vehicle, Customer, Booking, RentalAgreement, MaintenanceRecord, PaymentRecord } from "./types";

// Empty initial datasets - All demo data removed
export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_AGREEMENTS: RentalAgreement[] = [];
export const INITIAL_MAINTENANCES: MaintenanceRecord[] = [];
export const INITIAL_PAYMENTS: PaymentRecord[] = [];

// Clean initial dashboard metrics (calculated dynamically at runtime)
export const DASHBOARD_OVERVIEW = {
  availableCars: 0,
  currentlyRented: 0,
  reserved: 0,
  underMaintenance: 0,
  todayRevenue: 0,
  outstandingPayments: 0,
  fleetUtilizationRate: 0,
  monthRevenue: 0,
  monthExpenses: 0,
  netProfit: 0,
};

// Optional sample templates available for Manager to quickly seed realistic fleet if desired
export const SAMPLE_STARTER_VEHICLES: Vehicle[] = [
  {
    id: "veh-1",
    registrationNo: "RAE 123A",
    make: "Toyota",
    model: "RAV4",
    year: 2023,
    color: "Silver Metallic",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    dailyRate: 50000,
    currentMileage: 45000,
    status: "AVAILABLE",
    categoryId: "cat-suv",
    categoryName: "Compact SUV",
    imageUrl: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1000&q=80",
    description: "Versatile and fuel-efficient compact SUV, perfect for Kigali city and safari trips.",
    features: ["All-Wheel Drive", "Apple CarPlay / Android Auto", "Rear Camera", "Dual-zone Climate", "Cruise Control"],
  },
  {
    id: "veh-2",
    registrationNo: "RAC 456B",
    make: "Toyota",
    model: "Land Cruiser Prado TX",
    year: 2023,
    color: "Pearl White",
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    dailyRate: 110000,
    currentMileage: 62000,
    status: "AVAILABLE",
    categoryId: "cat-4x4",
    categoryName: "Full-Size 4x4",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
    description: "The gold standard for Rwandan safari tours and rugged terrain expeditions.",
    features: ["Heavy Duty 4WD", "High Ground Clearance", "Roof Rack Ready", "Cool Box", "7 Full Seats"],
  },
  {
    id: "veh-3",
    registrationNo: "RAD 789C",
    make: "Mercedes-Benz",
    model: "C-Class C200",
    year: 2023,
    color: "Obsidian Black",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    dailyRate: 95000,
    currentMileage: 38000,
    status: "AVAILABLE",
    categoryId: "cat-sedan",
    categoryName: "Luxury Sedan",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
    description: "Executive luxury sedan tailored for diplomatic summits, corporate VIPs, and business events in Kigali.",
    features: ["Leather Upholstery", "Burmester Surround Sound", "Ambient LED Lighting", "Chauffeur Ready"],
  },
];
