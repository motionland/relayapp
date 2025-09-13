import { User } from "lucide-react";

interface CustomerInfoCardProps {
  name: string;
  metroId: string;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  name,
  metroId,
}) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <div className="flex items-center gap-2 mb-1">
      <User className="h-4 w-4 text-gray-400" />
      <p className="font-medium">Customer</p>
    </div>
    <p className="text-gray-700 pl-6">{name}</p>
    <div className="mt-2 pl-6 pt-2 border-t border-gray-200">
      <p className="text-sm text-gray-500">METRO ID:</p>
      <p className="font-mono text-gray-800 px-3 py-2 mt-1 text-4xl font-bold overflow-x-auto">
        {metroId}
      </p>
    </div>
  </div>
);

export default CustomerInfoCard;
