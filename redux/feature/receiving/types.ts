export interface CarrierType {
  id: number;
  name: string;
}

export interface ShippingAddressType {
  id: number;
  name: string;
}

export interface ShippingSizeType {
  id: number;
  name: string;
}

export interface PackageType {
  id: number;
  name: string;
}

export interface Warehouse {
  id: number;
  area: string;
  row: string;
  bay: string;
  level: string;
  bin: string;
  capacity: string;
  total_packages: number;
  description: string;
}

export interface Customer {
  id?: number | null;
  user_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  shipping_code?: string | null;
  packages_count?: number | null;
}

export interface ReceivingState {
  currentStep: number;
  currentLabel: string | null;
  customerCode: string | null;
  shippingAddress: ShippingAddressType | null;
  labelId: number | null;
  labelWarehouse: string | null;
  carrierTracking: string | null;
  carrier: CarrierType | null;
  warehouseLocationId: number | null;
  warehouse: Warehouse | null;
  customer: Customer | null;
  capturedImages: string[];
  arrivalTime: string | null;
  deadlineTime: string | null;
  weight: number | null;
  dimension: string | null;
  sender_name: string | null;
  shipping_size: ShippingSizeType | null;
  package_type: PackageType | null;
  scannedItems: ReceivingState[]; // Array of scanned items
}

export interface ReceivingRootState {
  receiving: ReceivingState;
}
