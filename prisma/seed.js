const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Car Rental Management System database...");

  // Clean old records
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.vehicleCategory.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users for all 4 roles
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@rentago.rw",
      name: "System Administrator",
      role: "ADMIN",
      phone: "+250 788 100 200",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: "manager@rentago.rw",
      name: "Fleet & Operations Manager",
      role: "MANAGER",
      phone: "+250 788 200 300",
    },
  });

  const agentUser = await prisma.user.create({
    data: {
      email: "agent@rentago.rw",
      name: "Claude Rukundo (Rental Agent)",
      role: "RENTAL_AGENT",
      phone: "+250 788 300 400",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "alice.uwase@techrwanda.rw",
      name: "Alice Uwase",
      role: "CUSTOMER",
      phone: "+250 789 654 321",
    },
  });

  // 2. Create Categories
  const catSUV = await prisma.vehicleCategory.create({
    data: { id: "cat-suv", name: "Compact SUV", description: "City comfort & scenic touring" },
  });
  const cat4x4 = await prisma.vehicleCategory.create({
    data: { id: "cat-4x4", name: "Full-Size 4x4", description: "Safaris & rugged terrain" },
  });
  const catLuxury = await prisma.vehicleCategory.create({
    data: { id: "cat-luxury", name: "Luxury Sedan", description: "VIP & diplomatic transport" },
  });
  const catVan = await prisma.vehicleCategory.create({
    data: { id: "cat-van", name: "Passenger Van", description: "Group transfers & corporate tours" },
  });

  // 3. Create Customers
  const cust1 = await prisma.customer.create({
    data: {
      id: "cust-1",
      fullName: "Jean Paul Mugisha",
      email: "jp.mugisha@gmail.com",
      phone: "+250 788 123 456",
      address: "KG 14 Ave, Nyarutarama, Kigali",
      nationalId: "1 1990 8 0012345 0 88",
      licenseNumber: "RW-DL-98214-B",
      licenseExpiry: new Date("2028-11-20"),
      balance: 0,
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      id: "cust-2",
      userId: customerUser.id,
      fullName: "Alice Uwase",
      email: "alice.uwase@techrwanda.rw",
      phone: "+250 789 654 321",
      address: "KK 25 St, Kicukiro, Kigali",
      nationalId: "1 1993 7 0045678 0 12",
      licenseNumber: "RW-DL-44129-B",
      licenseExpiry: new Date("2027-06-14"),
      balance: 125000, // Matches prompt's Outstanding Payments: 125,000 RWF!
    },
  });

  const cust3 = await prisma.customer.create({
    data: {
      id: "cust-3",
      fullName: "David Ndoli",
      email: "david.ndoli@ecotours.com",
      phone: "+250 782 998 877",
      address: "KN 5 Rd, Kiyovu, Kigali",
      nationalId: "1 1988 8 0087654 0 55",
      licenseNumber: "RW-DL-77312-B",
      licenseExpiry: new Date("2029-01-30"),
      balance: 0,
    },
  });

  // 4. Create Vehicles
  const veh1 = await prisma.vehicle.create({
    data: {
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
      currentMileage: 85420,
      status: "AVAILABLE",
      categoryId: catSUV.id,
      insuranceExpiry: new Date("2027-04-15"),
      inspectionExpiry: new Date("2027-03-10"),
      lastServiceDate: new Date("2026-07-10"),
      nextServiceMileage: 85620, // 200 km due!
      nextServiceDate: new Date("2026-10-10"),
      imageUrl: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1000&q=80",
      description: "Versatile and fuel-efficient compact SUV, perfect for both Kigali city cruising and scenic journeys.",
      features: JSON.stringify(["All-Wheel Drive", "Apple CarPlay", "Rear Camera", "Dual-zone Climate", "Cruise Control"]),
    },
  });

  const veh2 = await prisma.vehicle.create({
    data: {
      id: "veh-2",
      registrationNo: "RAC 456B",
      make: "Toyota",
      model: "Land Cruiser Prado TX",
      year: 2022,
      color: "Pearl White",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 7,
      dailyRate: 110000,
      currentMileage: 112340,
      status: "MAINTENANCE",
      categoryId: cat4x4.id,
      insuranceExpiry: new Date("2027-01-20"),
      inspectionExpiry: new Date("2026-12-05"),
      lastServiceDate: new Date("2026-05-18"),
      nextServiceMileage: 115000,
      nextServiceDate: new Date("2026-09-25"), // In 5 days!
      imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
      description: "The gold standard for Rwandan safari tours and rugged terrain expeditions across national parks.",
      features: JSON.stringify(["Heavy Duty 4WD", "High Ground Clearance", "Roof Rack Ready", "Cool Box", "7 Seats"]),
    },
  });

  const veh3 = await prisma.vehicle.create({
    data: {
      id: "veh-3",
      registrationNo: "RAD 789C",
      make: "Mercedes-Benz",
      model: "C-Class C200",
      year: 2023,
      color: "Obsidian Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      dailyRate: 130000,
      currentMileage: 42150,
      status: "RENTED",
      categoryId: catLuxury.id,
      insuranceExpiry: new Date("2027-08-30"),
      inspectionExpiry: new Date("2027-06-12"),
      lastServiceDate: new Date("2026-08-01"),
      nextServiceMileage: 50000,
      nextServiceDate: new Date("2026-12-01"),
      imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
      description: "Premium executive sedan crafted for VIP airport transfers, diplomatic summits, and weddings.",
      features: JSON.stringify(["Burmester Sound", "Ambient Lighting", "Heated Leather Seats", "Head-Up Display"]),
    },
  });

  const veh4 = await prisma.vehicle.create({
    data: {
      id: "veh-4",
      registrationNo: "RAF 321D",
      make: "Hyundai",
      model: "Tucson",
      year: 2024,
      color: "Phantom Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      dailyRate: 65000,
      currentMileage: 28900,
      status: "RESERVED",
      categoryId: catSUV.id,
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      description: "Futuristic styling with ultra-quiet cabin and smooth highway acceleration.",
      features: JSON.stringify(["Panoramic Sunroof", "Lane Keep Assist", "Wireless Charger", "Smart Keyless Entry"]),
    },
  });

  const veh5 = await prisma.vehicle.create({
    data: {
      id: "veh-5",
      registrationNo: "RAH 987F",
      make: "Toyota",
      model: "HiAce Super Custom Van",
      year: 2021,
      color: "Silver",
      transmission: "Manual",
      fuelType: "Diesel",
      seats: 12,
      dailyRate: 90000,
      currentMileage: 148900,
      status: "AVAILABLE",
      categoryId: catVan.id,
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80",
      description: "Spacious multi-passenger tour van ideal for corporate retreats, family trips and group transfers.",
      features: JSON.stringify(["12 Reclining Seats", "Dual Air Conditioning", "Luggage Space", "PA System"]),
    },
  });

  // 5. Create Bookings
  const bk1 = await prisma.booking.create({
    data: {
      id: "bk-1",
      bookingCode: "BK-2026-001",
      customerId: cust1.id,
      vehicleId: veh1.id,
      startDate: new Date("2026-09-25T09:00:00Z"),
      endDate: new Date("2026-09-29T17:00:00Z"),
      pickupLocation: "Kigali International Airport",
      returnLocation: "Kigali Headquarters",
      dailyRate: 50000,
      totalDays: 4,
      baseRentalFee: 200000,
      driverFee: 40000,
      insuranceFee: 15000,
      extraFees: 0,
      totalAmount: 255000,
      depositAmount: 100000,
      balanceAmount: 155000,
      status: "CONFIRMED",
      notes: "Customer requested child safety seat. Flight arrival WB 402.",
    },
  });

  const bk2 = await prisma.booking.create({
    data: {
      id: "bk-2",
      bookingCode: "BK-2026-002",
      customerId: cust2.id,
      vehicleId: veh3.id,
      startDate: new Date("2026-09-19T10:00:00Z"),
      endDate: new Date("2026-09-22T10:00:00Z"),
      pickupLocation: "Kigali Convention Centre",
      returnLocation: "Kigali Convention Centre",
      dailyRate: 130000,
      totalDays: 3,
      baseRentalFee: 390000,
      driverFee: 0,
      insuranceFee: 45000,
      extraFees: 0,
      totalAmount: 435000,
      depositAmount: 150000,
      balanceAmount: 125000,
      status: "ACTIVE",
      notes: "Summit executive rental. Rental currently in progress.",
    },
  });

  // 6. Create Rental Agreement (Active)
  const rental1 = await prisma.rental.create({
    data: {
      id: "rent-1",
      rentalCode: "RA-2026-002",
      bookingId: bk2.id,
      customerId: cust2.id,
      vehicleId: veh3.id,
      startDate: new Date("2026-09-19T10:00:00Z"),
      endDate: new Date("2026-09-22T10:00:00Z"),
      pickupMileage: 42150,
      pickupFuelLevel: 90,
      pickupCondition: "Pristine exterior and interior condition.",
      pickupDamages: "Tiny stone chip on lower front right air vent, documented.",
      customerSignature: "Alice Uwase (Verified Digital Sign)",
      agentSignature: "Claude Rukundo (RCRMS Agent #104)",
      baseRentalFee: 390000,
      driverFee: 0,
      insuranceFee: 45000,
      finalTotal: 435000,
      depositPaid: 150000,
      amountPaid: 310000,
      outstandingBalance: 125000,
      status: "ACTIVE",
    },
  });

  // 7. Create Maintenance Records matching prompt alerts!
  await prisma.maintenance.create({
    data: {
      vehicleId: veh1.id,
      serviceType: "OIL_CHANGE",
      description: "Scheduled synthetic engine oil & filter replacement (due in 200 km)",
      serviceCost: 45000,
      serviceMileage: 85420,
      serviceDate: new Date("2026-09-22"),
      nextDueMileage: 90000,
      nextDueDate: new Date("2026-12-22"),
      status: "SCHEDULED",
      vendor: "Toyota Rwanda Service Center, Gikondo",
      notes: "Parts ordered and scheduled.",
    },
  });

  await prisma.maintenance.create({
    data: {
      vehicleId: veh2.id,
      serviceType: "BRAKE_SERVICE",
      description: "Front & rear ceramic brake pads replacement and rotor machining (due in 5 days)",
      serviceCost: 180000,
      serviceMileage: 112340,
      serviceDate: new Date("2026-09-25"),
      nextDueMileage: 130000,
      nextDueDate: new Date("2027-03-25"),
      status: "IN_PROGRESS",
      vendor: "Kigali Motors Specialist Garage",
      notes: "Vehicle currently in workshop.",
    },
  });

  // 8. Create Payments (Daily Revenue: 450,000 RWF!)
  await prisma.payment.create({
    data: {
      reference: "PAY-2026-901",
      customerId: cust1.id,
      bookingId: bk1.id,
      amount: 100000,
      paymentMethod: "MOBILE_MONEY",
      provider: "MTN MoMo (*182#)",
      paymentType: "DEPOSIT",
      status: "COMPLETED",
      transactionId: "MTN-TX-88219318",
    },
  });

  await prisma.payment.create({
    data: {
      reference: "PAY-2026-902",
      customerId: cust2.id,
      bookingId: bk2.id,
      rentalId: rental1.id,
      amount: 150000,
      paymentMethod: "CREDIT_CARD",
      provider: "Visa Platinum",
      paymentType: "DEPOSIT",
      status: "COMPLETED",
      transactionId: "VISA-AUTH-449102",
    },
  });

  await prisma.payment.create({
    data: {
      reference: "PAY-2026-904",
      customerId: cust2.id,
      rentalId: rental1.id,
      amount: 200000,
      paymentMethod: "MOBILE_MONEY",
      provider: "Airtel Money",
      paymentType: "RENTAL_FEE",
      status: "COMPLETED",
      transactionId: "AIR-MO-552019",
    },
  });

  // 9. Notifications
  await prisma.notification.create({
    data: {
      title: "Toyota RAV4 Service Due Soon",
      message: "Plate RAE 123A is due for an Oil Change in 200 km.",
      type: "MAINTENANCE",
      priority: "HIGH",
    },
  });

  await prisma.notification.create({
    data: {
      title: "Land Cruiser Prado Inspection",
      message: "Plate RAC 456B brake inspection is scheduled in 5 days.",
      type: "MAINTENANCE",
      priority: "HIGH",
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
