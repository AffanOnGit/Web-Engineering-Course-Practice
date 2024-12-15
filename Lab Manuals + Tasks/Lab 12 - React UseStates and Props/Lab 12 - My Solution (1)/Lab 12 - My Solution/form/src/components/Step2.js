import React from 'react';

const Step2 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Example lists for states/provinces and countries
  const states = ["California", "New York", "Texas", "Florida", "Illinois"];
  const countries = ["United States", "Canada", "United Kingdom", "Australia", "India"];

  return (
    <div className="form-step">
      <h2>Contact Information</h2>
      
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Primary Phone Number"
        required
      />
      {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}

      <input
        type="tel"
        name="secondaryPhoneNumber"
        value={formData.secondaryPhoneNumber}
        onChange={handleChange}
        placeholder="Secondary Phone Number (optional)"
      />

      <input
        type="text"
        name="addressLine1"
        value={formData.addressLine1}
        onChange={handleChange}
        placeholder="Address Line 1"
        required
      />
      {errors.addressLine1 && <span className="error">{errors.addressLine1}</span>}

      <input
        type="text"
        name="addressLine2"
        value={formData.addressLine2}
        onChange={handleChange}
        placeholder="Address Line 2 (optional)"
      />

      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      {errors.city && <span className="error">{errors.city}</span>}

      {/* State/Province dropdown */}
      <select
        name="state"
        value={formData.state}
        onChange={handleChange}
        required
      >
        <option value="">Select State/Province</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      {errors.state && <span className="error">{errors.state}</span>}

      {/* Country dropdown */}
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {errors.country && <span className="error">{errors.country}</span>}
    </div>
  );
};

export default Step2;
