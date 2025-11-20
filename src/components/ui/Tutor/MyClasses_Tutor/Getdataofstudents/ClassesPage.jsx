// src/pages/ClassesPage.js
import React, { useState, useEffect } from "react";
import { groupService } from "../api/repository/groupService";
import BookdemoData from "../components/BookdemoData";
import GroupClassData from "../components/GroupClassData";

function ClassesPage() {
  const [individualClasses, setIndividualClasses] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("individual");

  const fetchIndividualClasses = async () => {
    try {
      const response = await groupService.getScheduledClasses();
      // Filter individual classes (you might need to adjust this based on your API response)
      const individual = response.classes?.filter(cls => !cls.group_id) || [];
      setIndividualClasses(individual);
    } catch (error) {
      console.error('Failed to fetch individual classes:', error);
    }
  };

  const fetchGroupClasses = async () => {
    try {
      const response = await groupService.getScheduledClasses();
      // Filter group classes (you might need to adjust this based on your API response)
      const group = response.classes?.filter(cls => cls.group_id) || [];
      setGroupClasses(group);
    } catch (error) {
      console.error('Failed to fetch group classes:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchIndividualClasses(), fetchGroupClasses()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const refreshData = async () => {
    if (activeTab === "individual") {
      await fetchIndividualClasses();
    } else {
      await fetchGroupClasses();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("individual")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "individual"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Individual Classes
            <span className="ml-2 bg-orange-100 text-orange-600 py-0.5 px-2 rounded-full text-xs">
              {individualClasses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("group")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "group"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Group Classes
            <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
              {groupClasses.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "individual" ? (
        <BookdemoData 
          classes={individualClasses} 
          onUpdate={refreshData}
          userRole="tutor" // or get from auth context
        />
      ) : (
        <GroupClassData 
          classes={groupClasses} 
          onUpdate={refreshData}
          userRole="tutor" // or get from auth context
        />
      )}
    </div>
  );
}

export default ClassesPage;