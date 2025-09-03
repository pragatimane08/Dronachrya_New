import React from "react";
import { Link } from "react-router-dom";

const RecentStudents = ({ recentStudents = [] }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
      <p className="text-sm text-gray-500 mb-4">Recent student registrations</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {recentStudents.map((student, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 font-medium">{student.name}</td>
              <td>{student?.User?.email || "-"}</td>
              <td>{student.class || "-"}</td>
              <td>{new Date(student.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        to="/admin_recent_student_show"
        state={{ students: recentStudents }} // <-- pass the data here
        className="mt-4 inline-block text-sm text-blue-600 hover:underline"
      >
        View all students
      </Link>
    </div>
  );
};

export default RecentStudents;

