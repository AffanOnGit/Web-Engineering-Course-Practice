import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import ProgressBar from './ProgressBar';
import './Form.css'; // Add styles including notification CSS

const Form = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        profilePicture: null,
        phoneNumber: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        occupation: '',
        yearsOfExperience: '',
        skills: [],
        linkedIn: '',
        username: '',
        password: '',
        confirmPassword: '',
        notifications: [],
        terms: false,
        privacyPolicy: false,
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) setFormData(savedData);
    }, []);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const validateStep = () => {
        const newErrors = {};

        // Step 1: Personal Information Validation
        if (step === 1) {
            if (!formData.firstName || formData.firstName.length < 2 || formData.firstName.length > 50) {
                newErrors.firstName = 'First Name must be between 2 and 50 characters.';
            }
            if (!formData.lastName || formData.lastName.length < 2 || formData.lastName.length > 50) {
                newErrors.lastName = 'Last Name must be between 2 and 50 characters.';
            }
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address.';
            }
        }

        // Step 2: Contact Information Validation
        if (step === 2) {
            if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
                newErrors.phoneNumber = 'Phone Number must be valid.';
            }
            if (!formData.addressLine1 || formData.addressLine1.length < 5) {
                newErrors.addressLine1 = 'Address Line 1 must be at least 5 characters.';
            }
            if (!formData.city) {
                newErrors.city = 'City is required.';
            }
            if (!formData.state) {
                newErrors.state = 'State/Province is required.';
            }
        }

        // Step 3: Professional Information Validation
        if (step === 3) {
            if (!formData.occupation) {
                newErrors.occupation = 'Occupation is required.';
            }
            if (!formData.skills || formData.skills.length < 2) {
                newErrors.skills = 'Please select at least 2 skills.';
            }
        }

        // Step 4: Account Preferences Validation
        if (step === 4) {
            if (!formData.username || formData.username.length < 5 || formData.username.length > 20) {
                newErrors.username = 'Username must be 5-20 characters long.';
            }
            if (!formData.password || formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters.';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match.';
            }
            if (!formData.terms) {
                newErrors.terms = 'You must accept the Terms and Conditions.';
            }
            if (!formData.privacyPolicy) {
                newErrors.privacyPolicy = 'You must accept the Privacy Policy.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const submitForm = () => {
        if (validateStep()) {
            setSubmitted(true);
            alert("Form submitted successfully!");
        }
    };

    return (
        <div className="form-container">
            <ProgressBar step={step} totalSteps={totalSteps} />
            {step === 1 && <Step1 formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 2 && <Step2 formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 3 && <Step3 formData={formData} setFormData={setFormData} errors={errors} />}
            {step === 4 && <Step4 formData={formData} setFormData={setFormData} errors={errors} />}

            <div className="navigation-buttons">
                <button onClick={prevStep} disabled={step === 1}>Previous</button>
                
                {step < totalSteps ? (
                    <button onClick={nextStep}>Next</button>
                ) : (
                    <button onClick={submitForm}>Submit</button>
                )}
            </div>

            {submitted && (
                <div className="notification success">
                    Form submitted successfully! Thank you for completing the form.
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="notification error">
                    <p>Please correct the following errors:</p>
                    <ul>
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Form;
