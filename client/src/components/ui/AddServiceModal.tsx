import React, { useState } from "react";
import { addService, AddServicePayload } from "../../services/servicesAPI";
import { X, Briefcase, FileText, Tag, DollarSign } from "lucide-react";
import { Service } from "../../config/types";

interface AddServiceModalProps {
  onClose: () => void;
  onAdd: (service: Service) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState<AddServicePayload>({
    title: "",
    description: "",
    category: "",
    price: 0,
    price_type: "HOURLY"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      if (!token) {
        alert("You must be logged in");
        return;
      }

      if (!form.title || !form.category || form.price <= 0) {
        alert("Please fill in all required fields with valid values");
        return;
      }

      const response = await addService(form, token);
      onAdd(response.service);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to add service");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all">
        {/* Header */}
        <div className="rounded-t-2xl p-6" style={{ backgroundColor: "#FFA500" }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Add New Service</h2>
              <p className="text-white text-opacity-90 text-sm mt-1">Fill in the details to list your service</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Service Title */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5" style={{ color: "#FFA500" }} />
              </div>
              <input
                name="title"
                value={form.title}
                placeholder="e.g., Professional Web Development"
                className="w-full border-2 border-gray-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200"
                onFocus={(e) => {
                  e.target.style.borderColor = "#FFA500";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5" style={{ color: "#FFA500" }} />
              </div>
              <textarea
                name="description"
                value={form.description}
                placeholder="Describe your service in detail..."
                rows={4}
                className="w-full border-2 border-gray-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200 resize-none"
                onFocus={(e) => {
                  e.target.style.borderColor = "#FFA500";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5" style={{ color: "#FFA500" }} />
                </div>
                <input
                  name="category"
                  value={form.category}
                  placeholder="e.g., Technology"
                  className="w-full border-2 border-gray-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FFA500";
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5" style={{ color: "#FFA500" }} />
                </div>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-gray-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#FFA500";
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price Type */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price Type
              </label>
              <select
                name="price_type"
                value={form.price_type}
                className="w-full border-2 border-gray-200 pl-4 pr-4 py-3 rounded-lg outline-none transition-all duration-200"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#FFA500";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onChange={handleChange}
              >
                <option value="HOURLY">Hourly</option>
                <option value="FIXED">Fixed</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Location is automatically set based on your profile location
          </p>
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 rounded-b-2xl border-t border-gray-200" style={{ backgroundColor: "#F8FFE5" }}>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{
                backgroundColor: "#ffffff",
                color: "#374151",
                border: "2px solid #e5e7eb"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-200"
              style={{
                backgroundColor: "#FFA500"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff8c00";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(255, 165, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFA500";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};