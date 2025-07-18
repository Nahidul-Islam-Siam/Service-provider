'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useGetAllShipmentQuery } from '@/redux/features/commonApi/createShipmentAPI/createShipmentApi';

// Define types for API response and UI mapping
interface ApiShipment {
  id: string;
  status: string;
  updatedAt: string;
  originLocation: { fullAddress: string; city: string; state: string; country: string };
  destinationLocation: { fullAddress: string; city: string; parish: string; country: string };
  sProviderID: string;
  itemType: string;
  pickupDate: string;
  deliveryDate: string;
}

interface Shipment {
  id: string;
  status: string;
  lastUpdated: string;
  origin: string;
  destination: string;
  carrier: string;
  itemType: string;
  estimatedDelivery: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Transit':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'Processing':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Pickup Scheduled':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'Delivered':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Customs Clearance':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const mapApiStatusToUiStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'in_transit': return 'In Transit';
    case 'processing': return 'Processing';
    case 'pickup_scheduled': return 'Pickup Scheduled';
    case 'delivered': return 'Delivered';
    case 'awaiting_pickup': return 'Pickup Scheduled';
    case 'customs_clearance': return 'Customs Clearance';
    default: return 'Unknown';
  }
};

const formatDeliveryDate = (pickupDate: string, deliveryDate: string): string => {
  return `${pickupDate} - ${deliveryDate}`;
};

export default function PastShipments() {
  const { data, isLoading, error } = useGetAllShipmentQuery('');

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading shipments...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Failed to load shipments.</div>;
  }

  // Filter only shipments with the selected statuses (case-insensitive)
  const filteredData = data?.data?.filter(
    (item: ApiShipment) =>
      ['DELIVERED', 'CANCELED'].includes(item.status.toLowerCase()) // Fixing the filter for case-insensitivity
  ) || [];

  // Map API data to Shipment data
  const shipments: Shipment[] = filteredData.map((item: ApiShipment) => {
    const formattedPickup = item.pickupDate ? new Date(item.pickupDate).toISOString() : '';
    const formattedDelivery = item.deliveryDate ? new Date(item.deliveryDate).toISOString() : '';

    return {
      id: item.id,
      status: mapApiStatusToUiStatus(item.status), // Map the API status to the UI-friendly status
      lastUpdated: `Last updated: ${new Date(item.updatedAt).toLocaleString()}`,
      origin:
        item.originLocation?.fullAddress ||
        `${item.originLocation?.city || ''}, ${item.originLocation?.state || ''}, ${item.originLocation?.country || ''}`,
      destination:
        item.destinationLocation?.fullAddress ||
        `${item.destinationLocation?.city || ''}, ${item.destinationLocation?.parish || ''}, ${item.destinationLocation?.country || ''}`,
      carrier: item.sProviderID || 'Unknown Carrier',
      itemType: item.itemType || 'Unknown Items',
      estimatedDelivery: formatDeliveryDate(formattedPickup, formattedDelivery),
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 mx-auto">
      {/* Header */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Past Shipments</h2>
          <p className="text-gray-600">Track and manage your international shipments</p>
        </div>

        {/* Shipment Cards */}
        <div className="space-y-6">
          {shipments.length === 0 ? (
            <p className="text-center text-gray-500">No shipments with the selected statuses.</p>
          ) : (
            shipments.map((shipment) => (
              <Card key={shipment.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      {/* Status and ID Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <Badge className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{shipment.lastUpdated}</span>
                        </div>
                      </div>

                      {/* Location and Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Origin */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Origin</div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{shipment.origin}</span>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destination</div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{shipment.destination}</span>
                          </div>
                        </div>

                        {/* Item Type */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Item Type</div>
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">{shipment.itemType}</span>
                          </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Delivery</div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(shipment.estimatedDelivery.split(' - ')[0]).toLocaleDateString()} - {new Date(shipment.estimatedDelivery.split(' - ')[1]).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Carrier */}
                      <div className="flex items-center space-x-3 pt-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{shipment.carrier}</span>
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="flex-shrink-0 pt-4 lg:pt-0 lg:pl-6">
                      <Link href={`/shipment-details/${shipment.id}`}>
                        <Button
                          variant="outline"
                          className="w-full lg:w-auto border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 px-6 py-2"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <Button variant="outline" className="px-8 py-3">
            Load More Shipments
          </Button>
        </div>
      </main>
    </div>
  );
}
