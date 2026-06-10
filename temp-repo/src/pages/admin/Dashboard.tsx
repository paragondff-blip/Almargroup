import { useState, useRef, useEffect } from "react";
import { Users, DollarSign, ShoppingBag, Package, TrendingUp, TrendingDown, Eye, X, MapPin, Mail, Phone, ShoppingCart, ChevronDown } from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: { product: string; qty: number; price: string }[];
  total: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: string;
  ordersCount: number;
  orderHistory: Order[];
}

export default function Dashboard() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => setDashboardData(data));
      
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!dashboardData) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Dashboard...</div>;

  const { topProducts, slowMovingItems, topCustomers, inventoryStock, totalRevenue, activeOrders, pendingOrders, totalCustomers } = dashboardData;

  const downloadReport = (format: 'csv' | 'doc') => {
    const header = "Name,Sales,Revenue\n";
    const rows = topProducts.map(p => `"${p.name}","${p.sales}","${p.revenue}"`).join("\n");
    const content = header + rows;
    
    let blob;
    let filename;
    
    if (format === 'csv') {
        blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        filename = "dashboard_report.csv";
    } else {
        // Simple HTML doc for Word
        const htmlDoc = `<html><body><table><tr><th>Name</th><th>Sales</th><th>Revenue</th></tr>${topProducts.map(p => `<tr><td>${p.name}</td><td>${p.sales}</td><td>${p.revenue}</td></tr>`).join("")}</table></body></html>`;
        blob = new Blob([htmlDoc], { type: 'application/msword;charset=utf-8;' });
        filename = "dashboard_report.doc";
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
         <div className="relative" ref={dropdownRef}>
             <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
             >
                Download Report <ChevronDown className="h-4 w-4" />
             </button>
             {isDropdownOpen && (
                 <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                     <button onClick={() => downloadReport('csv')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Excel (.csv)</button>
                     <button onClick={() => downloadReport('doc')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Word (.doc)</button>
                 </div>
             )}
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {/* By Goods */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">By Goods</h3>
               </div>
               <div className="h-10 w-10 text-white bg-blue-500 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5" />
               </div>
            </div>
            <div>
               <div className="flex justify-between items-end mb-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase">Total Stock</span>
                  <span className="text-xl font-bold text-gray-900">{inventoryStock} pcs</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500 font-medium uppercase">Top Items</span>
                  <span className="text-xl font-bold text-gray-900">{topProducts.length}</span>
               </div>
            </div>
         </div>

         {/* By Value */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">By Value</h3>
               </div>
               <div className="h-10 w-10 text-white bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
               </div>
            </div>
            <div>
               <div className="flex justify-between items-end mb-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase">Revenue (TK)</span>
                  <span className="text-xl font-bold text-gray-900">৳ {totalRevenue.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-end cursor-help" title="Till Date Total Revenue">
                  <span className="text-xs text-gray-500 font-medium uppercase">Avg Order</span>
                  <span className="text-xl font-bold text-gray-900">৳ {(totalRevenue/(activeOrders||1)).toLocaleString()}</span>
               </div>
            </div>
         </div>

         {/* Orders */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Orders</h3>
               </div>
               <div className="h-10 w-10 text-white bg-secondary rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
               </div>
            </div>
            <div>
               <div className="flex justify-between items-end mb-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase">Total Active</span>
                  <span className="text-xl font-bold text-gray-900">{activeOrders}</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500 font-medium uppercase">Pending</span>
                  <span className="text-xl font-bold text-orange-500">{pendingOrders}</span>
               </div>
            </div>
         </div>

         {/* Customers */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Customers</h3>
               </div>
               <div className="h-10 w-10 text-white bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5" />
               </div>
            </div>
            <div>
               <div className="flex justify-between items-end mb-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase">Total Customers</span>
                  <span className="text-xl font-bold text-gray-900">{totalCustomers}</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-500 font-medium uppercase">Active Buyers</span>
                  <span className="text-xl font-bold text-green-500">{topCustomers.length}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         {/* Top 10 Sales Products */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
               <TrendingUp className="h-5 w-5 text-green-500" />
               <h3 className="text-lg font-bold text-gray-800">Top 10 Sales Products</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest">
                        <th className="pb-3 font-bold">#</th>
                        <th className="pb-3 font-bold">Product Name</th>
                        <th className="pb-3 font-bold text-right">Sales Qty</th>
                        <th className="pb-3 font-bold text-right">Revenue</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {topProducts.map((product, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                           <td className="py-3 text-gray-400 font-bold">{i + 1}</td>
                           <td className="py-3 text-primary font-bold">{product.name}</td>
                           <td className="py-3 text-gray-700 text-right">{product.sales}</td>
                           <td className="py-3 text-gray-900 font-bold text-right">{product.revenue}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Slow Moving & Top Customers Container */}
         <div className="flex flex-col gap-8">
            {/* Slow Moving Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
               <div className="flex items-center gap-2 mb-6">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-bold text-gray-800">Slow Moving Items</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest">
                           <th className="pb-3 font-bold">Product Name</th>
                           <th className="pb-3 font-bold text-right">Stock</th>
                           <th className="pb-3 font-bold text-right">Last Sold</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {slowMovingItems.map((item, i) => (
                           <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-red-50">
                              <td className="py-3 text-gray-700 font-medium">{item.name}</td>
                              <td className="py-3 text-gray-500 text-right font-medium">{item.stock}</td>
                              <td className="py-3 text-red-500 text-right text-xs font-bold uppercase tracking-wide">{item.lastSold}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Top 10 Customers */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
               <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-bold text-gray-800">Top 10 Customers</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest">
                           <th className="pb-3 font-bold">Customer Name</th>
                           <th className="pb-3 font-bold text-right">Orders</th>
                           <th className="pb-3 font-bold text-right">Total Spent</th>
                           <th className="pb-3 font-bold text-center">Action</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {topCustomers.map((customer, i) => (
                           <tr key={customer.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="py-2.5 text-primary font-bold">{customer.name}</td>
                              <td className="py-2.5 text-gray-600 text-right font-medium">{customer.ordersCount}</td>
                              <td className="py-2.5 text-green-600 font-bold text-right">{customer.totalSpent}</td>
                              <td className="py-2.5 text-center">
                                 <button 
                                   onClick={() => setSelectedCustomer(customer)}
                                   className="p-1.5 text-secondary hover:bg-secondary/10 rounded-md transition-colors inline-block"
                                   title="View Details"
                                 >
                                    <Eye className="h-4 w-4" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="mb-6">
               <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 text-2xl font-black">
                  {selectedCustomer.name.charAt(0)}
               </div>
               <h2 className="text-2xl font-black text-primary tracking-tighter uppercase">{selectedCustomer.name}</h2>
               <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">Customer ID: {selectedCustomer.id}</p>
            </div>
            
            <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-secondary shrink-0" />
                  <span className="font-medium">{selectedCustomer.email}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-secondary shrink-0" />
                  <span className="font-medium">{selectedCustomer.phone}</span>
               </div>
               <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <span className="font-medium">{selectedCustomer.address}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
                  <ShoppingCart className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</div>
                  <div className="text-2xl font-black text-primary">{selectedCustomer.ordersCount}</div>
               </div>
               <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Spent</div>
                  <div className="text-xl font-black text-green-600">{selectedCustomer.totalSpent}</div>
               </div>
            </div>

            <div className="mb-8">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Order History</h4>
               <div className="space-y-4 max-h-64 overflow-y-auto">
                 {selectedCustomer.orderHistory.length > 0 ? (
                   selectedCustomer.orderHistory.map(order => (
                     <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-primary">{order.date}</span>
                         <span className="text-xs font-bold text-green-600">{order.total}</span>
                       </div>
                       <ul className="text-xs text-gray-600 space-y-1">
                         {order.items.map((item, i) => (
                           <li key={i} className="flex justify-between">
                             <span>{item.qty}x {item.product}</span>
                             <span>{item.price}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))
                 ) : (
                   <p className="text-xs text-gray-400 italic">No orders found.</p>
                 )}
               </div>
            </div>

            <button 
              onClick={() => setSelectedCustomer(null)}
              className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-md"
            >
               Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

