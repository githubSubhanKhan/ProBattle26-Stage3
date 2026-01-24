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
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Add New Service</h2>
            <p className="text-orange-100 text-sm mt-1">Fill in the details to list your service</p>
          </div>
          <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Title */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="title"
                value={form.title}
                placeholder="e.g., Professional Web Development"
                className="w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={form.description}
                placeholder="Describe your service in detail..."
                rows={4}
                className="w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pl-10 pr-4 py-3 rounded-lg outline-none resize-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="category"
                  value={form.category}
                  placeholder="e.g., Technology"
                  className="w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price Type */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
              <select
                name="price_type"
                value={form.price_type}
                className="w-full border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pl-4 pr-4 py-3 rounded-lg outline-none transition-all"
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

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-lg text-gray-700 font-semibold hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleSubmit} className="px-8 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">Add Service</button>
        </div>
      </div>
    </div>
  );
};