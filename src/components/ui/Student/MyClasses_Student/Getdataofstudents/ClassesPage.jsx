import React, { useState, useEffect } from 'react';
import AllClassesData from './AllClassData';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState({
    id: 1, // This would come from your auth context
    role: 'student' // or 'tutor' or 'admin'
  });

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/classes/my-classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (classId, updates) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      const updatedClass = await response.json();
      
      // Update the class in local state
      setClasses(prevClasses => 
        prevClasses.map(cls => 
          cls.id === classId ? { ...cls, ...updatedClass.data } : cls
        )
      );

      return updatedClass;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-2">Manage your scheduled classes</p>
      </div>
      
      <AllClassesData 
        classes={classes}
        onUpdateClass={handleUpdateClass}
        userRole={user}
      />
    </div>
  );
}

export default ClassesPage;

