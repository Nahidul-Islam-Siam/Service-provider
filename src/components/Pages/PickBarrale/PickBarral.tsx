/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Button, Input, Table, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Papa from "papaparse";
import type { UploadProps } from "antd";
import { useAddBarrelMutation } from "@/redux/features/commonApi/barrelApi/barelApi";

interface InventoryItem {
  id: string;
  description: string;
  quantity: number;
  estimatedValue: number;
}

export default function PackABarrel() {
  const searchParams = useSearchParams();
  const shipmentID = searchParams.get("shippingId");

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "",
    estimatedValue: "",
  });
  const [customduty, setCustomDuty] = useState(0);
  const [addBarrel, { isLoading }] = useAddBarrelMutation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity && newItem.estimatedValue) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        description: newItem.description,
        quantity: parseInt(newItem.quantity),
        estimatedValue: parseFloat(newItem.estimatedValue),
      };
      setItems([...items, item]);
      setNewItem({ description: "", quantity: "", estimatedValue: "" });
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleApplyToShipment = async () => {
    if (!shipmentID) return message.error("Missing shipment ID.");
    if (items.length === 0) return message.warning("No items to submit.");

    const payload = {
      shipmentID,
      customduty,
      barrelList: items.map(({ description, quantity, estimatedValue }) => ({
        name: "Large Barrel",
        itemDescription: description,
        quantity,
        price: estimatedValue,
      })),
    };

    try {
      await addBarrel(payload).unwrap();
      message.success("Barrel submitted successfully!");
      setItems([]);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit barrel.");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleCsvUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      interface CsvRow {
        description?: string;
        quantity?: string;
        estimatedValue?: string;
      }

      interface PapaParseResults {
        data: CsvRow[];
        errors: any[];
        meta: any;
      }

      Papa.parse(file as File, {
        header: true,
        skipEmptyLines: true,
        complete: (results: PapaParseResults) => {
          const parsedItems = results.data;

          const csvItems: InventoryItem[] = parsedItems
            .map((row: CsvRow, index: number) => ({
              id: `${Date.now()}-${index}`,
              description: row.description || "",
              quantity: parseInt(row.quantity || "0"),
              estimatedValue: parseFloat(row.estimatedValue || "0"),
            }))
            .filter(
              (item) => item.description && item.quantity && item.estimatedValue
            );

          setItems((prev) => [...prev, ...csvItems]);
          message.success("CSV uploaded successfully!");
          onSuccess?.("ok");
        },
        error: (error: any) => {
          console.error(error);
          message.error("Failed to parse CSV.");
          onError?.(error as any);
        },
      });
    } catch (error) {
      console.error(error);
      message.error("Upload failed.");
      onError?.(error as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-8 py-10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 text-center sm:text-left">
            Pack a Barrel
          </h1>
          <p className="text-lg text-gray-600 text-center sm:text-left max-w-2xl">
            Create an inventory list for customs declaration and personal
            tracking.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How to use the inventory sheet
          </h2>
          <p className="text-gray-600 mb-3">
            Add items one by one or upload a CSV file to create a complete list
            of what&apos;s in your shipment.
          </p>
          <div className="text-sm italic text-[#FA8800] border-l-4 border-blue-200 pl-3 py-1">
            Note: The CSV file should have columns:{" "}
            <b>description, quantity, estimatedValue</b>
          </div>
        </div>

        {/* Add Items */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Add Items to Your Inventory
            </h3>
          </div>

          {/* Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="block text-sm text-gray-700 mb-1">
                Item Description
              </label>
              <Input
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="e.g. Women's clothing"
                size="large"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                placeholder="0"
                size="large"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm text-gray-700 mb-1">
                Estimated Value (USD)
              </label>
              <Input
                type="number"
                step="0.01"
                value={newItem.estimatedValue}
                onChange={(e) =>
                  setNewItem({ ...newItem, estimatedValue: e.target.value })
                }
                placeholder="0.00"
                size="large"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <Button
                onClick={handleAddItem}
                type="primary"
                block
                className="bg-[#FA8800] text-white font-semibold"
                disabled={
                  !newItem.description ||
                  !newItem.quantity ||
                  !newItem.estimatedValue
                }
                size="large"
              >
                Add Item
              </Button>
            </div>
          </div>

          {/* CSV Upload */}
          <div className="mt-8 border-t pt-6">
            <Upload.Dragger
              accept=".csv"
              customRequest={handleCsvUpload}
              showUploadList={false}
            >
              <p className="text-blue-600 font-semibold text-base">
                <InboxOutlined className="inline-block mr-2" />
                Click or drag CSV file to upload
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Only .csv files supported
              </p>
            </Upload.Dragger>
          </div>
        </div>

        {/* Inventory List */}
        {items.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between pb-4">
              <h3 className="text-lg text-gray-900 font-semibold">
                Your Inventory List
              </h3>
              <div className="text-sm text-gray-600">
                <span className="text-blue-600 font-semibold">
                  {totalItems} items total
                </span>
              </div>
            </div>

            <Table
              dataSource={items}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Item Description",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "center",
                },
                {
                  title: "Est. Value (USD)",
                  dataIndex: "estimatedValue",
                  key: "estimatedValue",
                  align: "right",
                  render: (value) => formatCurrency(value),
                },
                {
                  title: "Action",
                  key: "action",
                  align: "center",
                  render: (_, record) => (
                    <Button
                      onClick={() => handleDeleteItem(record.id)}
                      icon={<Trash2 className="w-4 h-4" />}
                      type="text"
                      danger
                      size="small"
                    />
                  ),
                },
              ]}
            />

            <div className="font-semibold text-right pt-4 text-lg">
              <span>Total: {formatCurrency(totalValue)}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md text-lg"
              onClick={handleApplyToShipment}
              loading={isLoading}
            >
              Apply to Current Shipment
            </Button>
            <Button
              className="border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-2 px-6 rounded-md text-lg"
              onClick={() => message.success("Barrel saved locally.")}
              disabled={items.length === 0}
            >
              Save Barrel
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">$</span>
              <Input
                type="number"
                value={customduty}
                onChange={(e) => setCustomDuty(Number(e.target.value))}
                className="w-28"
                step="0.01"
                min="0"
                size="large"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            Please note. This number is an estimate and can change based on
            regulatory changes or misrepresenting the contents of your barrel.
          </p>
        </div>
      </div>
    </div>
  );
}
