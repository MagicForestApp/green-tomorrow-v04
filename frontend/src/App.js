import { useState, useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import "./App.css";

function App() {
  const [currentAmount, setCurrentAmount] = useState(12348);
  const goalAmount = 30000;
  const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const nextMilestone = 3000;
  const nextMilestoneText = "Grant Application Fee";
  
  const [isOpen, setIsOpen] = useState(false);
  const [donationStep, setDonationStep] = useState(1);
  const [donationType, setDonationType] = useState('one-time');
  const [donationAmount, setDonationAmount] = useState(10); // Default to $10
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmountManuallyEdited, setIsCustomAmountManuallyEdited] = useState(false);
  const [plantTree, setPlantTree] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Payment method related states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isCardValid, setIsCardValid] = useState(false);
  const [isExpiryValid, setIsExpiryValid] = useState(true);
  
  // Refs for credit card input fields
  const cardNumberInputRef = useRef(null);
  const cardExpiryInputRef = useRef(null);
  const cardCvcInputRef = useRef(null);
  const completeButtonRef = useRef(null);

  // Reset donation form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setDonationStep(1);
        setDonationType('one-time');
        setDonationAmount(10); // Reset to $10
        setCustomAmount('');
        setIsCustomAmountManuallyEdited(false);
        setPlantTree(true);
        setEmail('');
        setIsSubmitting(false);
        setIsSuccess(false);
        
        // Reset payment related states
        setSelectedPaymentMethod(null);
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setIsCardValid(false);
        setIsExpiryValid(true);
      }, 300);
    }
  }, [isOpen]);
  
  // Auto-select minimum amount ($10) when user reaches step 2
  useEffect(() => {
    if (donationStep === 2 && !customAmount) {
      // Always select the minimum donation amount ($10) by default
      const minAmount = 10;
      setDonationAmount(minAmount);
      setCustomAmount(minAmount.toString());
    }
  }, [donationStep, customAmount]);
  
  // Validate credit card information
  useEffect(() => {
    // Validation rules - card number validation disabled for testing
    const isNumberValid = true; // Accepting any card number format
    const isExpiryFormatValid = /^\d{2}\/\d{2}$/.test(cardExpiry);
    const isCvcValid = /^\d{3}$/.test(cardCvc);
    
    // Check if other fields are valid for the overall card validation
    setIsCardValid(isNumberValid && isExpiryFormatValid && isCvcValid && isExpiryValid);
  }, [cardNumber, cardExpiry, cardCvc, isExpiryValid]);
  
  // Validate that expiry date is not in the past
  useEffect(() => {
    // Only validate after full MM/YY is entered
    if (/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      const [month, year] = cardExpiry.split('/').map(part => parseInt(part, 10));
      
      // Convert to full year (20XX)
      const fullYear = 2000 + year;
      
      // Get current date for comparison
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
      const currentYear = now.getFullYear();
      
      // Check if date is in the past
      const isInPast = (fullYear < currentYear) || 
                       (fullYear === currentYear && month < currentMonth);
      
      // Update validity state
      setIsExpiryValid(!isInPast);
    } else {
      // If format is not complete, don't show error yet
      setIsExpiryValid(true);
    }
  }, [cardExpiry]);
  
  // Auto-scroll to Complete Donation button when all fields are valid
  useEffect(() => {
    // Check if all required fields are filled (card number validation disabled)
    const hasCardNumber = cardNumber.trim() !== ''; // Any card number is accepted
    const isExpiryFormatValid = /^\d{2}\/\d{2}$/.test(cardExpiry);
    const isCvcValid = /^\d{3}$/.test(cardCvc);
    
    // Only scroll when required fields are filled and we're on step 3 (payment)
    if (hasCardNumber && isExpiryFormatValid && isCvcValid && isExpiryValid && 
        completeButtonRef.current && donationStep === 3 && selectedPaymentMethod === 'card') {
      // Use a small timeout to ensure DOM updates are complete and to avoid interfering with focus changes
      setTimeout(() => {
        // Check if button is already visible in the viewport
        const rect = completeButtonRef.current.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
        
        // Only scroll if the button is not fully visible
        if (!isVisible) {
          completeButtonRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, 300);  // Longer timeout to ensure all other updates are complete
    }
  }, [cardNumber, cardExpiry, cardCvc, isExpiryValid, donationStep, selectedPaymentMethod]);

  // Card input formatters
  const formatCardNumber = (value) => {
    // Remove spaces and non-digits
    const digitsOnly = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Format with spaces after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += digitsOnly[i];
    }
    
    return formattedValue || value;
  };
  
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    
    // Auto-focus to expiry field after at least 13 digits entered (minimum valid card length)
    // Note: No strict validation - this is just for better UX flow
    const digitCount = formattedValue.replace(/\s/g, '').length;
    if (digitCount >= 13 && digitCount <= 19) { // Common card number lengths are 13-19 digits
      setTimeout(() => cardExpiryInputRef.current?.focus(), 10);
    }
  };
  
  // Handle expiry input
  const handleExpiryChange = (e) => {
    const value = e.target.value;
    let formattedValue = value;
    
    // Strip all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length > 0) {
      // Extract month digits (first two digits)
      let month = digitsOnly.substring(0, Math.min(2, digitsOnly.length));
      
      // Validate month when it's 2 digits
      if (month.length === 2) {
        const monthNum = parseInt(month, 10);
        if (monthNum > 12) {
          month = '12';
        } else if (monthNum === 0) {
          month = '01';
        }
      }
      // Auto-format single digit > 1
      else if (month.length === 1 && parseInt(month, 10) > 1) {
        month = `0${month}`;
      }
      
      // Format with or without year portion
      if (digitsOnly.length <= 2) {
        formattedValue = month;
      } else {
        const year = digitsOnly.substring(2, 4);
        formattedValue = `${month}/${year}`;
      }
    }
    
    setCardExpiry(formattedValue);
    
    // Auto-focus to CVC field when expiry is complete (MM/YY format)
    if (/^\d{2}\/\d{2}$/.test(formattedValue)) {
      setTimeout(() => cardCvcInputRef.current?.focus(), 10);
    }
  };
  
  // Handle CVC input
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCardCvc(value);
    }
  };
  
  // Handle backspace navigation
  const handleKeyDown = (e, field) => {
    // Check if the field is empty or will be empty after this backspace
    const willBeEmpty = e.key === 'Backspace' && (
      e.target.value === '' || 
      (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) ||
      (e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart === 1)
    );
    
    if (willBeEmpty) {
      if (field === 'expiry') {
        setTimeout(() => cardNumberInputRef.current?.focus(), 10);
        // Prevent default to avoid any unwanted character deletion
        if (e.target.value === '') {
          e.preventDefault();
        }
      } else if (field === 'cvc') {
        setTimeout(() => cardExpiryInputRef.current?.focus(), 10);
        // Prevent default to avoid any unwanted character deletion
        if (e.target.value === '') {
          e.preventDefault();
        }
      }
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    if (selectedPaymentMethod === method) {
      // If clicking the same method again, deselect it
      setSelectedPaymentMethod(null);
    } else {
      setSelectedPaymentMethod(method);
      
      // Auto-focus card number field when Credit/Debit Card is selected
      if (method === 'card') {
        setTimeout(() => cardNumberInputRef.current?.focus(), 100);
      }
    }
  };
  const handleSubmitDonation = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay - shorter delay for better UX
    setTimeout(() => {
      const amount = customAmount ? parseInt(customAmount, 10) : donationAmount;
      
      // Update progress bar
      setCurrentAmount(prev => prev + amount);
      
      // Set success state immediately
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  // Handle predefined amount selection - Implemented for Magic Forest Association
  const handleAmountSelect = (amount) => {
    // Always update the visual selection state
    setDonationAmount(amount);
    
    // Always update the custom amount field when a fixed amount button is clicked
    setCustomAmount(amount.toString());
    
    // If user had manually edited before, reset the flag since they've now chosen a fixed amount
    if (isCustomAmountManuallyEdited) {
      setIsCustomAmountManuallyEdited(false);
    }
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setIsCustomAmountManuallyEdited(true); // Mark that the user has manually edited the amount
    }
  };

  return (
    <div className="App min-h-screen bg-neutral-950 flex flex-col items-center justify-between relative overflow-hidden">
      {/* Background pattern for "aliveness" */}
      <div className="leaf-pattern absolute inset-0 pointer-events-none"></div>

      {/* Animated background gradients - subtle "breathing" effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="living-element absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-forest-500/5 rounded-full filter blur-[150px]"></div>
        <div className="living-element absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-forest-500/5 rounded-full filter blur-[180px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <main className="w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center justify-center z-10 flex-grow">
        {/* Headline */}
        <motion.h1 
          className="font-sans text-3xl md:text-4xl lg:text-5xl font-medium text-center mb-12 tracking-tight leading-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          PLANT MAGIC FOREST — TOGETHER
        </motion.h1>

        {/* Progress Section */}
        <motion.div 
          className="w-full glass-panel p-5 md:p-6 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="mb-2 md:mb-0">
              <p className="text-base md:text-lg font-normal text-white/90">
                <span className="text-xl md:text-2xl font-medium text-white">${currentAmount.toLocaleString()}</span> of ${goalAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-sm text-white/60 font-normal">
              Next Goal: {nextMilestoneText} — ${nextMilestone.toLocaleString()}
            </div>
          </div>
          
          <div className="progress-bar mt-1">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.button 
            className="btn btn-primary min-w-[180px]"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Donate Now
          </motion.button>
          
          <motion.button 
            className="btn btn-outline min-w-[180px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-white/30 text-xs">
        <p>© 2025 Magic Forest Association | NIF: G21911227</p>
        <p className="mt-1 text-xs">Made with Emergent</p>
      </footer>

      {/* Donation Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="glass-panel w-full max-w-md p-6 overflow-hidden transform transition-all">
                  <Dialog.Title className="text-lg font-medium text-white mb-6 text-center tracking-tight">
                    {isSuccess
                      ? "Thank You for Your Donation"
                      : donationStep === 1
                      ? "Choose Donation Type"
                      : donationStep === 2
                      ? "Select Amount"
                      : "Complete Donation"}
                  </Dialog.Title>

                  {/* Stepper */}
                  {!isSuccess && (
                    <div className="flex items-center justify-center mb-8">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div 
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              donationStep >= step 
                                ? 'bg-forest-500 text-white' 
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            <span className="text-xs">{step}</span>
                          </div>
                          {step < 3 && (
                            <div 
                              className={`w-12 h-px mx-1 ${
                                donationStep > step 
                                  ? 'bg-forest-500' 
                                  : 'bg-neutral-800'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Success message */}
                  {isSuccess && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-forest-500 rounded-full mx-auto flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="mb-4">Your donation of ${customAmount} has been received</p>
                      <p className="mb-6 text-white/60 text-sm">A receipt has been sent to your email</p>
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={() => setIsOpen(false)}
                          className="btn btn-outline py-2 text-sm px-4"
                        >
                          Close
                        </button>
                        <button 
                          className="btn btn-primary py-2 text-sm px-4"
                        >
                          Personalize Tree
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Donation Type */}
                  {!isSuccess && donationStep === 1 && (
                    <div>
                      <div className="bg-neutral-900/50 p-3 rounded-xl flex mb-6">
                        <button 
                          className={`flex-1 py-2 rounded-lg transition-colors ${
                            donationType === 'one-time' 
                              ? 'bg-neutral-800 text-white' 
                              : 'text-white/60 hover:bg-neutral-800/50 hover:text-white/80'
                          }`}
                          onClick={() => setDonationType('one-time')}
                        >
                          One-time
                        </button>
                        <button 
                          className={`flex-1 py-2 rounded-lg transition-colors ${
                            donationType === 'monthly' 
                              ? 'bg-neutral-800 text-white' 
                              : 'text-white/60 hover:bg-neutral-800/50 hover:text-white/80'
                          }`}
                          onClick={() => setDonationType('monthly')}
                        >
                          Monthly
                        </button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <p className="mb-2 text-white/60 text-sm">
                          {donationType === 'one-time' 
                            ? 'Make a one-time contribution to our forest initiative' 
                            : 'Support us with a recurring monthly donation'}
                        </p>
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <button 
                          onClick={() => setIsOpen(false)}
                          className="text-white/40 hover:text-white text-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            // Immediately set the step
                            setDonationStep(2);
                          }}
                          className="btn btn-primary py-2 px-5 text-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Amount */}
                  {!isSuccess && donationStep === 2 && (
                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[10, 25, 50, 100].map((amount) => (
                          <button
                            key={amount}
                            className={`py-3 rounded-lg border transition-all ${
                              donationAmount === amount
                                ? 'border-forest-500 bg-forest-500/10 text-white'
                                : 'border-neutral-800 text-white/80 hover:border-forest-400/30 hover:text-white'
                            }`}
                            onClick={() => handleAmountSelect(amount)}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mb-5">
                        <label className="block text-sm font-normal text-white/60 mb-1.5">
                          Or enter custom amount
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-white/60">$</span>
                          </div>
                          <input
                            type="text"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="block w-full pl-8 pr-3 py-2 rounded-lg bg-neutral-800/80 border-neutral-700 text-white focus:ring-forest-500/30 focus:border-forest-500/30"
                            placeholder="Custom amount"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <input
                          id="plant-tree"
                          type="checkbox"
                          checked={plantTree}
                          onChange={() => setPlantTree(!plantTree)}
                          className="h-4 w-4 rounded border-neutral-700 text-forest-500 focus:ring-forest-500/30"
                        />
                        <label htmlFor="plant-tree" className="ml-2 block text-sm text-white/80">
                          This donation will plant a tree on our map
                        </label>
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          onClick={() => {
                            // Immediately set the step
                            setDonationStep(1);
                          }}
                          className="text-white/40 hover:text-white text-sm"
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => {
                            // Immediately set the step
                            setDonationStep(3);
                          }}
                          className="btn btn-primary py-2 px-5 text-sm"
                          disabled={!customAmount}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Email and Payment */}
                  {!isSuccess && donationStep === 3 && (
                    <form onSubmit={handleSubmitDonation}>
                      <div className="mb-6">
                        <div className="mb-5">
                          <label className="block text-sm font-normal text-white/60 mb-1.5">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-3 py-2 rounded-lg bg-neutral-800/80 border-neutral-700 text-white focus:ring-forest-500/30 focus:border-forest-500/30"
                            placeholder="your.email@example.com"
                          />
                          <p className="mt-1 text-xs text-white/40">We'll send your receipt to this address</p>
                        </div>
                        
                        <div className="mb-5">
                          <div className="p-4 bg-neutral-800/30 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-white/60 text-sm">Donation amount:</span>
                              <span className="font-normal">${customAmount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60 text-sm">Type:</span>
                              <span className="font-normal capitalize">{donationType}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="glass-panel p-4 mb-5">
                          <div className="text-sm font-normal mb-3">Payment methods</div>
                          <div className="space-y-2">
                            {/* Credit/Debit Card Option */}
                            <div 
                              className={`bg-neutral-800/50 p-2.5 rounded-lg flex items-center text-white/80 cursor-pointer ${selectedPaymentMethod === 'card' ? 'ring-1 ring-forest-500' : ''}`}
                              onClick={() => handlePaymentMethodSelect('card')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Credit / Debit Card
                            </div>
                            
                            {/* Credit Card Form */}
                            {selectedPaymentMethod === 'card' && (
                              <div className={`p-3 space-y-3 rounded-lg bg-neutral-900/50 ${isCardValid ? 'border border-forest-500' : 'border border-neutral-700'}`}>
                                <div>
                                  <label className="block text-sm font-normal text-white/60 mb-1.5">
                                    Card number
                                  </label>
                                  <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    className="block w-full px-3 py-2 rounded-lg bg-neutral-800/80 border-neutral-700 text-white focus:ring-forest-500/30 focus:border-forest-500/30"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={24}
                                    ref={cardNumberInputRef}
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                  />
                                </div>
                                
                                <div className="flex space-x-3">
                                  <div className="flex-1">
                                    <label className="block text-sm font-normal text-white/60 mb-1.5">
                                      Expiry (MM/YY)
                                    </label>
                                    <input
                                      type="text"
                                      value={cardExpiry}
                                      onChange={handleExpiryChange}
                                      onKeyDown={(e) => handleKeyDown(e, 'expiry')}
                                      className={`block w-full px-3 py-2 rounded-lg bg-neutral-800/80 border-neutral-700 text-white focus:ring-forest-500/30 focus:border-forest-500/30 ${
                                        !isExpiryValid && cardExpiry ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500/30' : ''
                                      }`}
                                      placeholder="MM/YY"
                                      maxLength={5}
                                      ref={cardExpiryInputRef}
                                      inputMode="numeric"
                                      autoComplete="cc-exp"
                                    />
                                    {!isExpiryValid && cardExpiry && (
                                      <p className="mt-1 text-xs text-red-500">
                                        Expiry date cannot be in the past
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <label className="block text-sm font-normal text-white/60 mb-1.5">
                                      CVC
                                    </label>
                                    <input
                                      type="text"
                                      value={cardCvc}
                                      onChange={handleCvcChange}
                                      onKeyDown={(e) => handleKeyDown(e, 'cvc')}
                                      className="block w-full px-3 py-2 rounded-lg bg-neutral-800/80 border-neutral-700 text-white focus:ring-forest-500/30 focus:border-forest-500/30"
                                      placeholder="123"
                                      maxLength={3}
                                      ref={cardCvcInputRef}
                                      inputMode="numeric"
                                      autoComplete="cc-csc"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Apple Pay Option */}
                            <div 
                              className={`bg-neutral-800/50 p-2.5 rounded-lg flex items-center text-white/80 cursor-pointer ${selectedPaymentMethod === 'apple' ? 'ring-1 ring-forest-500' : ''}`}
                              onClick={() => handlePaymentMethodSelect('apple')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18c-1.683 0-3.258-.462-4.592-1.258l-.005-.002c-1.33-.793-2.5-1.978-3.208-3.496-.9-1.923-.9-3.7 0-5.224.65-1.12 1.655-1.95 2.984-2.624.328-.167.68-.165 1.008 0 .596.3 1.113.825 1.413 1.5.244.542.487 1.25.246 2.016-.055.17-.11.415-.135.645-.17.135-.1.27.05.405l.03.03c.075.075.15.15.255.195.15.076.315.107.48.075.315-.06.63-.255.945-.496l.75-.571c1.05-.797 2.355-.797 3.405-.001l.751.572c.315.24.63.436.945.496.165.03.33 0 .48-.075.105-.046.18-.12.255-.195l.03-.03c.15-.135.222-.27.204-.405-.025-.23-.08-.475-.134-.645-.24-.766.002-1.474.246-2.016.3-.675.817-1.2 1.413-1.5.328-.166.68-.167 1.008 0 1.33.675 2.334 1.504 2.984 2.624.9 1.524.9 3.3 0 5.224-.708 1.518-1.877 2.703-3.203 3.493l-.01.005C15.258 17.538 13.683 18 12 18z" />
                              </svg>
                              Apple Pay
                            </div>
                            
                            {/* Google Pay Option */}
                            <div 
                              className={`bg-neutral-800/50 p-2.5 rounded-lg flex items-center text-white/80 cursor-pointer ${selectedPaymentMethod === 'google' ? 'ring-1 ring-forest-500' : ''}`}
                              onClick={() => handlePaymentMethodSelect('google')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Google Pay
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          type="button"
                          onClick={() => {
                            // Immediately set the step
                            setDonationStep(2);
                          }}
                          className="text-white/40 hover:text-white text-sm"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          className="btn btn-primary py-2 px-5 text-sm"
                          disabled={isSubmitting}
                          ref={completeButtonRef}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </div>
                          ) : (
                            'Complete Donation'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default App;
