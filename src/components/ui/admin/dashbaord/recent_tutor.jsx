import React from "react";

const RecentTutor = ({ recentTutors = [], recentStudents = [] }) => {
  const statusStyle = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 p-2 -mt-5 mb-5">
      {/* Tutors Card */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Tutors</h2>
        <p className="text-sm text-gray-500 mb-4">Recent tutor registrations</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th>Name</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTutors.map((tutor, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 font-medium">{tutor.name}</td>
                <td>{tutor.subjects?.join(", ")}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusStyle[tutor.profile_status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tutor.profile_status}
                  </span>
                </td>
                <td>{new Date(tutor.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer">
          View all tutors
        </div>
      </div>

      {/* Students Card */}
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
        <div className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer">
          View all students
        </div>
      </div>
    </div>
  );
};

export default RecentTutor;