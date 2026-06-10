import { Search, Filter, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setEditStatus(order.status);
  };

  const handleSave = async (id: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus }),
    });
    setEditingId(null);
    fetchOrders();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Order Management</h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">View and manage customer orders</p>
         </div>
         <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5">
           <Filter className="h-4 w-4" /> Export Orders
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="relative">
              <input type="text" placeholder="SEARCH ORDERS..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50/50">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {orders.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-12 text-center text-gray-500 font-medium">
                      No orders have been placed yet.
                   </td>
                 </tr>
               ) : orders.map(order => (
                 <tr key={order.id} className="border-b border-gray-100/50 hover:bg-gray-50/50">
                   <td className="p-4 font-bold text-xs">{order.id}</td>
                   <td className="p-4 text-sm">{order.customer}</td>
                   <td className="p-4 text-sm text-gray-500">{order.date}</td>
                   <td className="p-4 text-sm font-bold text-primary">\${order.total.toFixed(2)}</td>
                   <td className="p-4">
                     {editingId === order.id ? (
                       <select 
                         value={editStatus} 
                         onChange={e => setEditStatus(e.target.value)}
                         className="border border-gray-200 rounded p-1 text-xs"
                       >
                         <option>Pending</option>
                         <option>Processing</option>
                         <option>Shipped</option>
                         <option>Delivered</option>
                         <option>Cancelled</option>
                       </select>
                     ) : (
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                         order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                         order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                         order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                         'bg-gray-100 text-gray-800'
                       }`}>
                         {order.status}
                       </span>
                     )}
                   </td>
                   <td className="p-4 text-right">
                     {editingId === order.id ? (
                       <button onClick={() => handleSave(order.id)} className="text-secondary font-bold text-[10px] uppercase tracking-widest hover:underline mr-3">Save</button>
                     ) : (
                       <button onClick={() => handleEdit(order)} className="text-gray-400 hover:text-primary transition-colors p-1"><Edit className="h-4 w-4" /></button>
                     )}
                     <button onClick={() => handleDelete(order.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
