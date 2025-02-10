'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TasksPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'daily',
    requirement: {
      type: 'quiz_complete',
      count: 1
    },
    reward: {
      xp: 0,
      gems: 0,
      hearts: 0
    }
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/tasks', {
        method: editingTask ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask || newTask),
      });
      
      if (response.ok) {
        fetchTasks();
        setEditingTask(null);
        setNewTask({
          title: '',
          description: '',
          type: 'daily',
          requirement: {
            type: 'quiz_complete',
            count: 1
          },
          reward: {
            xp: 0,
            gems: 0,
            hearts: 0
          }
        });
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Görev Yönetimi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              value={editingTask?.title || newTask.title}
              onChange={(e) => editingTask 
                ? setEditingTask({...editingTask, title: e.target.value})
                : setNewTask({...newTask, title: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tür</label>
            <select
              value={editingTask?.type || newTask.type}
              onChange={(e) => editingTask
                ? setEditingTask({...editingTask, type: e.target.value})
                : setNewTask({...newTask, type: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="daily">Günlük</option>
              <option value="achievement">Başarı</option>
              <option value="special">Özel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            value={editingTask?.description || newTask.description}
            onChange={(e) => editingTask
              ? setEditingTask({...editingTask, description: e.target.value})
              : setNewTask({...newTask, description: e.target.value})
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">XP Ödülü</label>
            <input
              type="number"
              value={editingTask?.reward.xp || newTask.reward.xp}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingTask) {
                  setEditingTask({
                    ...editingTask,
                    reward: { ...editingTask.reward, xp: value }
                  });
                } else {
                  setNewTask({
                    ...newTask,
                    reward: { ...newTask.reward, xp: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Taş Ödülü</label>
            <input
              type="number"
              value={editingTask?.reward.gems || newTask.reward.gems}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingTask) {
                  setEditingTask({
                    ...editingTask,
                    reward: { ...editingTask.reward, gems: value }
                  });
                } else {
                  setNewTask({
                    ...newTask,
                    reward: { ...newTask.reward, gems: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Can Ödülü</label>
            <input
              type="number"
              value={editingTask?.reward.hearts || newTask.reward.hearts}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingTask) {
                  setEditingTask({
                    ...editingTask,
                    reward: { ...editingTask.reward, hearts: value }
                  });
                } else {
                  setNewTask({
                    ...newTask,
                    reward: { ...newTask.reward, hearts: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {editingTask && (
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {editingTask ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödüller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>XP: {task.reward.xp}</div>
                  <div>Taş: {task.reward.gems}</div>
                  <div>Can: {task.reward.hearts}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPanel;
