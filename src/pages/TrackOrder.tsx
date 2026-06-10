import { useState } from "react";
import { Search, Package, MapPin, CheckCircle, Clock, Truck } from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const handleTrack = () => {
    // Mock tracking logic
    if (orderId.trim() === "") return;
    
    // Simulate status lookup
    setOrderStatus({
      id: orderId,
      status: "In Transit",
      estimatedDelivery: "2026-06-12",
      history: [
        { status: "Order Placed", time: "2026-06-08 10:00 AM", icon: <CheckCircle className="h-5 w-5 text-green-500"/> },
        { status: "Processing", time: "2026-06-08 02:00 PM", icon: <CheckCircle className="h-5 w-5 text-green-500"/> },
        { status: "Shipped", time: "2026-06-09 09:00 AM", icon: <Truck className="h-5 w-5 text-secondary"/> },
        { status: "In Transit", time: "Current", icon: <Clock className="h-5 w-5 text-gray-400"/> },
      ]
    });
  };

  return (
    <div className="pt-32 pb-20 bg-accent min-h-screen px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-primary mb-8 uppercase tracking-tighter text-center">Track Your Order</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
           <div className="flex gap-4">
             <input 
               type="text" 
               placeholder="Enter your Order ID (e.g., #ORD-123)" 
               value={orderId}
               onChange={(e) => setOrderId(e.target.value)}
               className="flex-1 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none"
             />
             <button 
               onClick={handleTrack}
               className="bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-primary/90 flex items-center gap-2"
             >
                <Search className="h-4 w-4" /> Track
             </button>
           </div>
        </div>

        {orderStatus && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order {orderStatus.id}</h2>
                    <p className="text-sm text-gray-500">Status: <span className="font-bold text-secondary">{orderStatus.status}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Est. Delivery</p>
                    <p className="text-lg font-bold text-primary">{orderStatus.estimatedDelivery}</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  {orderStatus.history.map((h: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className="mt-1">{h.icon}</div>
                       <div>
                          <p className="font-bold text-gray-900">{h.status}</p>
                          <p className="text-xs text-gray-500 font-medium">{h.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
        )}
      </div>
    </div>
  );
}
