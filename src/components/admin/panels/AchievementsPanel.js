'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiAward } from 'react-icons/fi';

const AchievementsPanel = () => {
  const [achievements, setAchievements] = useState([]);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [newAchievement, setNewAchievement] = useState({
    type: 'quiz_master',
    name: '',
    description: '',
    requirements: {
      type: 'quiz_complete',
      count: 1,
      categoryId: null
    },
    rewards: {
      xp: 0,
      gems: 0,
      hearts: 0,
      icon: ''
    }
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/admin/achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/achievements', {
        method: editingAchievement ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAchievement || newAchievement),
      });
      
      if (response.ok) {
        fetchAchievements();
        setEditingAchievement(null);
        setNewAchievement({
          type: 'quiz_master',
          name: '',
          description: '',
          requirements: {
            type: 'quiz_complete',
            count: 1,
            categoryId: null
          },
          rewards: {
            xp: 0,
            gems: 0,
            hearts: 0,
            icon: ''
          }
        });
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const handleDelete = async (achievementId) => {
    if (!confirm('Bu başarıyı silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/achievements?id=${achievementId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Başarı Yönetimi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Başarı Adı</label>
            <input
              type="text"
              value={editingAchievement?.name || newAchievement.name}
              onChange={(e) => editingAchievement 
                ? setEditingAchievement({...editingAchievement, name: e.target.value})
                : setNewAchievement({...newAchievement, name: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tür</label>
            <select
              value={editingAchievement?.type || newAchievement.type}
              onChange={(e) => editingAchievement
                ? setEditingAchievement({...editingAchievement, type: e.target.value})
                : setNewAchievement({...newAchievement, type: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="quiz_master">Quiz Ustası</option>
              <option value="streak_champion">Streak Şampiyonu</option>
              <option value="category_expert">Kategori Uzmanı</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            value={editingAchievement?.description || newAchievement.description}
            onChange={(e) => editingAchievement
              ? setEditingAchievement({...editingAchievement, description: e.target.value})
              : setNewAchievement({...newAchievement, description: e.target.value})
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gereksinim Türü</label>
            <select
              value={editingAchievement?.requirements.type || newAchievement.requirements.type}
              onChange={(e) => {
                const value = e.target.value;
                if (editingAchievement) {
                  setEditingAchievement({
                    ...editingAchievement,
                    requirements: { ...editingAchievement.requirements, type: value }
                  });
                } else {
                  setNewAchievement({
                    ...newAchievement,
                    requirements: { ...newAchievement.requirements, type: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="quiz_complete">Quiz Tamamlama</option>
              <option value="correct_answers">Doğru Cevap</option>
              <option value="streak">Streak</option>
              <option value="category_complete">Kategori Tamamlama</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gerekli Sayı</label>
            <input
              type="number"
              value={editingAchievement?.requirements.count || newAchievement.requirements.count}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingAchievement) {
                  setEditingAchievement({
                    ...editingAchievement,
                    requirements: { ...editingAchievement.requirements, count: value }
                  });
                } else {
                  setNewAchievement({
                    ...newAchievement,
                    requirements: { ...newAchievement.requirements, count: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">XP Ödülü</label>
            <input
              type="number"
              value={editingAchievement?.rewards.xp || newAchievement.rewards.xp}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingAchievement) {
                  setEditingAchievement({
                    ...editingAchievement,
                    rewards: { ...editingAchievement.rewards, xp: value }
                  });
                } else {
                  setNewAchievement({
                    ...newAchievement,
                    rewards: { ...newAchievement.rewards, xp: value }
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
              value={editingAchievement?.rewards.gems || newAchievement.rewards.gems}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingAchievement) {
                  setEditingAchievement({
                    ...editingAchievement,
                    rewards: { ...editingAchievement.rewards, gems: value }
                  });
                } else {
                  setNewAchievement({
                    ...newAchievement,
                    rewards: { ...newAchievement.rewards, gems: value }
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
              value={editingAchievement?.rewards.hearts || newAchievement.rewards.hearts}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingAchievement) {
                  setEditingAchievement({
                    ...editingAchievement,
                    rewards: { ...editingAchievement.rewards, hearts: value }
                  });
                } else {
                  setNewAchievement({
                    ...newAchievement,
                    rewards: { ...newAchievement.rewards, hearts: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">İkon URL</label>
          <input
            type="text"
            value={editingAchievement?.rewards.icon || newAchievement.rewards.icon}
            onChange={(e) => {
              if (editingAchievement) {
                setEditingAchievement({
                  ...editingAchievement,
                  rewards: { ...editingAchievement.rewards, icon: e.target.value }
                });
              } else {
                setNewAchievement({
                  ...newAchievement,
                  rewards: { ...newAchievement.rewards, icon: e.target.value }
                });
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {editingAchievement && (
            <button
              type="button"
              onClick={() => setEditingAchievement(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {editingAchievement ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başarı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gereksinimler</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ödüller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {achievements.map((achievement) => (
              <tr key={achievement._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={achievement.rewards.icon} 
                      alt={achievement.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{achievement.name}</div>
                      <div className="text-sm text-gray-500">{achievement.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {achievement.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {achievement.requirements.count} {achievement.requirements.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>XP: {achievement.rewards.xp}</div>
                  <div>Taş: {achievement.rewards.gems}</div>
                  <div>Can: {achievement.rewards.hearts}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingAchievement(achievement)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
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

export default AchievementsPanel;
