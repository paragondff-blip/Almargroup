import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, CreditCard, Wallet, Banknote, Percent, CheckCircle, X } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [feedback, setFeedback] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const applyCoupon = async () => {
    setCouponError("");
    const res = await fetch("/api/coupons");
    const coupons = await res.json();
    const coupon = coupons.find((c: any) => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      if (coupon.type === 'percentage') {
        setDiscount(cartTotal * (coupon.discount / 100));
      } else {
        setDiscount(coupon.discount);
      }
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code.");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponApplied(false);
    setCouponError("");
  };

  const subTotal = cartTotal;
  const deliveryFee = cart.length > 0 ? 15 : 0;
  const finalTotal = Math.max(0, subTotal - discount) + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactNumber || !paymentMethod) {
      alert("Please fill all required fields, including contact number and payment method.");
      return;
    }
    
    if (paymentMethod === 'COD') {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setOrderComplete(true);
          clearCart();
        }, 1500);
    } else {
        setShowPaymentModal(true);
    }
  };

  if (orderComplete) {
    return (
      <div className="pt-32 pb-20 bg-accent min-h-screen flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="h-24 w-24 text-secondary mb-6" />
        <h1 className="text-4xl font-black text-primary mb-4 uppercase tracking-tighter">Order Successful!</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Thank you for choosing Almar Group. Your order has been placed successfully and is being processed.
        </p>
        <button 
          onClick={() => navigate("/brands")}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-accent min-h-screen flex flex-col items-center">
        <h1 className="text-3xl font-black text-primary mb-4 uppercase">Checkout</h1>
        <p className="text-gray-500 mb-6 font-medium">Your cart is currently empty.</p>
        <button 
          onClick={() => navigate("/brands")}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-accent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate("/brands")}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-8 uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </button>
        
        <h1 className="text-4xl font-black text-primary mb-8 uppercase tracking-tighter">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
             <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-black text-primary mb-6 uppercase tracking-tight">Billing Details</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                   <input required type="text" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                   <input required type="text" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address (Optional)</label>
                   <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Contact Number (Required)</label>
                   <input required type="tel" name="contactNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Shipping Address</label>
                   <textarea required rows={3} name="shippingAddress" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Feedback/Opinion</label>
                   <textarea rows={2} name="feedback" value={feedback} onChange={e => setFeedback(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                 </div>
               </div>
            </form>
            
            {showPaymentModal && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center relative">
                      <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400"><X /></button>
                      <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-4">Complete Payment</h3>
                      <p className="text-sm text-gray-600 mb-6">Proceeding to {paymentMethod} gateway ...</p>
                      <button onClick={() => { setShowPaymentModal(false); setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setOrderComplete(true); clearCart(); }, 1500); }} className="w-full py-3 bg-secondary text-white text-xs font-black uppercase rounded-lg">Pay Now</button>
                  </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-black text-primary mb-6 uppercase tracking-tight">Payment Method</h2>
               
               <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Select Payment Method</label>
                  <select 
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase text-sm"
                  >
                    <option value="">Select an option</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="SSLCommerz">SSLCommerz</option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="UPI">UPI</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Card">Bank Card</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>
            </div>
            
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
               <h2 className="text-xl font-black text-primary mb-6 uppercase tracking-tight">Order Summary</h2>
               
               <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                 {cart.map(item => (
                   <div key={item.id} className="flex gap-4 items-center">
                     <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</div>
                     </div>
                     <div className="text-sm font-black text-primary">
                        ৳{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mb-6 border-t border-gray-100 pt-6">
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                   <Percent className="h-3 w-3" /> Have a Coupon?
                 </label>
                 {!couponApplied ? (
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="Enter code" 
                       value={couponCode}
                       onChange={(e) => setCouponCode(e.target.value)}
                       className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                     />
                     <button 
                       onClick={applyCoupon}
                       className="bg-primary text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                     >
                       Apply
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100">
                     <div className="text-xs font-bold uppercase">Code "{couponCode.toUpperCase()}" Applied</div>
                     <button onClick={removeCoupon} className="text-[10px] font-black underline hover:text-green-800">Remove</button>
                   </div>
                 )}
                 {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{couponError}</p>}
               </div>

               <div className="space-y-3 text-sm border-t border-gray-100 pt-6">
                 <div className="flex justify-between font-medium text-gray-600">
                   <span>Subtotal</span>
                   <span>৳{subTotal.toFixed(2)}</span>
                 </div>
                 {discount > 0 && (
                   <div className="flex justify-between font-bold text-secondary">
                     <span>Discount Applied</span>
                     <span>-৳{discount.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="flex justify-between font-medium text-gray-600">
                   <span>Delivery Fee</span>
                   <span>৳{deliveryFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xl font-black text-primary pt-3 border-t border-gray-100">
                   <span>Total</span>
                   <span>৳{finalTotal.toFixed(2)}</span>
                 </div>
               </div>

               <button 
                 type="submit" form="checkout-form"
                 disabled={isProcessing}
                 className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-white py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isProcessing ? "Processing..." : "Place Order"}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
