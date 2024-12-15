import React, { useState, useEffect } from "react";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [students]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div>
      <h2>Student List</h2>
      {students.map((student) => (
        <div key={student._id}>
          <p>
            {student.name} - {student.grade} ({student.age} years)
          </p>
          <button onClick={() => deleteStudent(student._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
