import React, { useState } from "react";

const StudentForm = () => {
  const [formData, setFormData] = useState({ name: "", age: "", grade: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setFormData({ name: "", age: "", grade: "" });
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />
      <input
        name="grade"
        placeholder="Grade"
        value={formData.grade}
        onChange={handleChange}
      />
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;
