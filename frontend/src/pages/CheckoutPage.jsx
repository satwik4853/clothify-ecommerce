import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiTruck } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';

const PLACEHOLDER = 'https://via.placeholder.com/60x75/f3f4f6/9ca3af?text=?';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

function InputField({ label, name, value, onChange, required, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, shippingPrice, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) newErrors.phone = 'Enter valid 10-digit phone';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Required';
    if (!address.city.trim()) newErrors.city = 'Required';
    if (!address.state) newErrors.state = 'Required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateAddress()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart.items?.length) { toast.error('Your cart is empty'); return; }
    setPlacing(true);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product?._id || item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      const { data } = await orderAPI.create({
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice,
        totalPrice: cartTotal,
      });

      await clearCart();
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (placing) return <Loader fullScreen />;

  /* ── Step indicator ── */
  const steps = ['Shipping Address', 'Payment', 'Review Order'];

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display font-black text-2xl lg:text-3xl text-primary uppercase mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? <FiCheck size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: form steps ── */}
        <div className="lg:col-span-2">

          {/* Step 1 – Shipping address */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-display font-bold text-base uppercase tracking-wider mb-5 flex items-center gap-2">
                <FiTruck size={16} /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Full Name" name="fullName" value={address.fullName} onChange={handleAddressChange} required />
                  {errors.fullName && <p className="text-accent text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <InputField label="Mobile Number" name="phone" value={address.phone} onChange={handleAddressChange} required type="tel" placeholder="10-digit number" />
                  {errors.phone && <p className="text-accent text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <InputField label="Pincode" name="pincode" value={address.pincode} onChange={handleAddressChange} required placeholder="6-digit pincode" />
                  {errors.pincode && <p className="text-accent text-xs mt-1">{errors.pincode}</p>}
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 1" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} required placeholder="House/Flat no., Building, Street" />
                  {errors.addressLine1 && <p className="text-accent text-xs mt-1">{errors.addressLine1}</p>}
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 2" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Area, Colony (optional)" />
                </div>
                <div>
                  <InputField label="City / Town" name="city" value={address.city} onChange={handleAddressChange} required />
                  {errors.city && <p className="text-accent text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    State <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="input-field appearance-none"
                    >
                      <option value="">Select State</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {errors.state && <p className="text-accent text-xs mt-1">{errors.state}</p>}
                </div>
              </div>
              <button onClick={handleNextStep} className="btn-primary mt-6 w-full sm:w-auto px-10">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2 – Payment */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-display font-bold text-base uppercase tracking-wider mb-5 flex items-center gap-2">
                <FiCreditCard size={16} /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'COD', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                  { value: 'Online', label: 'Online Payment', sub: 'UPI, Credit/Debit Card, Net Banking', icon: '💳' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors ${
                      paymentMethod === opt.value ? 'border-primary bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="accent-primary"
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-primary">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.sub}</p>
                    </div>
                    {paymentMethod === opt.value && (
                      <FiCheck size={16} className="ml-auto text-primary" />
                    )}
                  </label>
                ))}
              </div>
              {paymentMethod === 'Online' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 font-medium">
                  🚧 Online payment gateway is in test mode. For demo, use COD.
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary px-6">← Back</button>
                <button onClick={handleNextStep} className="btn-primary px-10">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3 – Review */}
          {step === 3 && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-display font-bold text-base uppercase tracking-wider mb-5">Review Your Order</h2>

              {/* Delivery address preview */}
              <div className="bg-gray-50 p-4 mb-5 border border-gray-200">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Delivering to</p>
                <p className="text-sm font-semibold">{address.fullName}</p>
                <p className="text-sm text-gray-600">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.state} – {address.pincode}</p>
                <p className="text-sm text-gray-600">📞 {address.phone}</p>
              </div>

              {/* Payment method preview */}
              <div className="bg-gray-50 p-4 mb-5 border border-gray-200">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Payment Method</p>
                <p className="text-sm font-semibold">{paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <img src={item.image || PLACEHOLDER} alt={item.name} className="w-12 h-16 object-cover object-top bg-gray-100" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary px-6">← Back</button>
                <button onClick={handlePlaceOrder} className="btn-accent flex-1 flex items-center justify-center gap-2 py-4">
                  Place Order · ₹{cartTotal.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div>
          <div className="bg-gray-50 border border-gray-200 p-5 sticky top-24">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 pb-3 border-b border-gray-200">
              Order Summary
            </h3>
            <div className="space-y-3 text-sm mb-4">
              {cart.items?.map((item) => (
                <div key={item._id} className="flex justify-between gap-2">
                  <span className="text-gray-600 line-clamp-1 flex-1">{item.name} × {item.quantity}</span>
                  <span className="font-medium flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
