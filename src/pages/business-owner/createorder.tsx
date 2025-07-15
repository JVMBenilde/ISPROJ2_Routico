import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Loader } from '@googlemaps/js-api-loader';

const CreateOrderPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    cargoWeight: '',
    cargoSizeCategory: '',
    pickupAddress: '',
    companyName: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    selectedTruckId: '',
    assignedDriver: '',
  });

  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const pickupRef = useRef<HTMLInputElement>(null);
  const deliveryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: ['places']
    });

    loader.load().then(() => {
      if (pickupRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(pickupRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setForm((prev) => ({ ...prev, pickupAddress: place.formatted_address || '' }));
        });
      }
      if (deliveryRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(deliveryRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setForm((prev) => ({ ...prev, deliveryAddress: place.formatted_address || '' }));
        });
      }
    });
  }, []);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch trucks');
        const data = await res.json();
        setTrucks(data);
      } catch (err) {
        console.error('Error loading trucks:', err);
      }
    };
    fetchTrucks();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/drivers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch drivers');
        const data = await res.json();
        setDrivers(data);
      } catch (err) {
        console.error('Error loading drivers:', err);
      }
    };
    fetchDrivers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!form.companyName || !form.phone || !form.pickupAddress || !form.deliveryAddress) {
          Swal.fire('All fields in Step 1 are required.', '', 'warning');
          return false;
        }
        break;
      case 2:
        if (!form.cargoWeight || !form.cargoSizeCategory) {
          Swal.fire('All fields in Step 2 are required.', '', 'warning');
          return false;
        }
        break;
      case 3:
        if (!form.deliveryDate || !form.deliveryTime) {
          Swal.fire('All fields in Step 3 are required.', '', 'warning');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitOrder = async () => {
    if (!validateStep()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: form.companyName,
          phone: form.phone,
          cargoWeight: form.cargoWeight,
          cargoSizeCategory: form.cargoSizeCategory,
          pickupAddress: form.pickupAddress,
          deliveryAddress: form.deliveryAddress,
          deliveryDate: form.deliveryDate,
          deliveryTime: form.deliveryTime,
          truckId: form.selectedTruckId,
          assignedDriverId: form.assignedDriver || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Backend error reply:', err);
        throw new Error(err.error || 'Order creation failed');
      }

      await res.json();
      Swal.fire('Order submitted successfully!', '', 'success');

      setStep(1);
      setForm({
        cargoWeight: '',
        cargoSizeCategory: '',
        pickupAddress: '',
        companyName: '',
        phone: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        selectedTruckId: '',
        assignedDriver: '',
      });
    } catch (err: any) {
      console.error('Submit error:', err);
      Swal.fire('Failed to submit order', err.message, 'error');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Juan Enterprises"
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  pattern="^(\+63|0)?9\\d{9}$"
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Pickup Address</label>
              <input
                type="text"
                name="pickupAddress"
                ref={pickupRef}
                placeholder="Enter pickup address"
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                ref={deliveryRef}
                placeholder="Enter delivery address"
                className="border rounded p-2 w-full"
              />
            </div>
          </>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Cargo Weight (Kg)</label>
              <input
                type="text"
                name="cargoWeight"
                value={form.cargoWeight}
                onChange={handleChange}
                placeholder="Enter weight"
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Cargo Size Category</label>
              <select
                name="cargoSizeCategory"
                value={form.cargoSizeCategory}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Select size</option>
                <option value="small">Small (e.g. Box, under 1m³)</option>
                <option value="medium">Medium (e.g. Furniture)</option>
                <option value="large">Large (e.g. Pallet, Appliances)</option>
                <option value="oversized">Oversized (e.g. Equipment, Vehicles)</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Delivery Time</label>
              <input
                type="time"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <>
            <p className="text-sm text-gray-500 mb-4">Review and confirm your order.</p>
            <div className="mb-4">
              <label className="block font-medium mb-1">Recommended Truck</label>
              {trucks.map((truck) => (
                <div key={truck.truck_id} className="flex items-center border rounded p-3 mb-2">
                  <input
                    type="radio"
                    name="selectedTruckId"
                    value={String(truck.truck_id)}
                    checked={form.selectedTruckId === String(truck.truck_id)}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">{truck.model}</div>
                    <div className="text-sm text-gray-500">
                      Plate: {truck.plate_number} — Capacity: {truck.capacity} kg
                    </div>
                  </div>
                  <span className="ml-auto text-green-600 font-medium">{truck.status}</span>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Assign Driver</label>
              <select
                name="assignedDriver"
                value={form.assignedDriver}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.driver_id} value={driver.driver_id}>
                    {driver.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border rounded p-4 text-sm">
              <div className="flex justify-between mb-1">
                <span>Cargo Weight:</span>
                <span>{form.cargoWeight} kg</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Cargo Size:</span>
                <span>{form.cargoSizeCategory}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Pickup:</span>
                <span>{form.pickupAddress}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Drop-off:</span>
                <span>{form.deliveryAddress}</span>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-1">Create Delivery Order</h2>
      <p className="text-sm text-gray-500 mb-6">Fill in the details to create a new delivery order</p>

      <div className="flex space-x-2 justify-center mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-8 h-2 rounded-full ${s <= step ? 'bg-gray-800' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>

      {renderStep()}

      <div className="mt-6 flex justify-between">
        {step > 1 ? (
          <button onClick={prevStep} className="px-4 py-2 bg-gray-200 text-black rounded">Back</button>
        ) : <div />}
        {step < 4 ? (
          <button onClick={nextStep} className="px-4 py-2 bg-black text-white rounded">Next</button>
        ) : (
          <button onClick={submitOrder} className="px-4 py-2 bg-green-600 text-white rounded">Create Order</button>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;
