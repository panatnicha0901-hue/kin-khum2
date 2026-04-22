/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Map as MapIcon, 
  UtensilsCrossed, 
  ChevronRight, 
  Search, 
  SlidersHorizontal,
  CheckCircle,
  Dices,
  Heart,
  RotateCcw,
  Navigation,
  Check,
  Plus,
  Users,
  ArrowLeft,
  Megaphone,
  ChefHat
} from 'lucide-react';
import { Screen, UserPreferences, Restaurant } from './types';

// Mock Data
const RESTAURANTS: Restaurant[] = [
  { id: '1', name: "Chester's Grill", promotion: 'Promotion 3 Free 2', location: { top: '500px', left: '600px' }, price: '120', type: 'Fast Food', spots: '1 slots left', joined: '4/5', buddies: ['f2.png', 'f3.png'] },
  { id: '2', name: "Street Somtum", promotion: 'Special 10% Off', location: { top: '350px', left: '250px' }, price: '60', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['f1.png'] },
  { id: '3', name: "Noodle House", promotion: 'Buy 2 Get 1', location: { top: '250px', left: '800px' }, price: '45', type: 'Street Food', spots: '2 spots left', joined: '2/4', buddies: ['f2.png', 'f3.png'] },
  { id: '4', name: "Khao Man Gai", promotion: 'Free Drink', location: { top: '750px', left: '400px' }, price: '50', type: 'Street Food', spots: '1 slots left', joined: '3/4', buddies: ['f1.png', 'f2.png', 'f3.png'] },
  { id: '5', name: "Shabu On The Go", promotion: 'Promotion 4 Pay 3', location: { top: '650px', left: '950px' }, price: '299', type: 'Buffet', spots: '1 slots left', joined: '3/4', buddies: ['f2.png', 'f1.png'] },
  { id: '6', name: "Sushi Express", promotion: 'Special 15% Off', location: { top: '150px', left: '450px' }, price: '450', type: 'Japanese', spots: '2 spots left', joined: '2/4', buddies: ['f1.png', 'f3.png'] },
  { id: '7', name: "Moo Ping", promotion: 'Buy 10 Get 1', location: { top: '900px', left: '150px' }, price: '10', type: 'Street Food', spots: '5 spots left', joined: '0/5', buddies: [] },
  { id: '8', name: "Ramen Boss", promotion: 'Free Gyoza', location: { top: '420px', left: '1100px' }, price: '180', type: 'Japanese', spots: '1 spots left', joined: '3/4', buddies: ['f2.png'] },
  { id: '9', name: "Bubble Tea Bar", promotion: 'Buy 1 Get 1', location: { top: '100px', left: '900px' }, price: '55', type: 'Drinks', spots: '2 spots left', joined: '1/3', buddies: ['f3.png'] },
  { id: '10', name: "Boat Noodle", promotion: 'Special ฿15 Only', location: { top: '850px', left: '750px' }, price: '15', type: 'Street Food', spots: '4 spots left', joined: '1/5', buddies: ['f1.png'] },
  { id: '11', name: "Pad Thai J", promotion: 'Free Topping', location: { top: '550px', left: '150px' }, price: '65', type: 'Street Food', spots: '2 spots left', joined: '2/4', buddies: ['f2.png', 'f3.png'] },
  { id: '12', name: "Pizza Hut", promotion: 'Buy 1 Get 1', location: { top: '1100px', left: '600px' }, price: '399', type: 'Fast Food', spots: '1 slots left', joined: '3/4', buddies: ['f1.png'] },
  { id: '13', name: "Thai Curry", promotion: 'Free Rice', location: { top: '300px', left: '1300px' }, price: '80', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['f2.png'] },
  { id: '14', name: "Craft Burger", promotion: 'Special Burger Set', location: { top: '1300px', left: '300px' }, price: '250', type: 'Western', spots: '2 spots left', joined: '2/4', buddies: ['f3.png', 'f1.png'] },
  { id: '15', name: "Dessert Kingdom", promotion: 'Member Discount', location: { top: '1200px', left: '1100px' }, price: '120', type: 'Dessert', spots: '4 spots left', joined: '0/4', buddies: [] },
  { id: '16', name: "Chicken Rice", promotion: 'Free Soup', location: { top: '800px', left: '1200px' }, price: '40', type: 'Street Food', spots: '1 spots left', joined: '3/4', buddies: ['f2.png'] },
  { id: '17', name: "Grill Station", promotion: 'Special Set', location: { top: '400px', left: '50px' }, price: '150', type: 'Western', spots: '2 spots left', joined: '2/4', buddies: ['f1.png', 'f2.png'] },
  { id: '18', name: "Salad Garden", promotion: '10% Off', location: { top: '950px', left: '950px' }, price: '135', type: 'Healthy', spots: '3 spots left', joined: '1/4', buddies: ['f3.png'] },
  { id: '19', name: "Icy Dessert", promotion: 'Free Topping', location: { top: '150px', left: '200px' }, price: '45', type: 'Dessert', spots: '2 spots left', joined: '1/3', buddies: ['f1.png'] },
  { id: '20', name: "Coffee Club", promotion: 'Morning Set', location: { top: '20px', left: '600px' }, price: '95', type: 'Drinks', spots: '2 spots left', joined: '2/4', buddies: ['f2.png', 'f3.png'] },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    monthlyBudget: 3000,
    budget: 100,
    halal: true,
    vegetarian: false,
    budgetFocused: true
  });

  // Automatically transition splash
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('setup'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen />;
      case 'setup': return <SetupScreen onComplete={(p) => { setPreferences(p); setCurrentScreen('home'); }} />;
      case 'home': return <HomeScreen preferences={preferences} onNavigate={setCurrentScreen} />;
      case 'food-map': return <MapScreen onNavigate={setCurrentScreen} selectedRestaurant={selectedRestaurant} setSelectedRestaurant={setSelectedRestaurant} />;
      case 'matching': return <MatchingScreen onNavigate={setCurrentScreen} selectedRestaurant={selectedRestaurant} />;
      case 'confirmation': return <ConfirmationScreen preferences={preferences} onNavigate={setCurrentScreen} />;
      case 'what-to-eat-intro': return <WhatToEatIntro onNavigate={setCurrentScreen} />;
      case 'what-to-eat-result': return <WhatToEatResult onNavigate={setCurrentScreen} />;
      default: return <SplashScreen />;
    }
  };

  return (
    <div className="max-w-[393px] mx-auto min-h-screen relative overflow-hidden flex flex-col bg-white">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      
      {/* Bottom Nav */}
      {!['splash', 'setup', 'confirmation', 'matching'].includes(currentScreen) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm h-[72px] bg-surface rounded-[100px] shadow-[0px_4px_30px_rgba(0,0,0,0.15)] flex items-center justify-between px-2 z-50 border border-white/20">
          <NavButton 
            active={currentScreen === 'home'} 
            icon={Home} 
            label="Home" 
            onClick={() => setCurrentScreen('home')} 
          />
          <NavButton 
            active={currentScreen === 'food-map'} 
            icon={MapIcon} 
            label="Food Map" 
            onClick={() => setCurrentScreen('food-map')} 
          />
          <NavButton 
            active={currentScreen.startsWith('what-to-eat')} 
            icon={UtensilsCrossed} 
            label="What to Eat" 
            onClick={() => setCurrentScreen('what-to-eat-intro')} 
          />
        </div>
      )}
    </div>
  );
}

// --- Components ---

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 h-[85%] flex flex-col items-center justify-center transition-all duration-300 rounded-[100px] relative overflow-hidden ${active ? 'bg-primary text-white shadow-lg scale-[1.02]' : 'text-stone-500 hover:bg-black/5'}`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-widest mt-1 font-sans">
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="nav-bg" 
          className="absolute inset-0 bg-primary -z-10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

function Header() {
  return (
    <div className="sticky top-0 z-50 w-full h-16 px-6 bg-surface/80 backdrop-blur-md flex justify-between items-center border-b border-black/5">
      <h1 className="text-primary text-2xl font-extrabold font-display leading-8">Kinkhum</h1>
      <div className="w-9 h-9 rounded-full overflow-hidden border border-black/5 shadow-sm">
        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50"
    >
      <div className="relative mb-8">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
           {/* Simple Line Art Placeholder - In a real app we'd use the SVG from design */}
           <circle cx="120" cy="120" r="100" stroke="white" strokeWidth="2" strokeDasharray="6 3" />
           <path d="M120 70C120 70 80 110 80 140C80 162.091 97.9086 180 120 180C142.091 180 160 162.091 160 140C160 110 120 70 120 70Z" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <h1 className="text-white text-6xl font-black italic tracking-tighter">Kin-khum</h1>
    </motion.div>
  );
}

function SetupScreen({ onComplete }: { onComplete: (p: UserPreferences) => void }) {
  const [pref, setPref] = useState<UserPreferences>({ 
    monthlyBudget: 3000, 
    budget: 100, 
    halal: true, 
    vegetarian: false, 
    budgetFocused: true 
  });

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-1 flex flex-col px-8 py-12"
    >
       <div className="flex flex-col items-center text-center mb-12">
         <div className="w-32 h-32 text-primary mb-6">
           <UtensilsCrossed size={128} strokeWidth={1} />
         </div>
         <h1 className="text-primary text-4xl font-black mb-2 italic">Kin khum</h1>
         <p className="text-accent/60 text-lg leading-snug max-w-[250px]">
           Your personal culinary concierge for smart dining and budget-friendly flavor.
         </p>
       </div>

       <div className="space-y-10 flex-1">
         <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display text-zinc-800">Monthly Food Budget</h2>
            <p className="text-stone-500 text-sm mt-1 font-sans">Enter how much you want to spend this month</p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-[32px] blur-xl group-focus-within:bg-primary/10 transition-colors" />
            <div className="relative bg-white border-2 border-stone-100 rounded-[32px] p-8 shadow-sm group-focus-within:border-primary/30 transition-all flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-3">
                <input 
                  type="text" 
                  placeholder="3000"
                  autoFocus
                  inputMode="numeric"
                  value={pref.monthlyBudget || ''}
                  className="bg-transparent text-primary text-6xl font-black w-56 outline-none text-center placeholder:opacity-20"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const monthly = Number(value);
                    setPref({
                      ...pref, 
                      monthlyBudget: monthly,
                      budget: Math.floor(monthly / 30)
                    });
                  }}
                />
                <span className="text-primary text-2xl font-bold opacity-40 italic">THB</span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-stone-50 w-full flex flex-col items-center gap-2">
                <div className="px-4 py-1.5 bg-orange-50 rounded-full">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">
                    ≈ {Math.floor(pref.monthlyBudget / 30)} THB / DAY
                  </span>
                </div>
                <p className="text-stone-400 text-[10px] font-medium uppercase tracking-tight">Suggested daily limit</p>
              </div>
            </div>
          </div>
         </div>

         <div>
          <h2 className="text-xl font-bold mb-4">Food Preferences</h2>
          <div className="flex flex-wrap gap-3">
             <FilterTag 
                active={pref.halal} 
                label="Halal" 
                onClick={() => setPref({...pref, halal: !pref.halal})} 
              />
             <FilterTag 
                active={pref.vegetarian} 
                label="Vegetarian" 
                onClick={() => setPref({...pref, vegetarian: !pref.vegetarian})} 
              />
             <FilterTag 
                active={pref.budgetFocused} 
                label="Budget-focused" 
                onClick={() => setPref({...pref, budgetFocused: !pref.budgetFocused})} 
              />
          </div>
         </div>
       </div>

       <div className="mt-8">
         <button onClick={() => onComplete(pref)} className="btn-primary w-full group py-6 text-xl">
           Get Started 
           <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
         </button>
       </div>
    </motion.div>
  );
}

function FilterTag({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-full border-2 transition-all flex items-center space-x-2 shadow-sm ${
        active ? 'bg-primary border-primary text-white' : 'bg-white border-black/5 text-accent/60'
      }`}
    >
      {label === 'Budget-focused' ? <Navigation size={18} fill={active ? 'white' : 'currentColor'} /> : <CheckCircle size={18} />}
      <span className="font-bold">{label}</span>
    </button>
  );
}

function HomeScreen({ preferences, onNavigate }: { preferences: UserPreferences; onNavigate: (s: Screen) => void }) {
  // Simulating a fixed daily expenditure to show the logic
  const spentToday = 70; 
  const remainingToday = Math.max(0, preferences.budget - spentToday);
  
  // Calculate what % is LEFT to match the "Remaining Today" header
  const remainingPercentage = preferences.budget > 0 
    ? Math.max(0, Math.floor((remainingToday / preferences.budget) * 100)) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col pb-32"
    >
      <Header />
      <div className="px-6 py-6 border-b border-black/5 bg-white/50 backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-1">Hello, View</h2>
        <p className="text-accent/60 text-lg decoration-primary/30 underline underline-offset-8">Ready to plate up some savings today?</p>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div className="bg-white rounded-[48px] p-10 flex flex-col items-center relative overflow-hidden shadow-[0px_4px_30px_rgba(0,0,0,0.05)] border border-stone-100">
          {/* Top Progress bar (Shows spending progress) */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${100 - remainingPercentage}%` }}
              className={`h-full ${remainingPercentage === 0 && preferences.budget > 0 ? 'bg-red-400' : 'bg-primary'}`}
            />
          </div>

          <span className="text-primary/60 font-black tracking-[0.2em] text-[10px] uppercase mb-4">Remaining Today</span>
          
          <div className="flex items-baseline space-x-2 mb-2">
            <span className={`text-7xl font-black tracking-tighter ${remainingToday === 0 ? 'text-red-500' : 'text-primary'}`}>
              {remainingToday}
            </span>
            <span className="text-primary text-3xl font-bold opacity-60 italic">THB</span>
          </div>

          <div className="flex items-center text-stone-400 font-bold text-[10px] uppercase tracking-widest mb-10">
            <div className={`w-3 h-3 rounded-full mr-2 ${remainingToday === 0 ? 'bg-red-400' : 'bg-primary'}`} />
            {remainingPercentage}% of ฿{preferences.budget} daily budget left
          </div>

          {/* Circular Progress (Shows remaining amount) */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-stone-50" />
              {/* Progress circle (Remaining) */}
              <motion.circle 
                cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={2 * Math.PI * 95}
                initial={{ strokeDashoffset: 2 * Math.PI * 95 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 95) * (1 - remainingPercentage/100) }}
                className={remainingToday === 0 ? 'text-red-100' : 'text-primary'}
                strokeLinecap="round"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-baseline">
                <span className={`text-5xl font-black tracking-tighter ${remainingToday === 0 ? 'text-red-500' : 'text-primary'}`}>
                  {remainingPercentage}
                </span>
                <span className="text-primary text-2xl font-bold">%</span>
              </div>
              <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-center">
                {remainingToday === 0 ? 'Limit Reached' : 'Available'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-[40px] p-8 border border-primary/10">
          <h3 className="text-primary text-2xl font-bold mb-6">Weekly Wins</h3>
          <p className="text-accent/60 font-medium mb-1">Total Saved This Week</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black">350</span>
            <span className="text-xl font-bold opacity-40 uppercase">THB</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MapScreen({ onNavigate, selectedRestaurant, setSelectedRestaurant }: { onNavigate: (s: Screen) => void; selectedRestaurant: Restaurant | null; setSelectedRestaurant: (r: Restaurant | null) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRestaurants = activeFilter === 'All' 
    ? RESTAURANTS 
    : RESTAURANTS.filter(r => {
        if (activeFilter === 'Under 100 THB') return parseInt(r.price) < 100;
        if (activeFilter === 'Street Food') return r.type === 'Street Food';
        return true;
      });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col relative h-[100dvh] bg-stone-100 overflow-hidden"
    >
      <Header />

      {/* Pannable Map Container */}
      <motion.div 
        drag
        dragConstraints={{ left: -1000, right: 0, top: -800, bottom: 0 }}
        dragElastic={0.05}
        className="absolute inset-0 z-0 w-[2000px] h-[1800px] cursor-grab active:cursor-grabbing"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedRestaurant(null);
        }}
      >
        {/* Background Map Image */}
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover grayscale opacity-10" 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000&q=80" 
            alt="Map Background"
          />
          {/* Detailed Map Grid */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', 
                 backgroundSize: '100px 100px' 
               }} />
        </div>

        {/* Map Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredRestaurants.map(rest => (
            <MapMarker 
              key={rest.id} 
              top={rest.location.top} 
              left={rest.location.left} 
              price={rest.price} 
              active={selectedRestaurant?.id === rest.id}
              onClick={() => setSelectedRestaurant(selectedRestaurant?.id === rest.id ? null : rest)}
              variant={parseInt(rest.price) > 100 ? 'dark' : 'primary'}
            />
          ))}
        </div>

        {/* Promotion Overlay */}
        <AnimatePresence mode="wait">
          {selectedRestaurant && (
            <motion.div 
              key={`promo-${selectedRestaurant.id}`}
              initial={{ scale: 0.8, opacity: 0, x: '-50%', y: '-100%' }}
              animate={{ scale: 1, opacity: 1, x: '-50%', y: '-100%' }}
              exit={{ scale: 0.8, opacity: 0, x: '-50%', y: '-100%' }}
              style={{ 
                top: `calc(${selectedRestaurant.location.top} - 12px)`, 
                left: selectedRestaurant.location.left 
              }}
              className="absolute z-40 mb-6"
            >
              <div className="w-[160px] h-[130px] relative rounded-[32px] border-4 border-primary overflow-hidden shadow-2xl bg-white">
                <img src="f1.png" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Promotion" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end pb-3 font-sans">
                  <div className="text-center text-white text-base font-bold leading-tight drop-shadow-md px-2">
                    {selectedRestaurant.promotion.split(' ').slice(0, 2).join(' ')} <br/>
                    {selectedRestaurant.promotion.split(' ').slice(2).join(' ')}
                  </div>
                </div>
              </div>
              <div className="flex justify-center -mt-px">
                <div className="w-4 h-4 bg-primary rotate-45 -mt-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Fixed Overlays (Search, Bottom Card) */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* Search and Filters */}
        <div className="pointer-events-auto absolute left-[18px] top-[96px] w-[calc(100%-36px)] flex flex-col gap-3">
          {/* Search Bar */}
          <div className="self-stretch px-5 py-2 bg-white/95 rounded-full shadow-lg border border-white/40 backdrop-blur-md flex items-center h-14">
              <Search size={20} className="text-stone-400 ml-1" />
              <input 
                type="text"
                placeholder="Explore the map..."
                className="flex-1 px-3 bg-transparent outline-none placeholder-stone-400 text-stone-600 text-base font-normal font-sans"
              />
              <div className="w-[1px] h-6 bg-stone-200 mx-2" />
              <SlidersHorizontal size={20} className="text-brand-amber mr-1" />
          </div>

          {/* Filter Chips */}
          <div className="self-stretch h-12 flex gap-2 overflow-x-auto no-scrollbar relative w-full">
              {['All', 'Under 100 THB', 'Street Food', 'Open Now'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full shadow-md flex items-center justify-center shrink-0 transition-all ${
                    activeFilter === filter ? 'bg-brand-amber text-white' : 'bg-white/80 border border-stone-200 backdrop-blur-md text-stone-600'
                  }`}
                >
                  <span className="text-base font-semibold font-sans">{filter}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Recenter Button Tooltip style */}
        <div className="pointer-events-auto absolute right-6 top-64 flex flex-col gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-stone-100 active:scale-95 transition-all cursor-pointer">
            <Navigation size={22} className="text-brand-amber" />
          </div>
        </div>

        {/* Bottom Card - Find Buddy - Content changes based on selected restaurant */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-24 flex justify-center px-4">
          <AnimatePresence mode="wait">
            {selectedRestaurant ? (
              <motion.div 
                key={selectedRestaurant.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="w-full max-w-[340px] p-5 bg-white/95 rounded-[40px] shadow-[0px_-4px_40px_0px_rgba(55,57,40,0.12)] outline outline-1 outline-offset-[-1px] outline-white/40 backdrop-blur-[20px] flex flex-col justify-start items-start gap-4 mb-2"
              >
                <div className="self-stretch h-12 relative">
                  <div className="left-0 top-[-1px] absolute inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="text-zinc-800 text-lg font-bold font-display leading-tight">Find Buddy</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="text-stone-600 text-sm font-normal font-sans leading-tight truncate w-64">
                      {selectedRestaurant.promotion} at {selectedRestaurant.name}
                    </div>
                    </div>
                  </div>
                  <div className="right-0 top-1 absolute text-brand-amber opacity-80">
                    <Megaphone size={20} />
                  </div>
                </div>

                <div className="self-stretch inline-flex justify-between items-center bg-stone-50/50 p-2 rounded-[28px] -mx-1">
                  <div className="flex -space-x-3">
                    {selectedRestaurant.buddies.map((buddy, idx) => (
                      <div key={idx} className="w-10 h-10 bg-white rounded-full shadow-sm outline outline-2 outline-white overflow-hidden">
                        <img className="w-full h-full object-cover" src={buddy} />
                      </div>
                    ))}
                    {selectedRestaurant.joined.split('/')[0] === '1' && (
                      <div className="w-10 h-10 bg-orange-100 rounded-full shadow-sm outline outline-2 outline-white flex items-center justify-center">
                        <div className="text-brand-amber text-[10px] font-bold font-sans tracking-tighter">+{parseInt(selectedRestaurant.joined.split('/')[1]) - 1}</div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => onNavigate('matching')}
                    className="px-6 py-2.5 bg-brand-amber rounded-full text-white text-xs font-bold font-sans shadow-[0px_4px_12px_rgba(164,74,0,0.25)] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Match Now
                  </button>
                </div>

                <div className="self-stretch inline-flex justify-start items-center gap-3 mt-1">
                  <div className="flex-1 h-1.5 relative bg-orange-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full absolute bg-brand-amber rounded-full" 
                      style={{ width: `${(parseInt(selectedRestaurant.joined.split('/')[0]) / parseInt(selectedRestaurant.joined.split('/')[1])) * 100}%` }}
                    />
                  </div>
                  <div className="inline-flex flex-col justify-start items-start">
                    <div className="text-brand-amber text-[9px] font-black font-sans uppercase tracking-widest italic">{selectedRestaurant.spots}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="px-8 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 text-stone-500 font-medium text-sm"
              >
                Pan the map to explore 🍕
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface MapMarkerProps {
  key?: string | number;
  price: string;
  top: string;
  left: string;
  variant?: 'primary' | 'dark';
  active?: boolean;
  onClick: () => void;
}

function MapMarker({ price, top, left, variant = 'primary', active = false, onClick }: MapMarkerProps) {
  return (
    <div 
      style={{ top, left }} 
      onClick={onClick}
      className={`absolute z-20 flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-300 ${active ? 'scale-125 z-40' : 'scale-100 hover:scale-110'}`}
    >
      <div className={`px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1 transition-all ${
        active ? 'bg-primary ring-4 ring-primary/20' : (variant === 'dark' ? 'bg-[#4A2C2A]' : 'bg-brand-amber')
      }`}>
          <div className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center overflow-hidden">
             <UtensilsCrossed size={6} className={active ? 'text-primary' : (variant === 'dark' ? 'text-[#4A2C2A]' : 'text-brand-amber')} />
          </div>
          <span className="text-white text-[10px] font-bold font-sans whitespace-nowrap">{price} THB</span>
      </div>
      <div className={`w-[2px] h-2.5 ${active ? 'bg-primary' : (variant === 'dark' ? 'bg-[#4A2C2A]' : 'bg-brand-amber')} -mt-px`} />
    </div>
  );
}

function MatchingScreen({ onNavigate, selectedRestaurant }: { onNavigate: (s: Screen) => void; selectedRestaurant: Restaurant | null }) {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  
  const spots = [
    { name: 'Max', role: 'ข้าวหน้าไก่ซอสน้ำปลา', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500&q=80', avatar: 'https://i.pravatar.cc/150?u=1', filled: true },
    { name: 'Valu', role: 'ข้าวหน้าไก่เทอริยากิ', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', avatar: 'https://i.pravatar.cc/150?u=2', filled: true },
    { name: 'Seven', role: 'ข้าวหน้าไก่แซ่บ', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80', avatar: 'https://i.pravatar.cc/150?u=3', filled: true },
    { name: 'Eleven', role: 'ข้าวหน้าไก่แซ่บ', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500&q=80', avatar: 'https://i.pravatar.cc/150?u=4', filled: true },
    { name: 'User', role: 'Available', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', filled: false },
  ];

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      className="flex-1 flex flex-col bg-white min-h-screen"
    >
      <Header />
      
      <div className="px-6 pt-10 pb-40 overflow-y-auto">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-zinc-800 text-2xl font-bold font-display leading-tight">Find Buddy</h2>
          <p className="text-stone-600 text-base font-normal font-sans leading-tight">
            {selectedRestaurant ? `${selectedRestaurant.promotion} at ${selectedRestaurant.name}` : 'Searching nearby...'}
          </p>
        </div>

        <div className="w-full flex items-center gap-2 mb-8">
          <div className="flex-1 h-1.5 relative bg-lime-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '50%' }}
              className="h-full bg-brand-amber rounded-full" 
            />
          </div>
          <span className="text-brand-amber text-[10px] font-bold font-sans uppercase leading-4 whitespace-nowrap">1 spots left</span>
        </div>

        <div className="grid grid-cols-2 gap-x-7 gap-y-10">
          {spots.map((spot, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (!spot.filled) setSelectedSpot(i);
              }}
              className="flex flex-col items-center gap-3.5"
            >
              <div className="relative w-full aspect-square rounded-[10px] overflow-hidden shadow-sm bg-stone-100 group">
                <img 
                  src={spot.img} 
                  className={`w-full h-full object-cover transition-all duration-500 ${ (spot.filled || (selectedSpot === i)) ? 'brightness-[0.45]' : 'brightness-90' }`} 
                />
                
                {(spot.filled || selectedSpot === i) ? (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-11 h-11 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <Check size={24} strokeWidth={4} className="text-zinc-800/80" />
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-stone-600">
                       <Plus size={24} strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-full">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 border-2 border-white shadow-sm shrink-0">
                  <img src={spot.avatar} className="w-full h-full object-cover" alt={spot.name} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-zinc-800 text-lg font-bold font-display leading-tight truncate">
                    {spot.name}
                  </span>
                  <span className="text-stone-600 text-xs font-normal font-sans leading-tight truncate">
                    {spot.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 px-10 z-50">
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => onNavigate('confirmation')}
          disabled={selectedSpot === null}
          className={`w-full py-5 rounded-full text-white text-xl font-bold font-display uppercase tracking-widest shadow-[0px_25px_50px_-12px_rgba(164,74,0,0.30)] transition-all ${selectedSpot === null ? 'bg-stone-300' : 'bg-brand-amber active:scale-95 hover:brightness-110'}`}
        >
          CONFIRM
        </motion.button>
      </div>
    </motion.div>
  );
}

function ConfirmationScreen({ preferences, onNavigate }: { preferences: UserPreferences; onNavigate: (s: Screen) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col"
    >
      <Header />
      <div className="h-2/5 relative overflow-hidden bg-white">
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 -mt-10 bg-surface rounded-t-[40px] px-8 pt-10 text-center flex flex-col items-center">
        <div className="bg-primary p-4 rounded-full text-white mb-6 shadow-xl shadow-primary/20">
          <CheckCircle size={48} fill="currentColor" className="text-white" />
        </div>
        
        <h1 className="text-4xl font-black mb-4 italic leading-tight">Meal Confirmed!</h1>
        <p className="text-accent/60 text-lg leading-relaxed max-w-[280px] mb-10">
          Your culinary choice has been recorded. Saving looks good on you.
        </p>

        {/* Stepper */}
        <div className="flex items-center justify-between w-full max-w-[240px] mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/5 -translate-y-1/2 -z-10" />
          <div className="w-6 h-6 rounded-full bg-black/10" />
          <div className="flex flex-col items-center relative">
            <div className="w-6 h-6 rounded-full bg-primary" />
            <span className="absolute top-8 text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">preparing order</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-black/10" />
          <div className="w-6 h-6 rounded-full bg-black/10" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-10">
          <div className="bg-white p-6 rounded-[32px] text-left border border-black/5">
            <div className="text-primary mb-6"><Navigation size={20} /></div>
            <p className="text-[10px] font-black text-accent/40 uppercase tracking-widest mb-1">Today Left</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black">฿{preferences.budget}</span>
            </div>
            <div className="mt-4 h-1 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3" />
            </div>
          </div>
          
          <div className="bg-primary p-6 rounded-[32px] text-left text-white shadow-xl shadow-primary/20">
            <div className="mb-6"><UtensilsCrossed size={20} /></div>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Total Savings</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-black">฿1,250</span>
            </div>
            <p className="text-[8px] font-bold mt-2 opacity-80">+ 45 from last meal</p>
          </div>
        </div>

        <button onClick={() => onNavigate('home')} className="btn-primary w-full py-6 text-2xl uppercase tracking-widest mb-12">Home</button>
      </div>
    </motion.div>
  );
}

function WhatToEatIntro({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 bg-primary flex flex-col items-center justify-center text-center p-8 z-10"
    >
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl font-black italic mb-20 leading-tight">What to Eat Today?</h1>
        
        <button 
          onClick={() => onNavigate('what-to-eat-result')}
          className="relative w-64 h-64 group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full scale-110 animate-pulse" />
          <div className="absolute inset-0 border-8 border-white/40 rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
             <div className="text-white mb-4"><Dices size={80} strokeWidth={1.5} /></div>
             <span className="text-white text-2xl font-black uppercase tracking-widest max-w-[120px] leading-tight">Random Meal</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function WhatToEatResult({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 bg-primary flex flex-col relative"
    >
      <Header />
      <div className="flex-1 flex items-center justify-center p-8 mt-12 mb-32">
        <motion.div 
          initial={{ y: 50, scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          className="bg-white rounded-[56px] w-full p-8 shadow-2xl flex flex-col"
        >
          <div className="relative rounded-[40px] overflow-hidden mb-8 aspect-[4/3] group shadow-inner">
            <img 
               src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
               alt="Restaurant" 
               className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
            <div className="absolute top-6 right-6 p-4 rounded-full bg-white text-primary/40 shadow-lg">
              <ChevronRight />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
               <h3 className="text-white text-5xl font-black italic leading-none">จูนปัง</h3>
            </div>
          </div>

          <div className="flex justify-between items-start mb-10 px-2">
            <div>
               <h3 className="text-4xl font-black italic mb-2 tracking-tight">จูนปัง</h3>
               <div className="flex items-center space-x-3">
                 <div className="flex items-center text-primary">
                    <CheckCircle size={20} fill="currentColor" className="text-primary mr-1" />
                    <span className="font-black text-xl">4.9</span>
                 </div>
                 <div className="w-1 h-1 bg-black/10 rounded-full" />
                 <span className="text-accent/40 font-bold text-lg">1.2km away</span>
               </div>
            </div>
            <button className="p-4 rounded-full bg-white shadow-xl text-primary transform hover:scale-110 active:scale-95 transition-transform"><Heart size={32} /></button>
          </div>

          <div className="space-y-4">
            <button onClick={() => onNavigate('confirmation')} className="w-full bg-[#A34D00] text-white py-6 rounded-[32px] text-2xl font-black flex items-center justify-center transform active:scale-95 transition-transform shadow-xl">
               <CheckCircle size={32} className="mr-4" />
               Claim & Track
            </button>
            <button onClick={() => onNavigate('what-to-eat-intro')} className="w-full bg-[#E8EBC3] text-accent/60 py-6 rounded-[32px] text-2xl font-black flex items-center justify-center transform active:scale-95 transition-transform shadow-sm">
               <RotateCcw size={32} className="mr-4" />
               Reroll
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
