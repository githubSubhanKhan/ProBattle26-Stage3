import React, { useState, useEffect } from "react";
import { ProviderSearchBar } from "../components/ui/ProviderSearchBar";
import { ServiceCard } from "../components/ui/ServiceCard";
import { ServiceModal } from "../components/ui/ServiceModal";
import { AddServiceModal } from "../components/ui/AddServiceModal";
import { Service } from "../config/types";
import { useNavigate } from "react-router-dom";
import { getServices, searchNearbyServices, updateUserLocation } from "../services/servicesAPI";

export const ProviderDashboard: React.FC = () => {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const navigate = useNavigate();
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }),
        err => reject(err)
      );
    });
  };

  // Auto-update location for existing users
  useEffect(() => {
    const ensureUserLocation = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        const token = localStorage.getItem("token");
        
        // If user has no location, get it and update
        if (!user.latitude && !user.longitude && token) {
          try {
            const { lat, lng } = await getUserLocation();
            await updateUserLocation(lat, lng, token);
            
            // Update localStorage
            user.latitude = lat;
            user.longitude = lng;
            localStorage.setItem("user", JSON.stringify(user));
          } catch (geoErr) {
            console.warn("Geolocation permission denied or unavailable");
          }
        }
      } catch (err) {
        console.warn("Could not auto-update user location:", err);
      }
    };
    
    ensureUserLocation();
  }, []);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        if (!nearbyOnly) {
          const services = await getServices();
          setAllServices(services);
          setFilteredServices(services);
        } else {
          const { lat, lng } = await getUserLocation();
          const services = await searchNearbyServices(lat, lng, radiusKm);
          setAllServices(services);
          setFilteredServices(services);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [nearbyOnly, radiusKm]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === '') {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleAddNewService = (service: Service) => {
    const updatedServices = [service, ...allServices];
    setAllServices(updatedServices);
    setFilteredServices(updatedServices);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: "#F8FFE5" }}>
        <p className="text-xl" style={{ color: '#FFA500' }}>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F8FFE5" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#FFA500' }}>
            Provider Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold transition"
            style={{ backgroundColor: "#FFA500", color: "#fff" }}
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <ProviderSearchBar
            onSearch={handleSearch}
            onAddService={handleAddService}
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nearbyOnly}
              onChange={e => setNearbyOnly(e.target.checked)}
            />
            Show nearby services only
          </label>

          {nearbyOnly && (
            <select
              value={radiusKm}
              onChange={e => setRadiusKm(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => setSelectedService(service)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No services found</p>
          )}
        </div>

        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            showBookButton={false}
          />
        )}

        {showAddModal && (
          <AddServiceModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddNewService}
          />
        )}
      </div>
    </div>
  );
};