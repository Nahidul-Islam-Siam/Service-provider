'use client';

import { useParams, useRouter } from "next/navigation";
import { MapPin, Package, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetSingleShipmentQuery } from "@/redux/features/shipmentApi/shipmentApi";
import ReviewModal from "@/components/Modal/ReviewsModal";
import { useState } from "react";
import { useGetMeQuery } from "@/redux/features/user";

export default function ShipmentDetails() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const { id } = useParams();
  const router = useRouter();

  const { data: singleShipment, isLoading, error } = useGetSingleShipmentQuery(id as string, {
    skip: !id,
  });

  console.log(singleShipment, "🚚 Single Shipment Data");

  const { data: userData } = useGetMeQuery();

  const shipmentID = singleShipment?.data?.id;
  const userID = userData?.data?.id;

  console.log("🚚 Shipment ID:", shipmentID);
  if (isLoading) {
    return <div className="text-center mt-10 text-xl text-gray-500">Loading shipment details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl text-red-500">Failed to load shipment details.</div>;
  }

  if (!singleShipment?.data) {
    return <div className="text-center mt-10 text-xl text-red-500">Shipment not found.</div>;
  }

  const shipment = singleShipment.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-4">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 px-4 py-2"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipment Details</h1>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2 text-sm font-medium">
            {shipment.status}
          </Badge>
        </div>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Origin & Destination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocationCard title="Origin" value={shipment.originLocation?.fullAddress || shipment.originLocation?.city} />
              <LocationCard title="Destination" value={shipment.destinationLocation?.fullAddress || shipment.destinationLocation?.city} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ItemCard label="Item Type" value={shipment.itemType} />
              <ItemCard label="Weight" value={shipment.itemDimension || 'N/A'} />
              <ItemCard label="Contents Category" value={shipment.contentsCategory || 'N/A'} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sender & Recipient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserCard label="Sender" value={shipment.senderDetails?.name || 'N/A'} />
              <UserCard label="Recipient" value={shipment.receiverDetails?.name || 'N/A'} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost</h2>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 inline-block">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-orange-600" />
                <span className="text-2xl font-bold text-gray-900">{shipment.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider</h2>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                  <Package size={18} className="text-orange-700" />
                </div>
                <span className="font-semibold text-gray-900">{shipment.sProviderID}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button
            onClick={showModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            Review Now
          </Button>
        </div>

        <ReviewModal
          visible={isModalVisible}
          onCancel={handleCancel}
          shipmentID={shipmentID}
          userID={userID}
        />
      </div>
    </div>
  );
}

function LocationCard({ title, value }: { title: string; value: string }) {
  return (
    <div className={`p-4 rounded-lg border ${title === 'Origin' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={18} className="text-orange-600" />
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <h3 className="font-semibold text-gray-900">{value}</h3>
    </div>
  );
}

function ItemCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Package size={18} className="text-orange-600" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function UserCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <User size={18} className="text-orange-600" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <h3 className="font-semibold text-gray-900">{value}</h3>
    </div>
  );
}
