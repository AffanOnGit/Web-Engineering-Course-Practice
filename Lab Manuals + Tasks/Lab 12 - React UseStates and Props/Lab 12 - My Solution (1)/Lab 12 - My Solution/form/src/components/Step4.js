// Inside Step4.js
import React from 'react';

const Step4 = ({ formData, setFormData, errors }) => {
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    return (
        <div className="form-step">
            <h2>Account Preferences</h2>
            
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
            />
            {errors.username && <span className="error">{errors.username}</span>}
            
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            {errors.password && <span className="error">{errors.password}</span>}
            
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            
            {/* Terms and Privacy Policy checkboxes */}
            <label>
                <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                />
                I accept the Terms and Conditions
            </label>
            {errors.terms && <span className="error">{errors.terms}</span>}
            
            <label>
                <input
                    type="checkbox"
                    name="privacyPolicy"
                    checked={formData.privacyPolicy}
                    onChange={handleChange}
                />
                I accept the Privacy Policy
            </label>
            {errors.privacyPolicy && <span className="error">{errors.privacyPolicy}</span>}
        </div>
    );
};

export default Step4;
