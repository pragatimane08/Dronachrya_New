// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { apiClient } from "../../../../api/apiclient";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MyClasses = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);

//   const fetchClassesFromAPI = async () => {
//     try {
//       const userId = localStorage.getItem("user_id");
//       if (!userId) return console.error("User ID not found");

//       const res = await apiClient.get("/classes", {
//         params: { user_id: userId },
//       });

//       const classData = res.data.classes || [];

//       const formatted = classData.map((cls) => {
//         const isDemo = cls.type === "demo" || (!!cls.Student || !!cls.student_name);
//         return {
//           id: cls.id,
//           title: cls.name || cls.title || "Class",
//           date: cls.date_time?.split("T")[0],
//           extendedProps: {
//             student: cls.Student?.name || cls.student_name || "N/A",
//             tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
//             subject: cls.subject || "N/A",
//             status: cls.status || "Scheduled",
//             type: isDemo ? "demo" : "regular",
//             zoomLink: cls.zoom_link || "#",
//             mode: cls.mode || "online",
//           },
//         };
//       });

//       setEvents(formatted);
//       toast.success("Classes loaded successfully");
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//       toast.error("Failed to load classes");
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

//   // ✂️ Edit functionality disabled
//   // const handleEdit = (id) => {
//   //   const newTitle = prompt("Enter new class title:");
//   //   if (newTitle) {
//   //     setEvents((prev) =>
//   //       prev.map((e) => (e.id === id ? { ...e, title: newTitle } : e))
//   //     );
//   //     toast.success("Class title updated");
//   //   }
//   // };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this class?")) {
//       setEvents((prev) => prev.filter((e) => e.id !== id));
//       toast.success("Class deleted successfully");
//     }
//   };

//   const renderEventContent = (eventInfo) => {
//     const { student, subject, status, type, tutor, zoomLink, mode } =
//       eventInfo.event.extendedProps;

//     return (
//       <div className="text-xs space-y-1 p-1 bg-white">
//         <div className="text-sm font-bold text-gray-800">
//           {eventInfo.event.title}
//         </div>

//         <div className="flex flex-wrap gap-1">
//           <div className="bg-rose-100 text-rose-600 font-medium px-2 py-0.5 rounded w-fit">
//             Subject: {subject}
//           </div>
//           <div className="bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded w-fit">
//             Tutor: {tutor}
//           </div>
//           {type === "demo" && (
//             <div className="bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded w-fit">
//               Student: {student}
//             </div>
//           )}
//           <div
//             className={`font-semibold px-2 py-0.5 rounded w-fit ${
//               type === "demo"
//                 ? "bg-yellow-100 text-yellow-700"
//                 : "bg-purple-100 text-purple-700"
//             }`}
//           >
//             {type === "demo" ? "Demo Class" : "Regular Class"}
//           </div>
//           <div
//             className={`font-semibold px-2 py-0.5 rounded w-fit ${
//               mode === "online"
//                 ? "bg-cyan-100 text-cyan-700"
//                 : "bg-orange-100 text-orange-700"
//             }`}
//           >
//             Mode: {mode === "online" ? "Online" : "Offline"}
//           </div>
//         </div>

//         {zoomLink && zoomLink !== "#" && (
//           <a
//             href={zoomLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline text-xs block"
//           >
//             Join Zoom
//           </a>
//         )}

//         <div className="flex gap-2 pt-1">
//           {/* ✂️ Edit option commented */}
//           {/* <FaEdit
//             className="text-green-600 cursor-pointer hover:text-green-800"
//             onClick={() => handleEdit(eventInfo.event.id)}
//           /> */}
//           <FaTrash
//             className="text-red-500 cursor-pointer hover:text-red-700"
//             onClick={() => handleDelete(eventInfo.event.id)}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <ToastContainer position="top-right" autoClose={2000} />
//       <div className="bg-white rounded-lg shadow p-4">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           height="auto"
//           eventContent={renderEventContent}
//           customButtons={{
//             addClass: {
//               text: "+Add",
//               click: () => navigate("/add-class-form-tutor"),
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
import { FaTrash } from "react-icons/fa";
import { apiClient } from "../../../../api/apiclient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyClasses = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchClassesFromAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return console.error("User ID not found");

      const res = await apiClient.get("/classes", {
        params: { user_id: userId },
      });

      const classData = res.data.classes || [];

     const formatted = classData.map((cls) => {
  const isDemo = cls.type === "demo" || (!!cls.Student || !!cls.student_name);
  return {
    id: cls.id,
    title: isDemo ? "Demo Class" : "Regular Class",
    date: cls.date_time?.split("T")[0],
    extendedProps: {
      name: cls.name || cls.title || "Class",
      student: cls.Student?.name || cls.student_name || "N/A",
      tutor: cls.Tutor?.name || cls.tutor_name || "N/A",
      subject: cls.subject || "N/A",
      status: cls.status || "Scheduled",
      type: isDemo ? "demo" : "regular",
      zoomLink: cls.zoom_link || "#",
      mode: cls.mode || "online",
      time: cls.date_time
        ? new Date(cls.date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "N/A",
    },
  };
});

      setEvents(formatted);
      toast.success("Classes loaded successfully");
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await apiClient.delete(`/classes/${id}`);
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success("Class deleted successfully");
      } catch (error) {
        console.error("Error deleting class:", error);
        toast.error("Failed to delete class");
      }
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-event-content p-1">
        <div className="fc-event-main-frame">
          <div className="fc-event-time">{eventInfo.event.extendedProps.time}</div>
          <div className="fc-event-title-container">
            <div className="fc-event-title fc-sticky">
              {eventInfo.event.extendedProps.subject}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          eventClassNames={(arg) => {
            return arg.event.extendedProps.type === "demo" 
              ? "demo-class-event" 
              : "regular-class-event";
          }}
          customButtons={{
            addClass: {
              text: "+Add",
              click: () => navigate("/add-class-form-tutor"),
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

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">
              {selectedEvent.extendedProps.name}
            </h2>
            <p className="mb-1">
              <strong>Time:</strong> {selectedEvent.extendedProps.time}
            </p>
            <p className="mb-1">
              <strong>Subject:</strong> {selectedEvent.extendedProps.subject}
            </p>
            <p className="mb-1">
              <strong>Tutor:</strong> {selectedEvent.extendedProps.tutor}
            </p>
            {selectedEvent.extendedProps.type === "demo" && (
              <p className="mb-1">
                <strong>Student:</strong> {selectedEvent.extendedProps.student}
              </p>
            )}
            <p className="mb-1">
              <strong>Type:</strong>{" "}
              {selectedEvent.extendedProps.type === "demo"
                ? "Demo Class"
                : "Regular Class"}
            </p>
            <p className="mb-1">
              <strong>Mode:</strong> {selectedEvent.extendedProps.mode}
            </p>
            <p className="mb-3">
              <strong>Status:</strong> {selectedEvent.extendedProps.status}
            </p>

            {selectedEvent.extendedProps.zoomLink &&
              selectedEvent.extendedProps.zoomLink !== "#" && (
                <a
                  href={selectedEvent.extendedProps.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline block mb-3"
                >
                  Join Zoom
                </a>
              )}

            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={() => {
                  handleDelete(selectedEvent.id);
                  closeModal();
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
          margin: 1px 2px;
          padding: 2px;
        }
        
        .regular-class-event {
          background-color: #2ec4b6;
          border-color: #2ec4b6;
          color: white;
        }
        
        .demo-class-event {
          background-color: #ff9f1c;
          border-color: #ff9f1c;
          color: white;
        }
        
        .fc-event .fc-event-main {
          padding: 2px;
        }
        
        .fc-event .fc-event-time {
          font-weight: bold;
          font-size: 0.8em;
          margin-bottom: 2px;
        }
        
        .fc-event .fc-event-title {
          font-size: 0.8em;
          white-space: normal;
          line-height: 1.2;
        }
        
        .fc-daygrid-event {
          white-space: normal !important;
        }
      `}</style>
    </div>
  );
};

export default MyClasses;