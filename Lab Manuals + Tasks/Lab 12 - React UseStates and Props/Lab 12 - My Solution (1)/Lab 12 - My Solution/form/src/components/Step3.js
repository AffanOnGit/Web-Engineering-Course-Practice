import React from 'react';

const Step3 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-step">
      <h2>Professional Information</h2>
      <input
        type="text"
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Current Occupation"
        required
      />
      {errors.occupation && <span className="error">{errors.occupation}</span>}

      <input
        type="number"
        name="yearsExperience"
        value={formData.yearsExperience}
        onChange={handleChange}
        placeholder="Years of Experience"
        required
      />
      {errors.yearsExperience && <span className="error">{errors.yearsExperience}</span>}

      <input
        type="text"
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills (comma-separated)"
        required
      />
      {errors.skills && <span className="error">{errors.skills}</span>}

      <input
        type="url"
        name="linkedinProfile"
        value={formData.linkedinProfile}
        onChange={handleChange}
        placeholder="LinkedIn Profile URL (optional)"
      />
    </div>
  );
};

export default Step3;
