import React from "react";
import "./App.css";

export default function StudentCard({ student }) {
  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>ID: {student.id}</p>
      <p className="Course">Course: {student.Course}</p>

            <span className={student.isActive ? "status active" : "status inactive"}>
        {student.isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
