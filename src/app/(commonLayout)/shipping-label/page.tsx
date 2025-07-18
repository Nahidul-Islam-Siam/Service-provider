"use client";

import { useEffect, useState } from "react";
import { Download, Mail, Edit3, Check } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useGetSingleShipmentQuery } from "@/redux/features/shipmentApi/shipmentApi";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

export default function ShippingLabelPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [shipmentID, setShipmentID] = useState<string | null>(null);

  const router = useRouter();

  // 🔁 Fetch from localStorage once on client mount
  useEffect(() => {
    const storedId = localStorage.getItem("shipmentID");
    console.log("📦 Loaded shipmentId from localStorage:", storedId);
    setShipmentID(storedId);
  }, []);

  // ⏳ Only run API call when shipmentID is available
  const { data, isLoading, isError } = useGetSingleShipmentQuery(shipmentID!, {
    skip: !shipmentID,
  });

  const shipment = data?.data;

  console.log("📦 shipmentID:", shipmentID);
  console.log("🚚 Shipment Data:", shipment);

  const shipId = shipment?.id;
  console.log(shipId, "🚚 Shipmen ID");

  // Download shipping label as PDF
  const downloadPDF = () => {
    const element = document.getElementById("shipping-label");
    const options = {
      filename: "shipping_label.pdf",
      jsPDF: { unit: "mm", format: "a4" },
    };
    html2pdf().from(element).set(options).save();
  };

  if (!shipmentID) return <div>Loading shipment ID...</div>;
  if (isLoading) return <div>Loading shipment data...</div>;
  if (isError || !shipment) return <div>Failed to load shipment.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="md:text-3xl font-bold text-gray-900 mb-2">
            Shipping Label
          </h1>
          <p className="text-gray-600">
            Your label has been generated and is ready for download.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Label Preview
            </h2>

            <div
              id="shipping-label"
              className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-3xl mx-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-bold text-gray-900">BarrelLink</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">TRACKING NUMBER</div>
                  <div className="font-mono font-bold text-lg">
                    {shipment.shipmentID}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    FROM
                  </div>
                  <div className="text-gray-900">
                    <div className="font-semibold">
                      {shipment.senderDetails.name}
                    </div>
                    <div>{shipment.originLocation.city}</div>
                    <div>{shipment.originLocation.zip}</div>
                    <div>{shipment.address.country}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {shipment.senderDetails.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    TO
                  </div>
                  <div className="text-gray-900">
                    <div className="font-semibold">
                      {shipment.receiverDetails.name}
                    </div>
                    <div>{shipment.destinationLocation.city}</div>
                    <div>{shipment.destinationLocation.zip}</div>
                    <div>{shipment.address.country}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {shipment.receiverDetails.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    SHIPMENT TYPE
                  </div>
                  <div className="font-semibold text-gray-900">
                    {shipment.itemType}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    WEIGHT
                  </div>
                  <div className="font-semibold text-gray-900">65 lbs</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <QRCodeSVG
                    value={shipment.shipmentID}
                    size={100}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                Scan to track your shipment
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Label Actions
              </h3>
              <div className="space-y-4">
                <button
                  onMouseEnter={() => setIsHovered("download")}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={downloadPDF}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 ${
                    isHovered === "download"
                      ? "bg-gray-700 transform scale-105"
                      : ""
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>

                <button
                  onMouseEnter={() => setIsHovered("email")}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 ${
                    isHovered === "email" ? "transform scale-105" : ""
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Email Label
                </button>

                <button
                  onMouseEnter={() => setIsHovered("edit")}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-600 rounded-lg border-gray-300 border font-medium transition-all duration-200 hover:text-gray-800 hover:bg-gray-50 ${
                    isHovered === "edit" ? "transform scale-105" : ""
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Information
                </button>
              </div>
            </div>

            <div className="p-3 border border-gray-200 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Print Instructions
              </h3>
              {[
                'Print on standard 8.5" x 11" paper',
                "Ensure all barcodes are clearly visible",
                "Attach securely to your package with clear tape",
                "Do not fold over barcodes or QR codes",
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 pt-0">
            <button
              onMouseEnter={() => setIsHovered("continue")}
              onMouseLeave={() => setIsHovered(null)}
              className={`w-full px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-orange-600 ${
                isHovered === "continue" ? "transform scale-105 shadow-lg" : ""
              }`}
              onClick={() => {
                localStorage.removeItem("shipmentID"); // ✅ Clear shipmentID from localStorage
                router.push(`/pack-barrel?shippingId=${shipId}`); // ✅ Navigate to inventory page
              }}
            >
              Continue to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
