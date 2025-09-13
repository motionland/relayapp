import { Building } from "lucide-react";

interface CustomerHubCardProps {
  warehouse: string;
  address: string;
}

const CustomerHubCard: React.FC<CustomerHubCardProps> = ({
  warehouse,
  address,
}) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <div className="flex items-center gap-2 mb-1">
      <Building className="h-4 w-4 text-gray-400" />
      <p className="font-medium">Customer Hub Location</p>
    </div>
    <div className="pl-6">
      <p className="text-gray-700 font-medium">{warehouse}</p>
      <p className="text-gray-500 text-sm mt-1">{address}</p>
    </div>
  </div>
);

export default CustomerHubCard;
