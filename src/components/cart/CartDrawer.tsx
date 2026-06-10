import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-primary">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-black uppercase tracking-tight">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-6">Your cart is empty</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate("/brands");
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                   <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black uppercase text-secondary tracking-widest mb-1">{item.brand}</div>
                      <h4 className="text-sm font-bold text-gray-900 truncate mb-1">{item.name}</h4>
                      <div className="text-primary font-black text-sm mb-2">
                        ৳{item.discountPrice || item.price}
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-200 rounded"
                            >
                               <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-200 rounded"
                            >
                               <Plus className="h-3 w-3" />
                            </button>
                         </div>
                         <button 
                           onClick={() => removeFromCart(item.id)}
                           className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 underline"
                         >
                           Remove
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-primary">৳{cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 rounded-lg font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center transition-transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
