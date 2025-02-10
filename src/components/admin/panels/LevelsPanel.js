'use client';
import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

const LevelsPanel = () => {
  const [settings, setSettings] = useState({
    baseXP: 1000, // Her seviye için temel XP
    xpMultiplier: 1.2, // Her seviye için XP artış çarpanı
    levelRewards: {
      gems: 50,
      hearts: 2,
      gemsMultiplier: 5 // Her seviye için ekstra taş çarpanı
    },
    streakBonuses: {
      daily: 10, // Günlük streak bonusu (%)
      weekly: 25, // Haftalık streak bonusu (%)
      monthly: 50 // Aylık streak bonusu (%)
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'levels', settings }),
      });
      
      if (response.ok) {
        alert('Seviye ayarları başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Error saving level settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu!');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">XP & Seviye Ayarları</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Temel XP Ayarları</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temel Seviye XP
              </label>
              <input
                type="number"
                value={settings.baseXP}
                onChange={(e) => setSettings({
                  ...settings,
                  baseXP: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="100"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Her seviye için gereken temel XP miktarı
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                XP Artış Çarpanı
              </label>
              <input
                type="number"
                value={settings.xpMultiplier}
                onChange={(e) => setSettings({
                  ...settings,
                  xpMultiplier: parseFloat(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
                step="0.1"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Her seviye için XP gereksiniminin artış çarpanı
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Seviye Ödülleri</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temel Taş Ödülü
              </label>
              <input
                type="number"
                value={settings.levelRewards.gems}
                onChange={(e) => setSettings({
                  ...settings,
                  levelRewards: {
                    ...settings.levelRewards,
                    gems: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taş Çarpanı
              </label>
              <input
                type="number"
                value={settings.levelRewards.gemsMultiplier}
                onChange={(e) => setSettings({
                  ...settings,
                  levelRewards: {
                    ...settings.levelRewards,
                    gemsMultiplier: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Her seviye için ekstra taş miktarı
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Can Ödülü
              </label>
              <input
                type="number"
                value={settings.levelRewards.hearts}
                onChange={(e) => setSettings({
                  ...settings,
                  levelRewards: {
                    ...settings.levelRewards,
                    hearts: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Streak Bonusları</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Günlük Streak Bonusu (%)
              </label>
              <input
                type="number"
                value={settings.streakBonuses.daily}
                onChange={(e) => setSettings({
                  ...settings,
                  streakBonuses: {
                    ...settings.streakBonuses,
                    daily: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Haftalık Streak Bonusu (%)
              </label>
              <input
                type="number"
                value={settings.streakBonuses.weekly}
                onChange={(e) => setSettings({
                  ...settings,
                  streakBonuses: {
                    ...settings.streakBonuses,
                    weekly: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aylık Streak Bonusu (%)
              </label>
              <input
                type="number"
                value={settings.streakBonuses.monthly}
                onChange={(e) => setSettings({
                  ...settings,
                  streakBonuses: {
                    ...settings.streakBonuses,
                    monthly: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <FiSave className="mr-2" />
            Ayarları Kaydet
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Seviye Hesaplama Örneği</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            1. Seviye: {settings.baseXP} XP
          </p>
          <p className="text-sm text-gray-600">
            2. Seviye: {Math.round(settings.baseXP * settings.xpMultiplier)} XP
          </p>
          <p className="text-sm text-gray-600">
            3. Seviye: {Math.round(settings.baseXP * Math.pow(settings.xpMultiplier, 2))} XP
          </p>
          <p className="text-sm text-gray-600">
            4. Seviye: {Math.round(settings.baseXP * Math.pow(settings.xpMultiplier, 3))} XP
          </p>
          <p className="text-sm text-gray-600">
            5. Seviye: {Math.round(settings.baseXP * Math.pow(settings.xpMultiplier, 4))} XP
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelsPanel;
