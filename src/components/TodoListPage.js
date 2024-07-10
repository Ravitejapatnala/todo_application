import React, { useState, useEffect } from 'react';
import './TodoListPage.css';
import { useNavigate } from 'react-router-dom';

const TodoListPage = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [activeActivityId, setActiveActivityId] = useState(null);

  const navigate= useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setActivities(activities.map(activity => {
        if (activity.id === activeActivityId && activity.status === 'In Progress') {
          return { ...activity, duration: new Date() - new Date(activity.startTime) };
        }
        return activity;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [activities, activeActivityId]);

  const addActivity = () => {
    if (newActivity.trim() !== '') {
      setActivities([...activities, {
        id: Date.now(),
        name: newActivity,
        status: 'Not Started',
        startTime: null,
        endTime: null,
        duration: 0,
      }]);
      setNewActivity('');
    }
  };

  const handleAction = (id, action) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        if (action === 'Start') {
          if (activeActivityId !== null && activeActivityId !== id) {
            return activity;
          }
          setActiveActivityId(id);
          return { ...activity, status: 'In Progress', startTime: new Date().toISOString(), endTime: null };
        } else if (action === 'End') {
          setActiveActivityId(null);
          return { ...activity, status: 'Completed', endTime: new Date().toISOString() };
        } else if (action === 'Resume') {
          if (activeActivityId !== null && activeActivityId !== id) {
            return activity;
          }
          setActiveActivityId(id);
          return { ...activity, status: 'In Progress', startTime: new Date().toISOString() };
        } else if (action === 'Pause') {
          setActiveActivityId(null);
          return { ...activity, status: 'Paused', endTime: new Date().toISOString() };
        }
      }
      return activity;
    }));
  };

  const showDetails = (activity) => {
    alert(`Activity: ${activity.name}\nStart Time: ${activity.startTime}\nEnd Time: ${activity.endTime}\nDuration: ${getDuration(activity.duration)}`);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
    if (activeActivityId === id) {
      setActiveActivityId(null);
    }
  };

  function logout(){
    navigate('/signin')
  }

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <div className="add-activity">
        <input
          type="text"
          placeholder="New Activity"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
        />
        <button onClick={addActivity}>Add Activity</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Activity Name</th>
            <th>Activity Duration</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity.id}>
              <td>{index + 1}</td>
              <td>{activity.name}</td>
              <td>{activity.duration ? getDuration(activity.duration) : 'N/A'}</td>
              <td>
                {activity.status === 'Not Started' && (
                  <button onClick={() => handleAction(activity.id, 'Start')}>Start</button>
                )}
                {activity.status === 'In Progress' && (
                  <>
                    <button onClick={() => handleAction(activity.id, 'Pause')}>Pause</button>
                    <button onClick={() => handleAction(activity.id, 'End')}>End</button>
                  </>
                )}
                {activity.status === 'Paused' && (
                  <button onClick={() => handleAction(activity.id, 'Resume')}>Resume</button>
                )}
                {activity.status === 'Completed' && (
                  <button onClick={() => showDetails(activity)}>Show Details</button>
                )}
                <button onClick={() => removeActivity(activity.id)}>Remove</button>
              </td>
              <td>{activity.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const getDuration = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default TodoListPage;