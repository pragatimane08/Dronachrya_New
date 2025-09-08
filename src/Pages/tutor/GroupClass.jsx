import React, { useEffect, useState } from "react";
import { groupService } from "../../api/repository/groupService";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const response = await groupService.getUserGroups();
      setGroups(response.data.groups || []); // depends on backend response
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong>
              <ul>
                {group.Members?.map((m) => (
                  <li key={`${group.id}-${m.User.id}`}>
                    {m.User.name} ({m.User.role})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
