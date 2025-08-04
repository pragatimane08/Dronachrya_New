// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { apiClient } from "../../../../api/apiclient";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MyClasses = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [pendingDeleteId, setPendingDeleteId] = useState(null);

//   const fetchClassesFromAPI = async () => {
//     try {
//       const userId = localStorage.getItem("user_id");
//       if (!userId) {
//         toast.error("User ID not found.");
//         return;
//       }

//       const res = await apiClient.get("/classes", {
//         params: { user_id: userId },
//       });

//       const classData = res.data.classes || [];

//       const formatted = classData.map((cls) => ({
//         id: cls.id,
//         title: cls.type === "demo" ? "Demo is Scheduled" : cls.title || "Class",
//         date: cls.date_time?.split("T")[0],
//         extendedProps: {
//           student: cls.Student?.name || cls.student_name || "N/A",
//           tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
//           subject: cls.subject || "N/A",
//           status: cls.status || "Scheduled",
//           type: cls.type || "regular",
//           zoomLink: cls.zoom_link || "#",
//         },
//       }));

//       setEvents(formatted);
//     } catch (error) {
//       console.error("Error fetching classes:", error.response?.data || error.message);
//       toast.error("Failed to load classes.");
//     }
//   };

//   useEffect(() => {
//     fetchClassesFromAPI();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const addBtn = document.querySelector(".fc-addClass-button");
//       const todayBtn = document.querySelector(".fc-today-button");
//       const prevBtn = document.querySelector(".fc-prev-button");
//       const nextBtn = document.querySelector(".fc-next-button");

//       const buttons = [prevBtn, todayBtn, nextBtn, addBtn];
//       buttons.forEach((btn) => {
//         if (btn) {
//           btn.style.backgroundColor = "transparent";
//           btn.style.color = "black";
//           btn.style.border = "1px solid #ccc";
//           btn.style.borderRadius = "9999px";
//           btn.style.padding = "8px 20px";
//           btn.style.marginRight = "10px";
//           btn.style.fontWeight = "500";
//           btn.style.fontSize = "14px";
//           btn.style.cursor = "pointer";
//           btn.style.transition = "all 0.2s ease";
//           btn.style.display = "inline-flex";
//           btn.style.alignItems = "center";
//           btn.style.justifyContent = "center";
//         }
//       });

//       if (addBtn) {
//         addBtn.style.backgroundColor = "#2ec4b6";
//         addBtn.style.color = "white";
//         addBtn.style.border = "none";
//         addBtn.onmouseover = () => (addBtn.style.backgroundColor = "#26b2a6");
//         addBtn.onmouseleave = () => (addBtn.style.backgroundColor = "#2ec4b6");
//       }

//       clearInterval(interval);
//     }, 100);
//   }, []);

//   const handleEdit = (id) => {
//     const newTitle = prompt("Enter new class title:");
//     if (newTitle) {
//       setEvents((prev) =>
//         prev.map((e) => (e.id === id ? { ...e, title: newTitle } : e))
//       );
//       toast.success("Class title updated!");
//     }
//   };

//   const confirmDeleteToast = (id) => {
//     toast.info(
//       <div>
//         <p>Are you sure you want to delete this class?</p>
//         <div className="flex gap-4 mt-2">
//           <button
//             onClick={() => {
//               deleteClass(id);
//               toast.dismiss();
//             }}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//           >
//             Yes, Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss()}
//             className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>,
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//         closeButton: false,
//       }
//     );
//   };

//   const deleteClass = (id) => {
//     setEvents((prev) => prev.filter((e) => e.id !== id));
//     toast.success("Class deleted.");
//   };

//   const handleDelete = (id) => {
//     setPendingDeleteId(id);
//     confirmDeleteToast(id);
//   };

//   const renderEventContent = (eventInfo) => {
//     const { student, subject, status, type, tutor, zoomLink } =
//       eventInfo.event.extendedProps;

//     return (
//       <div className="text-xs space-y-1 p-1 bg-white rounded shadow w-full break-words">
//         <div className="bg-blue-100 text-teal-700 font-medium px-2 py-0.5 rounded w-full">
//           <span className="block">Student: {student}</span>
//         </div>
//         <div className="bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded w-full">
//           <span className="block">Tutor: {tutor}</span>
//         </div>
//         <div className="bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded w-full">
//           <span className="block">Subject: {subject}</span>
//         </div>
//         <div className="bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded w-full">
//           <span className="block">
//             {type === "demo" ? "Demo Class" : status}
//           </span>
//         </div>
//         {zoomLink && (
//           <a
//             href={zoomLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline text-xs block break-words"
//           >
//             Join Class
//           </a>
//         )}
//         <div className="flex justify-start gap-4 pt-1">
//           <FaEdit
//             className="text-green-600 cursor-pointer hover:text-green-800"
//             onClick={() => handleEdit(eventInfo.event.id)}
//           />
//           <FaTrash
//             className="text-red-500 cursor-pointer hover:text-red-700"
//             onClick={() => handleDelete(eventInfo.event.id)}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 bg-white min-h-screen">
//       <ToastContainer />
//       <p className="mb-4 text-gray-600 text-sm sm:text-base">
//         Welcome back! Here's what's happening with your classes!
//       </p>

//       <div className="bg-white rounded shadow p-4 overflow-x-auto">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           height="auto"
//           eventContent={renderEventContent}
//           customButtons={{
//             addClass: {
//               text: "+Add",
//               click: () => navigate("/add_class-form_student"),
//             },
//           }}
//           headerToolbar={{
//             left: "title",
//             center: "",
//             right: "prev today next addClass",
//           }}
//           buttonText={{
//             today: "Today",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default MyClasses;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
// import { FaEdit, FaTrash } from "react-icons/fa";
import { FaTrash } from "react-icons/fa"; // Removed FaEdit
import { apiClient } from "../../../../api/apiclient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyClasses = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const fetchClassesFromAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User ID not found.");
        return;
      }

      const res = await apiClient.get("/classes", {
        params: { user_id: userId },
      });

      const classData = res.data.classes || [];

      const formatted = classData.map((cls) => ({
        id: cls.id,
        title: cls.type === "demo" ? "Demo Class" : "Regular Class",
        date: cls.date_time?.split("T")[0],
        extendedProps: {
          student: cls.Student?.name || cls.student_name || "N/A",
          tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
          subject: cls.subject || "N/A",
          status: cls.status || "Scheduled",
          type: cls.type || "regular",
          zoomLink: cls.zoom_link || "#",
          mode: cls.mode || "offline",
        },
      }));

      setEvents(formatted);
    } catch (error) {
      console.error("Error fetching classes:", error.response?.data || error.message);
      toast.error("Failed to load classes.");
    }
  };

  useEffect(() => {
    fetchClassesFromAPI();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const addBtn = document.querySelector(".fc-addClass-button");
      const todayBtn = document.querySelector(".fc-today-button");
      const prevBtn = document.querySelector(".fc-prev-button");
      const nextBtn = document.querySelector(".fc-next-button");

      const buttons = [prevBtn, todayBtn, nextBtn, addBtn];
      buttons.forEach((btn) => {
        if (btn) {
          btn.style.backgroundColor = "transparent";
          btn.style.color = "black";
          btn.style.border = "1px solid #ccc";
          btn.style.borderRadius = "9999px";
          btn.style.padding = "8px 20px";
          btn.style.marginRight = "10px";
          btn.style.fontWeight = "500";
          btn.style.fontSize = "14px";
          btn.style.cursor = "pointer";
          btn.style.transition = "all 0.2s ease";
          btn.style.display = "inline-flex";
          btn.style.alignItems = "center";
          btn.style.justifyContent = "center";
        }
      });

      if (addBtn) {
        addBtn.style.backgroundColor = "#2ec4b6";
        addBtn.style.color = "white";
        addBtn.style.border = "none";
        addBtn.onmouseover = () => (addBtn.style.backgroundColor = "#26b2a6");
        addBtn.onmouseleave = () => (addBtn.style.backgroundColor = "#2ec4b6");
      }

      clearInterval(interval);
    }, 100);
  }, []);

  // const handleEdit = (id) => {
  //   const newTitle = prompt("Enter new class title:");
  //   if (newTitle) {
  //     setEvents((prev) =>
  //       prev.map((e) => (e.id === id ? { ...e, title: newTitle } : e))
  //     );
  //     toast.success("Class title updated!");
  //   }
  // };

  const confirmDeleteToast = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this class?</p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => {
              deleteClass(id);
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const deleteClass = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Class deleted.");
  };

  const handleDelete = (id) => {
    confirmDeleteToast(id);
  };

  const renderEventContent = (eventInfo) => {
    const { student, tutor, subject, status, type, zoomLink, mode } =
      eventInfo.event.extendedProps;

    return (
      <div className="text-xs space-y-1 p-2 bg-white rounded shadow w-full break-words border border-blue-300">
        <div className="font-semibold text-gray-800">{eventInfo.event.title}</div>

        <div className="bg-blue-100 text-green-800 px-2 py-1 rounded">
          <strong>Student:</strong> {student}
        </div>

        <div className="bg-green-100 text-green-900 px-2 py-1 rounded">
          <strong>Tutor:</strong> {tutor}
        </div>

        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
          <strong>Subject:</strong> {subject}
        </div>

        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
          <strong>{type === "demo" ? "Demo" : "Status"}:</strong> {status}
        </div>

        <div
          className={`px-2 py-1 rounded ${
            mode.toLowerCase() === "online"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <strong>Mode:</strong> {mode}
        </div>

        {zoomLink && zoomLink !== "#" && (
          <div>
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block"
            >
              Join Class
            </a>
          </div>
        )}

        <div className="flex justify-start gap-4 pt-1">
          {/* <FaEdit
            className="text-green-600 cursor-pointer hover:text-green-800"
            onClick={() => handleEdit(eventInfo.event.id)}
          /> */}
          <FaTrash
            className="text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => handleDelete(eventInfo.event.id)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <ToastContainer />
      <p className="mb-4 text-gray-600 text-sm sm:text-base">
        Welcome back! Here's what's happening with your classes!
      </p>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventContent={renderEventContent}
          customButtons={{
            addClass: {
              text: "+Add",
              click: () => navigate("/add_class-form_student"),
            },
          }}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev today next addClass",
          }}
          buttonText={{
            today: "Today",
          }}
        />
      </div>
    </div>
  );
};

export default MyClasses;
