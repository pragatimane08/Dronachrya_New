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
      
      // Responsive styles for buttons based on screen size
      const screenWidth = window.innerWidth;
      buttons.forEach((btn) => {
        if (btn) {
          btn.style.backgroundColor = "transparent";
          btn.style.color = "black";
          btn.style.border = "1px solid #ccc";
          btn.style.borderRadius = "9999px";
          btn.style.fontWeight = "500";
          btn.style.cursor = "pointer";
          btn.style.transition = "all 0.2s ease";
          btn.style.display = "inline-flex";
          btn.style.alignItems = "center";
          btn.style.justifyContent = "center";
          
          // Screen size specific styling
          if (screenWidth <= 320) {
            // Very small phones (Nokia 3310, old phones)
            btn.style.padding = "4px 6px";
            btn.style.fontSize = "10px";
            btn.style.marginRight = "2px";
          } else if (screenWidth <= 375) {
            // Small phones (iPhone SE, small Androids)
            btn.style.padding = "5px 8px";
            btn.style.fontSize = "11px";
            btn.style.marginRight = "3px";
          } else if (screenWidth <= 768) {
            // Regular phones and small tablets
            btn.style.padding = "6px 12px";
            btn.style.fontSize = "12px";
            btn.style.marginRight = "5px";
          } else {
            // Desktop and large tablets
            btn.style.padding = "8px 20px";
            btn.style.fontSize = "14px";
            btn.style.marginRight = "10px";
          }
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
        <p className="text-sm">Are you sure you want to delete this class?</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            onClick={() => {
              deleteClass(id);
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 min-h-[36px]"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-400 min-h-[36px]"
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
      <div className="event-content-responsive">
        <div className="event-title">{eventInfo.event.title}</div>

        <div className="event-field student-field">
          <strong>Student:</strong> <span>{student}</span>
        </div>

        <div className="event-field tutor-field">
          <strong>Tutor:</strong> <span>{tutor}</span>
        </div>

        <div className="event-field subject-field">
          <strong>Subject:</strong> <span>{subject}</span>
        </div>

        <div className="event-field status-field">
          <strong>{type === "demo" ? "Demo" : "Status"}:</strong> <span>{status}</span>
        </div>

        <div className={`event-field mode-field ${mode.toLowerCase() === "online" ? "online" : "offline"}`}>
          <strong>Mode:</strong> <span>{mode}</span>
        </div>

        {zoomLink && zoomLink !== "#" && (
          <div className="zoom-link">
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="join-link"
            >
              Join Class
            </a>
          </div>
        )}

        <div className="event-actions">
          <FaTrash
            className="delete-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(eventInfo.event.id);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <ToastContainer />
      <p className="welcome-text">
        Welcome back! Here's what's happening with your classes!
      </p>

      <div className="calendar-wrapper">
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

      {/* <style jsx global>{` */}
      <style>{`
        .calendar-container {
          padding: 1rem;
          background: white;
          min-height: 100vh;
        }

        .welcome-text {
          margin-bottom: 1rem;
          color: #666;
          font-size: 0.875rem;
        }

        .calendar-wrapper {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          overflow-x: auto;
        }

        .event-content-responsive {
          font-size: 10px;
          padding: 6px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          width: 100%;
          min-height: 120px;
        }

        .event-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
          font-size: 11px;
        }

        .event-field {
          margin-bottom: 3px;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 9px;
          line-height: 1.2;
        }

        .event-field strong {
          font-weight: 600;
        }

        .student-field {
          background: #dbeafe;
          color: #1e40af;
        }

        .tutor-field {
          background: #dcfce7;
          color: #166534;
        }

        .subject-field {
          background: #fed7aa;
          color: #c2410c;
        }

        .status-field {
          background: #e9d5ff;
          color: #7c3aed;
        }

        .mode-field.online {
          background: #dbeafe;
          color: #1e40af;
        }

        .mode-field.offline {
          background: #f3f4f6;
          color: #374151;
        }

        .zoom-link {
          margin-top: 4px;
        }

        .join-link {
          color: #2563eb;
          text-decoration: underline;
          font-size: 9px;
          word-break: break-all;
        }

        .event-actions {
          display: flex;
          justify-content: flex-start;
          gap: 8px;
          margin-top: 4px;
          padding-top: 2px;
          border-top: 1px solid #e5e7eb;
        }

        .delete-icon {
          color: #ef4444;
          cursor: pointer;
          font-size: 12px;
          transition: color 0.2s;
        }

        .delete-icon:hover {
          color: #dc2626;
        }

        /* Comprehensive responsive styles for all devices */
        
        /* iPad Pro and large tablets (1024px and up) */
        @media (min-width: 1024px) {
          .calendar-container {
            padding: 2rem;
          }

          .welcome-text {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .calendar-wrapper {
            padding: 1.5rem;
          }

          .event-content-responsive {
            font-size: 12px;
            padding: 8px;
            min-height: 140px;
          }

          .event-title {
            font-size: 13px;
            margin-bottom: 6px;
          }

          .event-field {
            font-size: 11px;
            margin-bottom: 4px;
            padding: 3px 6px;
          }

          .join-link {
            font-size: 11px;
          }

          .delete-icon {
            font-size: 14px;
          }

          .fc-button {
            font-size: 14px !important;
            padding: 8px 16px !important;
          }

          .fc-title {
            font-size: 20px !important;
          }
        }
        
        /* iPad and medium tablets (768px - 1023px) */
        @media (max-width: 1023px) and (min-width: 768px) {
          .calendar-container {
            padding: 1.5rem;
          }

          .welcome-text {
            font-size: 0.9375rem;
            margin-bottom: 1.25rem;
          }

          .calendar-wrapper {
            padding: 1.25rem;
          }

          .event-content-responsive {
            font-size: 11px;
            padding: 7px;
            min-height: 130px;
          }

          .event-title {
            font-size: 12px;
            margin-bottom: 5px;
          }

          .event-field {
            font-size: 10px;
            margin-bottom: 3px;
            padding: 2px 5px;
          }

          .join-link {
            font-size: 10px;
          }

          .delete-icon {
            font-size: 13px;
          }

          .fc-header-toolbar {
            flex-direction: row;
            justify-content: space-between;
            gap: 10px;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .fc-button {
            font-size: 13px !important;
            padding: 6px 12px !important;
            margin: 2px !important;
          }
          
          .fc-title {
            font-size: 18px !important;
          }
          
          .fc-daygrid-day-number {
            font-size: 14px;
          }
          
          .fc-col-header-cell {
            font-size: 13px;
            padding: 6px 4px;
          }
          
          .fc-daygrid-day-frame {
            min-height: 120px;
          }
        }
        
        /* Large phones and small tablets (481px - 767px) */
        @media (max-width: 767px) and (min-width: 481px) {
          .calendar-container {
            padding: 1rem;
          }

          .welcome-text {
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }

          .calendar-wrapper {
            padding: 0.75rem;
          }

          .event-content-responsive {
            font-size: 10px;
            padding: 6px;
            min-height: 110px;
          }

          .event-title {
            font-size: 11px;
            margin-bottom: 4px;
          }

          .event-field {
            font-size: 9px;
            margin-bottom: 2px;
            padding: 2px 4px;
          }

          .join-link {
            font-size: 9px;
          }

          .delete-icon {
            font-size: 12px;
          }

          .fc-header-toolbar {
            flex-direction: column;
            gap: 8px;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
          }
          
          .fc-button {
            font-size: 12px !important;
            padding: 5px 10px !important;
            margin: 2px !important;
            min-width: 60px;
          }
          
          .fc-title {
            font-size: 16px !important;
            margin: 5px 0;
            text-align: center;
          }
          
          .fc-daygrid-day-number {
            font-size: 12px;
          }
          
          .fc-col-header-cell {
            font-size: 11px;
            padding: 4px 2px;
          }
          
          .fc-daygrid-day-frame {
            min-height: 100px;
          }
        }
        
        /* Standard phones (376px - 480px) - iPhone 6/7/8, Samsung Galaxy */
        @media (max-width: 480px) and (min-width: 376px) {
          .calendar-container {
            padding: 0.75rem;
          }

          .welcome-text {
            font-size: 0.8125rem;
            margin-bottom: 0.875rem;
          }

          .calendar-wrapper {
            padding: 0.5rem;
          }

          .event-content-responsive {
            font-size: 9px;
            padding: 5px;
            min-height: 95px;
          }

          .event-title {
            font-size: 10px;
            margin-bottom: 3px;
          }

          .event-field {
            font-size: 8px;
            margin-bottom: 2px;
            padding: 1px 3px;
          }

          .join-link {
            font-size: 8px;
          }

          .delete-icon {
            font-size: 11px;
          }

          .fc-header-toolbar {
            flex-direction: column;
            gap: 6px;
            padding: 5px 0;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
          }
          
          .fc-button {
            font-size: 11px !important;
            padding: 4px 8px !important;
            margin: 1px !important;
            min-width: 50px;
            border-radius: 15px !important;
          }
          
          .fc-title {
            font-size: 14px !important;
            margin: 3px 0;
            text-align: center;
          }
          
          .fc-col-header-cell {
            font-size: 10px;
            padding: 3px 1px;
            font-weight: 600;
          }
          
          .fc-daygrid-day-number {
            font-size: 11px;
            padding: 2px;
          }
          
          .fc-daygrid-day-frame {
            min-height: 90px;
          }
        }
        
        /* Small phones (321px - 375px) - iPhone SE, older iPhones */
        @media (max-width: 375px) and (min-width: 321px) {
          .calendar-container {
            padding: 0.5rem;
          }

          .welcome-text {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .calendar-wrapper {
            padding: 0.375rem;
          }

          .event-content-responsive {
            font-size: 8px;
            padding: 4px;
            min-height: 80px;
          }

          .event-title {
            font-size: 9px;
            margin-bottom: 2px;
          }

          .event-field {
            font-size: 7px;
            margin-bottom: 1px;
            padding: 1px 2px;
          }

          .join-link {
            font-size: 7px;
          }

          .delete-icon {
            font-size: 10px;
          }

          .fc-header-toolbar {
            flex-direction: column;
            gap: 5px;
            padding: 3px 0;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 3px;
          }
          
          .fc-button {
            font-size: 10px !important;
            padding: 3px 6px !important;
            margin: 1px !important;
            min-width: 45px;
            border-radius: 12px !important;
          }
          
          .fc-title {
            font-size: 13px !important;
            margin: 2px 0;
            text-align: center;
            font-weight: 600;
          }
          
          .fc-col-header-cell {
            font-size: 9px;
            padding: 2px 1px;
            font-weight: 600;
          }
          
          .fc-daygrid-day-number {
            font-size: 10px;
            padding: 1px;
          }
          
          .fc-daygrid-day-frame {
            min-height: 75px;
          }
        }
        
        /* Very small phones (240px - 320px) - Nokia, very old phones */
        @media (max-width: 320px) {
          .calendar-container {
            padding: 0.25rem;
          }

          .welcome-text {
            font-size: 0.6875rem;
            margin-bottom: 0.5rem;
          }

          .calendar-wrapper {
            padding: 0.25rem;
          }

          .event-content-responsive {
            font-size: 7px;
            padding: 3px;
            min-height: 65px;
          }

          .event-title {
            font-size: 8px;
            margin-bottom: 1px;
          }

          .event-field {
            font-size: 6px;
            margin-bottom: 1px;
            padding: 1px;
          }

          .join-link {
            font-size: 6px;
          }

          .delete-icon {
            font-size: 9px;
          }

          .fc-header-toolbar {
            flex-direction: column;
            gap: 4px;
            padding: 2px 0;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 2px;
          }
          
          .fc-button {
            font-size: 9px !important;
            padding: 2px 4px !important;
            margin: 1px !important;
            min-width: 35px;
            border-radius: 10px !important;
          }
          
          .fc-title {
            font-size: 11px !important;
            margin: 1px 0;
            text-align: center;
            font-weight: 600;
            line-height: 1.2;
          }
          
          .fc-col-header-cell {
            font-size: 8px;
            padding: 1px;
            font-weight: 600;
          }
          
          .fc-daygrid-day-number {
            font-size: 9px;
            padding: 1px;
          }
          
          .fc-daygrid-day-frame {
            min-height: 60px;
          }
        }
        
        /* Landscape orientation adjustments */
        @media screen and (orientation: landscape) and (max-height: 500px) {
          .fc-header-toolbar {
            flex-direction: row !important;
            justify-content: space-between;
            gap: 5px;
          }
          
          .fc-toolbar-chunk {
            gap: 3px;
          }
          
          .fc-button {
            padding: 2px 6px !important;
            font-size: 10px !important;
          }
          
          .fc-title {
            font-size: 12px !important;
            margin: 0;
          }
          
          .fc-daygrid-day-frame {
            min-height: 50px;
          }

          .event-content-responsive {
            min-height: 50px;
            font-size: 7px;
            padding: 2px;
          }

          .event-title {
            font-size: 8px;
            margin-bottom: 1px;
          }

          .event-field {
            font-size: 6px;
            margin-bottom: 0.5px;
            padding: 0.5px 1px;
          }
        }
        
        /* Touch-friendly improvements */
        @media (pointer: coarse) {
          .fc-button {
            min-height: 32px;
            min-width: 32px;
          }
          
          .delete-icon {
            min-height: 20px;
            min-width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.1);
          }
          
          .fc-daygrid-day-number {
            min-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .event-content-responsive {
            border-width: 0.5px;
          }

          .event-actions {
            border-top-width: 0.5px;
          }
        }

        /* Toast container responsive positioning */
        .Toastify__toast-container {
          width: auto;
          min-width: 280px;
        }

        @media (max-width: 480px) {
          .Toastify__toast-container {
            left: 0.5rem;
            right: 0.5rem;
            width: auto;
            min-width: auto;
          }

          .Toastify__toast {
            margin-bottom: 0.5rem;
            border-radius: 8px;
            font-size: 14px;
            padding: 12px;
          }
        }

        @media (max-width: 320px) {
          .Toastify__toast-container {
            left: 0.25rem;
            right: 0.25rem;
          }

          .Toastify__toast {
            font-size: 12px;
            padding: 10px;
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyClasses;