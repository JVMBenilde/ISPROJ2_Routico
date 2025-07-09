import { useState } from 'react';

const CreateOrderPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    cargoWeight: '',
    cargoSize: '',
    pickupAddress: '',
    customerName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Cargo Weight</label>
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
                <label className="block mb-1 font-medium">Cargo Size</label>
                <input
                  type="text"
                  name="cargoSize"
                  value={form.cargoSize}
                  onChange={handleChange}
                  placeholder="Enter size"
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1 text-left font-medium">Pickup Address</label>
              <input
                type="text"
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                placeholder="Enter address"
                className="border rounded p-2 w-full"
              />
            </div>
          </>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="juandelacruz@email.com"
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
                pattern="^(\+63|0)?9\d{9}$" required
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                placeholder="Delivery Address"
                className="border rounded p-2 w-full"
              />
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
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {JSON.stringify(form, null, 2)}
            </pre>
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
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-black rounded"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => alert('Order submitted!')}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateOrderPage;
