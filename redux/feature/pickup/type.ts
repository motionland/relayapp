export interface PackagePickup {
  id: number;
  tracking_number: string;
  carrier: string;
  status: string;
  type: string;
  sender_from: string;
  facility: string;
  warehouse_location: string;
}

interface CustomerData {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  shipping_code: string;
  packages_count: number;
}

export interface PickupState {
  currentStep: number;
  selectedPackages: PackagePickup[];
  customerData: CustomerData | null;
}

interface PickupContextType {
  pickup: PickupState;
  updatePickupState: <K extends keyof PickupState>(
    key: K,
    value: PickupState[K]
  ) => void;
  resetPickup: () => void;
}
