import React from "react";
import { Link } from "react-router-dom";

const RecentStudents = ({ recentStudents = [] }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
      <p className="text-sm text-gray-500 mb-4">Recent student registrations</p>

      {/* Responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Class</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 text-center text-gray-500"
                >
                  No recent students found.
                </td>
              </tr>
            ) : (
              recentStudents.map((student, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 font-medium">{student.name}</td>
                  <td>{student?.User?.email || "-"}</td>
                  <td>{student.class || "-"}</td>
                  <td>
                    {student.created_at
                      ? new Date(student.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Link to full list */}
   <Link
  to="/admin_manage_students"
  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
>
  View all students
</Link>

    </div>
  );
};

export default RecentStudents;

