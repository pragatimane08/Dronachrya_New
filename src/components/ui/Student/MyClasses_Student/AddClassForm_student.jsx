// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../../../api/apiclient";
// import { classRepository } from "../../../../api/repository/class.repository";
// import { toast, ToastContainer } from "react-toastify"; // ✅ Toast import
// import "react-toastify/dist/ReactToastify.css"; // ✅ Toast styles

// const AddClassForm_Student = () => {
//   const navigate = useNavigate();
//   const [tutors, setTutors] = useState([]);
//   const [formData, setFormData] = useState({
//     tutor_id: "",
//     name: "", // Class name (e.g., "Algebra - Linear Equations")
//     description: "",
//     date_time: "",
//   });

//   useEffect(() => {
//     const fetchTutors = async () => {
//       try {
//         const res = await apiClient.get("/users?role=tutor");
//         const tutorList =
//           res.data?.data?.map((tutor) => ({
//             id: tutor.id,
//             name: tutor.name || tutor.email || "Unnamed Tutor",
//           })) || [];
//         setTutors(tutorList);
//       } catch (err) {
//         console.error("Failed to fetch tutors:", err);
//         toast.error("Unable to fetch tutors"); // ✅ Toast error
//       }
//     };
//     fetchTutors();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const student_id = localStorage.getItem("user_id");

//     if (!formData.tutor_id || !formData.name || !formData.date_time || !student_id) {
//       toast.warn("Please fill all required fields."); // ✅ Toast warning
//       return;
//     }

//     try {
//       await classRepository.createClass({
//         name: formData.name,
//         tutor_id: formData.tutor_id,
//         student_id,
//         description: formData.description,
//         date_time: formData.date_time,
//         type: "regular",
//       });

//       toast.success("Class request sent successfully!"); // ✅ Toast success
//       setTimeout(() => {
//         navigate("/student_classes", { state: { refresh: true } });
//       }, 1500); // Give toast time to show
//     } catch (err) {
//       console.error("Submit error:", err);
//       toast.error(err?.response?.data?.message || "Failed to send class request"); // ✅ Toast error
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <ToastContainer /> {/* ✅ Ensure toast container is present */}
//       <form
//         onSubmit={handleSubmit}
//         className="relative bg-white border rounded-lg shadow p-6 w-full max-w-md"
//       >
//         <button
//           type="button"
//           onClick={() => navigate("/student_classes")}
//           className="absolute top-3 right-4 text-gray-500 text-xl hover:text-red-500"
//         >
//           &times;
//         </button>
//         <h2 className="text-lg font-semibold text-center text-blue-900 mb-6">
//           Request Class
//         </h2>

//         {/* Select Tutor */}
//         <div className="mb-4">
//           <label className="block font-medium mb-1">Select Tutor</label>
//           <select
//             name="tutor_id"
//             value={formData.tutor_id}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
//           >
//             <option value="">
//               {tutors.length === 0 ? "Loading tutors..." : "-- Select Tutor --"}
//             </option>
//             {tutors.map((tutor) => (
//               <option key={tutor.id} value={tutor.id}>
//                 {tutor.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Class Name */}
//         <div className="mb-4">
//           <label className="block font-medium mb-1">Class Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="e.g., Algebra - Linear Equations"
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Description */}
//         <div className="mb-4">
//           <label className="block font-medium mb-1">Message</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Any specific request?"
//             rows={3}
//             className="w-full border rounded px-3 py-2"
//           ></textarea>
//         </div>

//         {/* Date & Time */}
//         <div className="mb-6">
//           <label className="block font-medium mb-1">Class Date & Time</label>
//           <input
//             type="datetime-local"
//             name="date_time"
//             value={formData.date_time}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Submit Buttons */}
//         <div className="flex justify-center gap-4">
//           <button
//             type="button"
//             onClick={() => navigate("/student_classes")}
//             className="px-4 py-2 bg-gray-300 rounded"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
//           >
//             Send Request
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddClassForm_Student;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../api/apiclient";
import { classRepository } from "../../../../api/repository/class.repository";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddClassForm_Student = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [formData, setFormData] = useState({
    tutor_id: "",
    name: "",
    description: "",
    date_time: "",
    mode: "", // online or offline
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await apiClient.get("/users?role=tutor");
        const tutorList =
          res.data?.data?.map((tutor) => ({
            id: tutor.id,
            name: tutor.name || tutor.email || "Unnamed Tutor",
          })) || [];
        setTutors(tutorList);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        toast.error("Unable to fetch tutors");
      }
    };
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student_id = localStorage.getItem("user_id");

    if (
      !formData.tutor_id ||
      !formData.name ||
      !formData.date_time ||
      !formData.mode ||
      !student_id
    ) {
      toast.warn("Please fill all required fields.");
      return;
    }

    try {
      await classRepository.createClass({
        name: formData.name,
        tutor_id: formData.tutor_id,
        student_id,
        description: formData.description,
        date_time: formData.date_time,
        type: "regular", // fixed value
        mode: formData.mode, // online/offline selected by student
      });

      toast.success("Class request sent successfully!");
      setTimeout(() => {
        navigate("/student_classes", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to send class request");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border rounded-lg shadow p-6 w-full max-w-md"
      >
        <button
          type="button"
          onClick={() => navigate("/student_classes")}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-red-500"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-center text-blue-900 mb-6">
          Request Class
        </h2>

        {/* Select Tutor */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Select Tutor</label>
          <select
            name="tutor_id"
            value={formData.tutor_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">
              {tutors.length === 0 ? "Loading tutors..." : "-- Select Tutor --"}
            </option>
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Algebra - Linear Equations"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Message</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any specific request?"
            rows={3}
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        {/* Date & Time */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Class Date & Time</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Mode: Online / Offline */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Class Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Mode --</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/student_classes")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm_Student;


