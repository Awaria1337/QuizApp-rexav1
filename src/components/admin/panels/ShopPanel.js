'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ShopPanel = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    type: 'heart',
    price: {
      amount: 0,
      currency: 'gem'
    },
    quantity: 1,
    icon: '',
    status: 'active'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/shop');
      if (!response.ok) {
        throw new Error('Failed to fetch shop items');
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/shop', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem || newItem),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save shop item');
      }
      
      await fetchItems();
      setEditingItem(null);
      setNewItem({
        name: '',
        description: '',
        type: 'heart',
        price: {
          amount: 0,
          currency: 'gem'
        },
        quantity: 1,
        icon: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving shop item:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/shop?id=${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete shop item');
      }
      
      await fetchItems();
    } catch (error) {
      console.error('Error deleting shop item:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mağaza Yönetimi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
            <input
              type="text"
              value={editingItem?.name || newItem.name}
              onChange={(e) => editingItem 
                ? setEditingItem({...editingItem, name: e.target.value})
                : setNewItem({...newItem, name: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tür</label>
            <select
              value={editingItem?.type || newItem.type}
              onChange={(e) => editingItem
                ? setEditingItem({...editingItem, type: e.target.value})
                : setNewItem({...newItem, type: e.target.value})
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="heart">Can</option>
              <option value="gem">Taş</option>
              <option value="booster">Güçlendirici</option>
              <option value="avatar">Avatar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            value={editingItem?.description || newItem.description}
            onChange={(e) => editingItem
              ? setEditingItem({...editingItem, description: e.target.value})
              : setNewItem({...newItem, description: e.target.value})
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fiyat</label>
            <input
              type="number"
              value={editingItem?.price.amount || newItem.price.amount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingItem) {
                  setEditingItem({
                    ...editingItem,
                    price: { ...editingItem.price, amount: value }
                  });
                } else {
                  setNewItem({
                    ...newItem,
                    price: { ...newItem.price, amount: value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
            <select
              value={editingItem?.price.currency || newItem.price.currency}
              onChange={(e) => {
                if (editingItem) {
                  setEditingItem({
                    ...editingItem,
                    price: { ...editingItem.price, currency: e.target.value }
                  });
                } else {
                  setNewItem({
                    ...newItem,
                    price: { ...newItem.price, currency: e.target.value }
                  });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="gem">Taş</option>
              <option value="real">Gerçek Para</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Miktar</label>
            <input
              type="number"
              value={editingItem?.quantity || newItem.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (editingItem) {
                  setEditingItem({ ...editingItem, quantity: value });
                } else {
                  setNewItem({ ...newItem, quantity: value });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">İkon URL</label>
          <input
            type="text"
            value={editingItem?.icon || newItem.icon}
            onChange={(e) => editingItem
              ? setEditingItem({...editingItem, icon: e.target.value})
              : setNewItem({...newItem, icon: e.target.value})
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {editingItem && (
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {editingItem ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Henüz ürün bulunmamaktadır.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={item.icon} alt={item.name} className="h-10 w-10 rounded-full" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price.amount} {item.price.currency === 'gem' ? 'Taş' : 'TL'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopPanel;