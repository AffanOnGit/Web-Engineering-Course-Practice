import React from 'react';

const Step1 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-step">
      <h2>Personal Information</h2>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      {errors.firstName && <span className="error">{errors.firstName}</span>}

      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      {errors.lastName && <span className="error">{errors.lastName}</span>}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        placeholder="Date of Birth"
        required
      />
      {errors.dob && <span className="error">{errors.dob}</span>}

      <input
        type="file"
        name="profilePicture"
        accept="image/jpeg, image/png"
        onChange={(e) => handleChange({ target: { name: 'profilePicture', value: e.target.files[0] } })}
      />
      {errors.profilePicture && <span className="error">{errors.profilePicture}</span>}
    </div>
  );
};

export default Step1;
