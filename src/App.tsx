/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { 
  Home, 
  Map as MapIcon, 
  UtensilsCrossed, 
  Utensils,
  ChevronRight, 
  ChevronLeft,
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
  ChefHat,
  Send,
  ClipboardCheck,
  Flame,
  Sparkles,
  Timer,
  Star,
  User,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  Camera,
  Pencil,
  Wallet,
  Ban,
} from 'lucide-react';
import { Screen, UserPreferences, Restaurant } from './types';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Mock Data
const SAMYAN_CENTER = { lat: 13.7367, lng: 100.5331 };

const RESTAURANTS: Restaurant[] = [
  { id: '1', name: "Chester's Grill (Samyan Mitrtown)", promotion: 'Promotion\n3 Free 2', location: { lat: 13.7328, lng: 100.5287 }, price: '120', type: 'Fast Food', spots: '1 slots left', joined: '4/5', buddies: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80'] },
  { id: '2', name: "Street Somtum (Suanluang Square)", promotion: 'Somtum Deal\nBuy 2 Get 1', location: { lat: 13.7375, lng: 100.5255 }, price: '60', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'] },
  { id: '3', name: "Noodle House (Siam Square)", promotion: 'Noodle Set\nFree Drink', location: { lat: 13.7441, lng: 100.5323 }, price: '45', type: 'Street Food', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'] },
  { id: '4', name: "Khao Man Gai (Samyan)", promotion: 'Specials\nOnly ฿50', location: { lat: 13.7330, lng: 100.5260 }, price: '50', type: 'Street Food', spots: '1 slots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80'] },
  { id: '5', name: "Shabu On The Go (MBK)", promotion: 'Group Deal\n4 Pay 3', location: { lat: 13.7445, lng: 100.5299 }, price: '299', type: 'Buffet', spots: '1 slots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80'] },
  { id: '6', name: "Sushi Express (Siam Paragon)", promotion: 'Sushi Box\n20% Off', location: { lat: 13.7462, lng: 100.5348 }, price: '450', type: 'Japanese', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1517841905240-472988bad1fa?w=100&q=80', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80'] },
  { id: '7', name: "Moo Ping (Chula Soi 12)", promotion: 'Moo Ping\nBuy 10 Get 1', location: { lat: 13.7360, lng: 100.5250 }, price: '10', type: 'Street Food', spots: '5 spots left', joined: '0/5', buddies: [] },
  { id: '8', name: "Ramen Boss (Chamchuri Square)", promotion: 'Ramen Hot\nFree Gyoza', location: { lat: 13.7335, lng: 100.5298 }, price: '180', type: 'Japanese', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&q=80'] },
  { id: '9', name: "Bubble Tea Bar (I'm Park)", promotion: 'Boba Fun\nBuy 1 Get 1', location: { lat: 13.7394, lng: 100.5243 }, price: '55', type: 'Drinks', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1544717297-fa95b9ee91c3?w=100&q=80'] },
  { id: '10', name: "Boat Noodle (Victory Monument Area)", promotion: 'Boat Noodle\n฿15 Only', location: { lat: 13.7649, lng: 100.5393 }, price: '15', type: 'Street Food', spots: '4 spots left', joined: '1/5', buddies: ['https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80'] },
  { id: '11', name: "Pad Thai J (Siam Square Soi 2)", promotion: 'Pad Thai\nFree Topping', location: { lat: 13.7435, lng: 100.5320 }, price: '65', type: 'Street Food', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'] },
  { id: '12', name: "Pizza Hut (Chamchuri Square)", promotion: 'Pizza Party\nBuy 1 Get 1', location: { lat: 13.7332, lng: 100.5295 }, price: '399', type: 'Fast Food', spots: '1 slots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '13', name: "Thai Curry (Chula Canteen)", promotion: 'Curry Rice\nFree Soup', location: { lat: 13.7370, lng: 100.5330 }, price: '80', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '14', name: "Craft Burger (Siam Square)", promotion: 'Burger Set\nFree Fries', location: { lat: 13.7445, lng: 100.5335 }, price: '250', type: 'Western', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '15', name: "Dessert Kingdom (I'm Park)", promotion: 'Sweet Treat\n10% Off', location: { lat: 13.7392, lng: 100.5245 }, price: '120', type: 'Dessert', spots: '4 spots left', joined: '0/4', buddies: [] },
  { id: '16', name: "Chicken Rice (Samyan Market)", promotion: 'Chicken Set\nOnly ฿40', location: { lat: 13.7360, lng: 100.5280 }, price: '40', type: 'Street Food', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'] },
  { id: '17', name: "Grill Station (MBK Food Court)", promotion: 'Grill Day\nSpecial Set', location: { lat: 13.7440, lng: 100.5305 }, price: '150', type: 'Western', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&q=80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'] },
  { id: '18', name: "Salad Garden (Siam Paragon)", promotion: 'Salad Bar\nFree Drink', location: { lat: 13.7465, lng: 100.5350 }, price: '135', type: 'Healthy', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'] },
  { id: '19', name: "Icy Dessert (Suanluang Square)", promotion: 'Ice Cream\nExtra Scoop', location: { lat: 13.7372, lng: 100.5258 }, price: '45', type: 'Dessert', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'] },
  { id: '20', name: "Coffee Club (CU Art Center)", promotion: 'Coffee Mix\nMorning Set', location: { lat: 13.7385, lng: 100.5320 }, price: '95', type: 'Drinks', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80', 'https://images.unsplash.com/photo-1517841905240-472988bad1fa?w=100&q=80'] },
  { id: '21', name: "Thai Seafood", promotion: 'Seafood Day\n20% Off', location: { lat: 13.7290, lng: 100.5260 }, price: '499', type: 'Buffet', spots: '1 slots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '22', name: "Korean BBQ", promotion: 'K-BBQ Fun\n4 Pay 3', location: { lat: 13.7380, lng: 100.5295 }, price: '350', type: 'Buffet', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'] },
  { id: '23', name: "Isan Classic", promotion: 'Isan Hot\nFree Soup', location: { lat: 13.7325, lng: 100.5335 }, price: '80', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1517841905240-472988bad1fa?w=100&q=80'] },
  { id: '24', name: "Taco Bell", promotion: 'Taco Twist\nTaco Tuesday', location: { lat: 13.7350, lng: 100.5245 }, price: '150', type: 'Fast Food', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '25', name: "Vegan Bowl", promotion: 'Green Day\n15% Off', location: { lat: 13.7305, lng: 100.5325 }, price: '180', type: 'Healthy', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '26', name: "Matcha Lab", promotion: 'Matcha Fun\nBuy 1 Get 1', location: { lat: 13.7360, lng: 100.5270 }, price: '120', type: 'Drinks', spots: '1 spots left', joined: '2/3', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'] },
  { id: '27', name: "Crepe Corner", promotion: 'Sweet Crepe\nFree Syrup', location: { lat: 13.7315, lng: 100.5310 }, price: '75', type: 'Dessert', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '28', name: "Steak House", promotion: 'Steak Night\nPremium Set', location: { lat: 13.7340, lng: 100.5250 }, price: '550', type: 'Western', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'] },
  { id: '29', name: "Gyoza King", promotion: 'Gyoza Box\nFree Side', location: { lat: 13.7295, lng: 100.5305 }, price: '140', type: 'Japanese', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '30', name: "Smoothie King", promotion: 'Fruit Mix\n15% Off', location: { lat: 13.7370, lng: 100.5265 }, price: '110', type: 'Drinks', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '31', name: "Chicken Rice J", promotion: 'Rice Set\nExtra Soup', location: { lat: 13.7320, lng: 100.5320 }, price: '55', type: 'Street Food', spots: '4 spots left', joined: '1/5', buddies: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '32', name: "Burger King", promotion: 'King Deal\nOnly ฿199', location: { lat: 13.7355, lng: 100.5290 }, price: '220', type: 'Fast Food', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'] },
  { id: '33', name: "Hot Pot City", promotion: 'Hot Pot Mix\nGroup Deal', location: { lat: 13.7300, lng: 100.5255 }, price: '399', type: 'Buffet', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'] },
  { id: '34', name: "Izakaya Sun", promotion: 'Night Set\n10% Off', location: { lat: 13.7385, lng: 100.5300 }, price: '450', type: 'Japanese', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '35', name: "Pasta Palace", promotion: 'Pasta Love\nSpecial Set', location: { lat: 13.7330, lng: 100.5335 }, price: '280', type: 'Western', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'] },
  { id: '36', name: "Boba Heaven", promotion: 'Boba Sweet\nBuy 2 Get 1', location: { lat: 13.7340, lng: 100.5275 }, price: '45', type: 'Drinks', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '37', name: "Açai Hub", promotion: 'Berry Hub\nSpecial Day', location: { lat: 13.7310, lng: 100.5295 }, price: '240', type: 'Healthy', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '38', name: "Pancake House", promotion: 'Pancake Mix\nFree Jam', location: { lat: 13.7365, lng: 100.5315 }, price: '160', type: 'Dessert', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '39', name: "Fried Chicken Hub", promotion: 'Chicken Fly\nFamily Box', location: { lat: 13.7290, lng: 100.5270 }, price: '130', type: 'Fast Food', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '40', name: "Tom Yum Legend", promotion: 'Tom Yum Hot\nFree Rice', location: { lat: 13.7390, lng: 100.5285 }, price: '90', type: 'Street Food', spots: '2 spots left', joined: '3/5', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'] },
  { id: '41', name: "Wagyu Grill", promotion: 'Wagyu Day\nSpecial Deal', location: { lat: 13.7325, lng: 100.5265 }, price: '850', type: 'Japanese', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '42', name: "Caesar Salad Bar", promotion: 'Cool Salad\n10% Off', location: { lat: 13.7350, lng: 100.5310 }, price: '165', type: 'Healthy', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80'] },
  { id: '43', name: "Gelato Art", promotion: 'Sweet Scoop\nBuy 2 Get 1', location: { lat: 13.7305, lng: 100.5240 }, price: '95', type: 'Dessert', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'] },
  { id: '44', name: "Craft Cola", promotion: 'Craft Soda\nArtisan Deal', location: { lat: 13.7380, lng: 100.5320 }, price: '65', type: 'Drinks', spots: '2 spots left', joined: '1/3', buddies: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '45', name: "BBQ Ribs", promotion: 'Ribs Night\nFriday Feast', location: { lat: 13.7335, lng: 100.5340 }, price: '480', type: 'Western', spots: '1 spots left', joined: '3/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'] },
  { id: '46', name: "Sukiyaki Home", promotion: 'Suki Warm\nComfort Set', location: { lat: 13.7355, lng: 100.5250 }, price: '320', type: 'Japanese', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80'] },
  { id: '47', name: "Somtum Garden", promotion: 'Isan Joy\nZesty Deal', location: { lat: 13.7315, lng: 100.5330 }, price: '70', type: 'Street Food', spots: '3 spots left', joined: '1/4', buddies: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '48', name: "Buffet Mania", promotion: 'Big Meal\nEat All Can', location: { lat: 13.7375, lng: 100.5305 }, price: '599', type: 'Buffet', spots: '2 spots left', joined: '3/5', buddies: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'] },
  { id: '49', name: "Wrap & Roll", promotion: 'Happy Wrap\nHealthy Mix', location: { lat: 13.7280, lng: 100.5295 }, price: '140', type: 'Healthy', spots: '2 spots left', joined: '2/4', buddies: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=80'] },
  { id: '50', name: "Donut Hole", promotion: 'Donut Love\nBuy 5 Get 1', location: { lat: 13.7395, lng: 100.5275 }, price: '35', type: 'Dessert', spots: '5 spots left', joined: '0/5', buddies: [] },
];


export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

function MainApp() {
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
      const timer = setTimeout(() => setCurrentScreen('login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginScreen onLogin={() => setCurrentScreen('setup')} onNavigate={setCurrentScreen} />;
      case 'signup': return <SignUpScreen onSignUp={() => setCurrentScreen('setup')} onNavigate={setCurrentScreen} />;
      case 'setup': return <SetupScreen onComplete={(p) => { setPreferences(p); setCurrentScreen('home'); }} />;
      case 'home': return <HomeScreen preferences={preferences} onNavigate={setCurrentScreen} />;
      case 'food-map': return <MapScreen onNavigate={setCurrentScreen} selectedRestaurant={selectedRestaurant} setSelectedRestaurant={setSelectedRestaurant} />;
      case 'matching': return <MatchingScreen onNavigate={setCurrentScreen} selectedRestaurant={selectedRestaurant} />;
      case 'confirmation': return <ConfirmationScreen preferences={preferences} onNavigate={setCurrentScreen} />;
      case 'what-to-eat-intro': return <WhatToEatIntro onNavigate={setCurrentScreen} setSelectedRestaurant={setSelectedRestaurant} />;
      case 'what-to-eat-result': return <WhatToEatResult onNavigate={setCurrentScreen} restaurant={selectedRestaurant} />;
      case 'profile': return <ProfileScreen onNavigate={setCurrentScreen} preferences={preferences} setPreferences={setPreferences} />;
      default: return <SplashScreen />;
    }
  };

  return (
    <div className="max-w-[393px] mx-auto min-h-screen relative overflow-hidden flex flex-col bg-white">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      
      {/* Bottom Nav */}
      {!['splash', 'login', 'signup', 'setup', 'confirmation', 'matching'].includes(currentScreen) && (
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

// --- Context ---
interface UserContextType {
  profileImage: string;
  setProfileImage: (url: string) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80');
  const [userName, setUserName] = useState('View');

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
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

function Header({ onProfileClick }: { onProfileClick?: () => void }) {
  const { profileImage } = useUser();
  return (
    <div className="sticky top-0 z-50 w-full h-16 px-6 bg-surface/80 backdrop-blur-md flex justify-between items-center">
      <h1 className="text-primary text-2xl font-extrabold font-display leading-8">Kinkhum</h1>
      <button 
        onClick={onProfileClick}
        className="w-9 h-9 rounded-full overflow-hidden shadow-sm active:scale-95 transition-transform border border-primary/20"
      >
        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}

function ProfileScreen({ onNavigate, preferences, setPreferences }: { onNavigate: (s: Screen) => void; preferences: UserPreferences; setPreferences: (p: UserPreferences) => void }) {
  const { profileImage, setProfileImage, userName: globalUserName, setUserName: setGlobalUserName } = useUser();
  const [localUserName, setLocalUserName] = useState(globalUserName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState(profileImage);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLocalImagePreview(previewUrl);
      setHasChanges(true);
    }
  };

  const handleNameChange = (newName: string) => {
    setLocalUserName(newName);
    setHasChanges(true);
  };

  const handleSave = () => {
    setProfileImage(localImagePreview);
    setGlobalUserName(localUserName);
    setHasChanges(false);
  };

  const menuItems = [
    { icon: User, label: 'Personal Info', color: 'bg-orange-50 text-brand-amber' },
    { icon: Ban, label: 'Dietary Preferences', color: 'bg-red-50 text-red-500', detail: preferences.halal ? 'Halal' : preferences.vegetarian ? 'Vegetarian' : 'None' },
    { icon: Wallet, label: 'Budget Settings', color: 'bg-green-50 text-green-600', detail: `฿${preferences.budget}/day` },
    { icon: History, label: 'History', color: 'bg-blue-50 text-blue-500' },
    { icon: Settings, label: 'Settings', color: 'bg-stone-100 text-stone-600' },
    { icon: ShieldCheck, label: 'Privacy & Security', color: 'bg-purple-50 text-purple-500' },
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#FFFDF0] z-[60] flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-800 active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-800 italic">Profile</h2>
        {hasChanges ? (
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-brand-amber text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            Save
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      <div className="flex-1 px-6 pb-12">
        {/* Profile Info Card */}
        <div className="flex flex-col items-center mb-10 pt-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <div className="relative mb-6 cursor-pointer" onClick={handleImageClick}>
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/5">
              <img src={localImagePreview} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brand-amber text-white shadow-lg flex items-center justify-center border-2 border-[#FFFDF0] hover:brightness-110 active:scale-90 transition-transform">
              <Camera size={18} />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input 
                  autoFocus
                  className="bg-transparent text-3xl font-black text-center outline-none border-b-2 border-brand-amber/30 w-32"
                  value={localUserName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
              ) : (
                <h1 className="text-3xl font-black italic tracking-tight text-zinc-900">{localUserName}</h1>
              )}
              <button 
                onClick={() => setIsEditingName(!isEditingName)}
                className="p-1.5 rounded-full bg-white text-stone-400 shadow-sm active:scale-90 transition-transform"
              >
                <Pencil size={12} />
              </button>
            </div>
            <p className="text-stone-400 text-sm font-medium">Standard Member</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="w-full p-5 bg-white rounded-[32px] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-zinc-800 font-bold text-base leading-tight">{item.label}</p>
                  {item.detail && <p className="text-stone-400 text-xs font-medium mt-0.5">{item.detail}</p>}
                </div>
              </div>
              <ChevronRight size={20} className="text-stone-300 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          ))}
        </div>

        {/* Logout Section */}
        <div className="mt-10">
          <button 
            onClick={() => onNavigate('login')}
            className="w-full py-5 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center gap-3 font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
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
      <h1 className="text-white text-6xl font-black italic tracking-tighter">Kin-khum</h1>
    </motion.div>
  );
}

function LoginScreen({ onLogin, onNavigate }: { onLogin: () => void; onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const timerRef = useRef<any>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowPassword(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 2500); // 2.5 seconds as requested (2-3s)
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center bg-white h-screen overflow-y-auto"
    >
      <Header onProfileClick={() => onNavigate('profile')} />
      <div className="flex-1 w-full flex flex-col items-center px-8 text-center py-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#F9873E] text-[56px] font-black leading-tight mb-2"
        >
          Welcome
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-500 text-lg font-medium leading-relaxed max-w-[300px] mb-12"
        >
          Your personal culinary concierge for smart dining.
        </motion.p>

        {/* Input Fields */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4 mb-10"
        >
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 bg-stone-50 rounded-[28px] border-2 border-stone-50 focus:border-[#F9873E]/30 focus:bg-white transition-all outline-none text-zinc-800 font-bold placeholder:text-stone-300"
            />
          </div>
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-8 py-5 bg-stone-50 rounded-[28px] border-2 border-stone-50 focus:border-[#F9873E]/30 focus:bg-white transition-all outline-none text-zinc-800 font-bold placeholder:text-stone-300"
            />
          </div>
          <div className="text-right px-4">
             <button className="text-stone-400 text-sm font-bold">ลืมรหัสผ่าน?</button>
          </div>
        </motion.div>

        <div className="w-full flex flex-col items-center gap-6">
           <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Connect with</p>
           <div className="flex gap-4">
             <button 
               onClick={onLogin}
               className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-white cursor-pointer"
             >
               <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-8 h-8" alt="Google" />
             </button>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-black">
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-7 h-7 invert" alt="Apple" />
             </div>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-[#00B900]">
               <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" className="w-8 h-8" alt="LINE" />
             </div>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-[#1877F2]">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-8 h-8" alt="Facebook" />
             </div>
           </div>
        </div>
      </div>

      <div className="w-full px-8 pb-12 flex flex-col items-center gap-5">
        <button 
          onClick={onLogin}
          className="w-full py-6 bg-[#F9873E] rounded-[32px] text-white text-3xl font-black active:scale-[0.85] transition-transform shadow-xl shadow-[#F9873E]/20"
        >
          เข้าสู่ระบบ
        </button>
        <p className="text-stone-500 font-medium">
          ยังไม่มีสมาชิก? <button onClick={() => onNavigate('signup')} className="text-[#F9873E] font-bold">สมัครสมาชิก</button>
        </p>
      </div>
    </motion.div>
  );
}

function SignUpScreen({ onSignUp, onNavigate }: { onSignUp: () => void; onNavigate: (s: Screen) => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const timerRef = useRef<any>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowPassword(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setShowPassword(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center bg-white h-screen overflow-y-auto"
    >
      <Header onProfileClick={() => onNavigate('profile')} />
      <div className="flex-1 w-full flex flex-col items-center px-8 text-center py-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#F9873E] text-[56px] font-black leading-tight mb-2"
        >
          Join Us
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-500 text-lg font-medium leading-relaxed max-w-[300px] mb-12"
        >
          Create your account and start saving on your meals.
        </motion.p>

        {/* Input Fields */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4 mb-10"
        >
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-8 py-5 bg-stone-50 rounded-[28px] border-2 border-stone-50 focus:border-[#F9873E]/30 focus:bg-white transition-all outline-none text-zinc-800 font-bold placeholder:text-stone-300"
            />
          </div>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 bg-stone-50 rounded-[28px] border-2 border-stone-50 focus:border-[#F9873E]/30 focus:bg-white transition-all outline-none text-zinc-800 font-bold placeholder:text-stone-300"
            />
          </div>
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-8 py-5 bg-stone-50 rounded-[28px] border-2 border-stone-50 focus:border-[#F9873E]/30 focus:bg-white transition-all outline-none text-zinc-800 font-bold placeholder:text-stone-300"
            />
          </div>
        </motion.div>

        <div className="w-full flex flex-col items-center gap-6">
           <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Connect with</p>
           <div className="flex gap-4">
             <button 
               onClick={onSignUp}
               className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-white cursor-pointer"
             >
               <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-8 h-8" alt="Google" />
             </button>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-black">
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-7 h-7 invert" alt="Apple" />
             </div>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-[#00B900]">
               <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" className="w-8 h-8" alt="LINE" />
             </div>
             <div className="w-14 h-14 rounded-full border-2 border-stone-50 flex items-center justify-center shadow-sm active:scale-90 transition-transform bg-[#1877F2]">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-8 h-8" alt="Facebook" />
             </div>
           </div>
        </div>
      </div>

      <div className="w-full px-8 pb-12 flex flex-col items-center gap-5">
        <button 
          onClick={onSignUp}
          className="w-full py-6 bg-[#F9873E] rounded-[32px] text-white text-3xl font-black active:scale-[0.85] transition-transform shadow-xl shadow-[#F9873E]/20"
        >
          สมัครสมาชิก
        </button>
        <p className="text-stone-500 font-medium">
          มีสมาชิกอยู่แล้ว? <button onClick={() => onNavigate('login')} className="text-[#F9873E] font-bold">เข้าสู่ระบบ</button>
        </p>
      </div>
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
  const { userName } = useUser();
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
      <Header onProfileClick={() => onNavigate('profile')} />
      <div className="px-6 py-6 border-b border-black/5 bg-white/50 backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-1">Hello, {userName}</h2>
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

// Helper to recenter map
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true });
  }, [lat, lng, map]);
  return null;
}

function MapScreen({ onNavigate, selectedRestaurant, setSelectedRestaurant }: { onNavigate: (s: Screen) => void; selectedRestaurant: Restaurant | null; setSelectedRestaurant: (r: Restaurant | null) => void }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    price: 'All',
    category: 'All'
  });

  const filteredRestaurants = RESTAURANTS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = filters.price === 'All' || 
      (filters.price === 'Under 100 THB' && parseInt(r.price) < 100) ||
      (filters.price === '100 - 300 THB' && parseInt(r.price) >= 100 && parseInt(r.price) <= 300) ||
      (filters.price === 'Over 300 THB' && parseInt(r.price) > 300);
    
    const matchesCategory = filters.category === 'All' || r.type === filters.category;
    
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const panToRestaurant = (rest: Restaurant) => {
    setSelectedRestaurant(rest);
    setSearchQuery('');
  };

  // Custom marker icon creation
  const createMarkerIcon = (price: string, active: boolean, variant: 'primary' | 'dark') => {
    // Coral Orange (#FF7F50) for recommended/value, Dark Gray (#2D2D2D) for others
    const colorClass = active ? '#FF7F50' : (variant === 'dark' ? '#2D2D2D' : '#FF7F50');
    const iconSize = active ? 'scale-125' : 'scale-100';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="flex flex-col items-center -translate-x-1/2 -translate-y-[100%] transition-all duration-300 ${iconSize}">
          <div class="px-2.5 py-1.5 rounded-full shadow-md drop-shadow-sm flex items-center gap-1" style="background-color: ${colorClass};">
            <div class="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center overflow-hidden">
               <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="${colorClass}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 8-8 8-4-4"/></svg>
            </div>
            <span class="text-white text-[10px] font-bold whitespace-nowrap">${price} THB</span>
          </div>
          <div class="w-[2px] h-2.5 -mt-px shadow-sm" style="background-color: ${colorClass};"></div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col relative h-[100dvh] bg-stone-100 overflow-hidden"
    >
      <Header onProfileClick={() => onNavigate('profile')} />

      {/* Leaflet Map Container */}
      <div className="absolute inset-x-0 bottom-0 top-16 z-0">
        <MapContainer 
          center={[SAMYAN_CENTER.lat, SAMYAN_CENTER.lng]} 
          zoom={16} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', outline: 'none' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            className="map-tiles grayscale-[0.2]"
          />
          
          {selectedRestaurant && (
            <RecenterMap lat={selectedRestaurant.location.lat} lng={selectedRestaurant.location.lng} />
          )}

          {filteredRestaurants.map(rest => (
            <Marker 
              key={rest.id} 
              position={[rest.location.lat, rest.location.lng]}
              icon={createMarkerIcon(rest.price, selectedRestaurant?.id === rest.id, parseInt(rest.price) > 100 ? 'dark' : 'primary')}
              eventHandlers={{
                click: () => setSelectedRestaurant(selectedRestaurant?.id === rest.id ? null : rest),
              }}
            >
              {selectedRestaurant?.id === rest.id && (
                <Popup className="custom-popup" closeButton={false} offset={[0, -60]}>
                  <div className="w-[192px] h-[160px] relative rounded-[32px] overflow-hidden shadow-2xl bg-white outline outline-[3px] outline-offset-[-3px] outline-[#F9873E]">
                    <img 
                      src={`https://images.unsplash.com/photo-${['1504674900247-0877df9cc836', '1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1493770348161-369560ae357d'][parseInt(rest.id) % 4]}?w=400&q=80`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt="Promotion" 
                    />
                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Figma-styled Content */}
                    <div className="absolute inset-0 px-4 pt-20 flex items-center justify-center">
                       <div className="text-center text-white text-xl font-medium font-['Lexend'] leading-6 whitespace-pre-line drop-shadow-lg">
                         {rest.promotion}
                       </div>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Fixed Overlays (Search, Bottom Card) */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {/* Search and Filters */}
        <div className="pointer-events-auto absolute left-[18px] top-[96px] w-[calc(100%-36px)] flex flex-col gap-3">
          {/* Search Bar */}
          <div className="self-stretch px-5 py-2 bg-white/95 rounded-full shadow-xl drop-shadow-md border border-white/40 backdrop-blur-md flex items-center h-14">
              <Search size={20} className="text-stone-400 ml-1" />
              <input 
                type="text"
                placeholder="Explore Chula area map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 bg-transparent outline-none placeholder-stone-400 text-stone-600 text-base font-normal font-sans"
              />
              <div className="w-[1px] h-6 bg-stone-200 mx-2" />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center transition-colors ${showFilters ? 'text-brand-amber' : 'text-stone-400'}`}
              >
                <SlidersHorizontal size={20} className="mr-1" />
              </button>
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/95 rounded-[24px] shadow-xl border border-stone-100 overflow-hidden backdrop-blur-md max-h-[300px] overflow-y-auto no-scrollbar"
              >
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => panToRestaurant(r)}
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Utensils size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold text-stone-800">{r.name}</div>
                        <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{r.type} • {r.price} THB</div>
                      </div>
                      <ChevronRight size={16} className="text-stone-300" />
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-stone-400 text-sm font-medium">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Active Filters Display (Optional but helpful) */}
          {(filters.price !== 'All' || filters.category !== 'All') && (
            <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar">
              {filters.price !== 'All' && (
                <div className="bg-brand-amber/10 border border-brand-amber/20 px-3 py-1 rounded-full flex items-center">
                  <span className="text-xs font-bold text-brand-amber">{filters.price}</span>
                </div>
              )}
              {filters.category !== 'All' && (
                <div className="bg-brand-amber/10 border border-brand-amber/20 px-3 py-1 rounded-full flex items-center">
                  <span className="text-xs font-bold text-brand-amber">{filters.category}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Modal Overlay */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="pointer-events-auto absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-[90]"
              />
              <motion.div 
                initial={{ y: -20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                className="pointer-events-auto absolute top-32 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)] max-w-sm bg-white rounded-[40px] shadow-2xl z-[100] p-8 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-display text-zinc-800">Map Filters</h3>
                  <button 
                    onClick={() => {
                      setFilters({ price: 'All', category: 'All' });
                    }}
                    className="text-xs font-bold text-brand-amber uppercase tracking-wider"
                  >
                    Reset All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Price Filter */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-stone-400 uppercase tracking-[2px]">Budget Per Person</span>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Under 100 THB', '100 - 300 THB', 'Over 300 THB'].map(p => (
                        <button
                          key={p}
                          onClick={() => setFilters(prev => ({ ...prev, price: p }))}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                            filters.price === p 
                            ? 'bg-brand-amber text-white shadow-lg shadow-brand-amber/20' 
                            : 'bg-stone-50 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-stone-400 uppercase tracking-[2px]">Food Category</span>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar pb-2">
                      {['All', 'Street Food', 'Fast Food', 'Buffet', 'Japanese', 'Western', 'Drinks', 'Healthy', 'Dessert'].map(c => (
                        <button
                          key={c}
                          onClick={() => setFilters(prev => ({ ...prev, category: c }))}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                            filters.category === c 
                            ? 'bg-brand-amber text-white shadow-lg shadow-brand-amber/20' 
                            : 'bg-stone-50 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-8 py-4 bg-zinc-800 rounded-3xl text-white font-bold tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  APPLY FILTERS
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
                  <div className="flex -space-x-1.5">
                    {selectedRestaurant.buddies.map((buddy, idx) => {
                      const isPlaceholder = buddy.includes('.png');
                      const avatarUrl = isPlaceholder 
                        ? `https://i.pravatar.cc/100?u=${selectedRestaurant.id}-${idx}` 
                        : buddy;
                      return (
                        <div key={idx} className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-black/5">
                          <img className="w-full h-full object-cover" src={avatarUrl} alt="Buddy" />
                        </div>
                      );
                    })}
                    {selectedRestaurant.joined.split('/')[0] === '1' && (
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
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

function MatchingScreen({ onNavigate, selectedRestaurant }: { onNavigate: (s: Screen) => void; selectedRestaurant: Restaurant | null }) {
  const { userName, profileImage } = useUser();

  // Dynamic Data Mapping based on cuisine/restaurant type
  const restaurantCuisineData: Record<string, { menus: string[], images: string[] }> = {
    'Japanese': {
      menus: ['Salmon Sashimi', 'Tonkotsu Ramen', 'Tempura Set', 'Unagi Don', 'Spicy Tuna Roll'],
      images: [
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
        'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80',
        'https://images.unsplash.com/photo-1583953623787-ada99d338235?w=400&q=80',
      ]
    },
    'Street Food': {
      menus: ['Somtum Thai', 'Khao Man Gai', 'Pad Thai', 'Moo Ping', 'Crispy Pork'],
      images: [
        'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400&q=80',
        'https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?w=400&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
        'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&q=80',
      ]
    },
    'Western': {
      menus: ['Truffle Pizza', 'Carbonara Pasta', 'Beef Steak', 'BBQ Ribs', 'Caesar Salad'],
      images: [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
        'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
      ]
    },
    'Fast Food': {
      menus: ['Double Cheese Burger', 'Chicken Wings', 'French Fries', 'Spicy Burger'],
      images: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',
      ]
    },
    'Buffet': {
      menus: ['Premium Shabu', 'Wagyu Beef', 'Seafood Platter', 'Dessert Buffet'],
      images: [
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
      ]
    },
    'Healthy': {
      menus: ['Quinoa Salad', 'Poke Bowl', 'Green Smoothie', 'Vegan Wrap'],
      images: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
      ]
    },
    'Drinks': {
      menus: ['Boba Milk Tea', 'Matcha Latte', 'Iced Americano', 'Fruit Smoothie'],
      images: [
        'https://images.unsplash.com/photo-1544717297-fa95b9ee91c3?w=400&q=80',
        'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?w=400&q=80',
        'https://images.unsplash.com/photo-1461023233867-0ce690327429?w=400&q=80',
      ]
    },
    'Dessert': {
      menus: ['Honey Toast', 'Fluffy Pancake', 'Chocolate Crepe', 'Icy Bing-su'],
      images: [
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&q=80',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80',
      ]
    }
  };

  const NAMES = ['Sarah', 'Mike', 'Aum', 'Koy', 'James', 'Alice', 'Ploy', 'Nut'];
  const AVATARS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80'
  ];

  // Logic to determine which data to show
  const generatedBuddies = useMemo(() => {
    // If no restaurant selected, pick a random trending type
    const cuisines = Object.keys(restaurantCuisineData);
    const type = selectedRestaurant?.type || cuisines[Math.floor(Math.random() * cuisines.length)];
    const data = restaurantCuisineData[type] || restaurantCuisineData['Western'];
    
    // Extract capacity from "joined" (e.g., "2/4")
    const joinedParts = (selectedRestaurant?.joined || '2/4').split('/');
    const bookedCount = parseInt(joinedParts[0]) || 0;
    const totalCapacity = parseInt(joinedParts[1]) || 8; // Default to 8 if not specified

    return Array.from({ length: totalCapacity }, (_, i) => ({
      id: i + 1,
      restaurant: selectedRestaurant?.name || `Top Choice ${i + 1}`,
      user: NAMES[i % NAMES.length],
      menu: data.menus[i % data.menus.length],
      // Use category-based image if available, otherwise generic food image from unsplash
      foodImg: data.images[i % data.images.length] || `https://source.unsplash.com/featured/?${type.toLowerCase()},food&sig=${i}`,
      userImg: AVATARS[i % AVATARS.length],
      isBooked: i < bookedCount
    }));
  }, [selectedRestaurant]);

  const [buddies, setBuddies] = useState(generatedBuddies);

  // Sync state if selectedRestaurant changes
  useEffect(() => {
    setBuddies(generatedBuddies);
    setSelectedId(null);
  }, [generatedBuddies]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const availableCount = buddies.filter(b => !b.isBooked).length;

  const toggleBooking = (id: number) => {
    const buddy = buddies.find(b => b.id === id);
    if (!buddy || buddy.isBooked) return;
    setSelectedId(prev => prev === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      className="flex-1 flex flex-col bg-[#FDFBF7] min-h-screen"
    >
      <Header onProfileClick={() => onNavigate('profile')} />
      
      <div className="px-6 pt-6 pb-40 flex-1 overflow-y-auto no-scrollbar">
        <button 
          onClick={() => onNavigate('food-map')}
          className="mb-6 w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-800 active:scale-95 transition-all"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-zinc-800 text-3xl font-black font-display italic tracking-tight uppercase leading-tight">
            Find Buddy {selectedRestaurant ? `at ${selectedRestaurant.name}` : ''}
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            {selectedRestaurant ? `Join friends for ${selectedRestaurant.type} nearby` : 'Check out popular spots nearby'}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="mb-8 p-5 bg-white rounded-[32px] shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-3">
            <span className={`font-black text-xs uppercase tracking-[0.15em] ${availableCount < 2 ? 'text-red-500 animate-pulse' : 'text-[#A3432D]'}`}>
              {availableCount} {availableCount === 1 ? 'SPOT' : 'SPOTS'} LEFT
            </span>
            <Users size={16} className={availableCount < 2 ? 'text-red-500' : 'text-brand-amber'} />
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(availableCount / buddies.length) * 100}%` }}
              className={`h-full rounded-full shadow-[0_0_8px_rgba(255,191,0,0.5)] ${availableCount < 2 ? 'bg-red-500 shadow-red-500/50' : 'bg-brand-amber'}`}
            />
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 pb-10">
          {buddies.map((buddy) => {
            const isSelected = selectedId === buddy.id;
            const displayUser = isSelected ? userName : (buddy.isBooked ? buddy.user : "");
            const displayImg = isSelected ? profileImage : (buddy.isBooked ? buddy.userImg : "");
            const hasUser = displayUser !== "";

            return (
              <motion.div
                key={buddy.id}
                whileTap={!buddy.isBooked ? { scale: 0.95 } : {}}
                onClick={() => toggleBooking(buddy.id)}
                className="relative group cursor-pointer transition-all duration-300"
              >
                {/* Food Image Card */}
                <div className={`relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-md border-2 transition-all duration-300 ${
                  isSelected ? 'border-brand-amber ring-4 ring-brand-amber/10 scale-[1.02]' : 'border-white'
                }`}>
                  <img 
                    src={buddy.foodImg} 
                    alt={buddy.menu} 
                    className={`w-full h-full object-cover transition-all duration-500 ${buddy.isBooked && !isSelected ? 'opacity-40 grayscale-[0.4]' : 'opacity-100'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=400&q=80';
                    }}
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    {buddy.isBooked && !isSelected ? (
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Check size={28} strokeWidth={4} />
                      </div>
                    ) : isSelected ? (
                      <div className="w-12 h-12 rounded-full bg-brand-amber flex items-center justify-center text-white shadow-xl shadow-brand-amber/30 animate-in zoom-in-50 duration-300">
                        <Check size={28} strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-amber shadow-lg border border-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={28} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 px-1">
                  <div className="flex items-center gap-2 mb-1.5 min-w-0">
                    {hasUser ? (
                      <>
                        <img src={displayImg} alt={displayUser} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow-sm shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-800 font-black italic text-sm leading-none truncate tracking-tight">{displayUser}</p>
                          <p className="text-[#A3432D] font-bold text-[10px] uppercase mt-1 tracking-wider truncate">{buddy.restaurant}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center shrink-0">
                          <User size={16} className="text-stone-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-300 font-black italic text-sm leading-none truncate tracking-tight">Available</p>
                          <p className="text-stone-300 font-bold text-[10px] uppercase mt-1 tracking-wider truncate">{buddy.restaurant}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-stone-400 font-medium text-[11px] truncate pl-0.5">{buddy.menu}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirm Button Overlay */}
      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent pointer-events-none">
        <button
          onClick={() => selectedId && onNavigate('confirmation')}
          disabled={!selectedId}
          className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-lg transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 pointer-events-auto ${
            selectedId 
              ? 'bg-[#A3432D] text-white active:scale-95 shadow-[#A3432D]/30' 
              : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
          }`}
        >
          {selectedId ? 'Confirm Selection' : 'Pick a Buddy'}
        </button>
      </div>
    </motion.div>
  );
}

function ConfirmationScreen({ preferences, onNavigate }: { preferences: UserPreferences; onNavigate: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 3000);
    const timer2 = setTimeout(() => setStep(3), 7000);
    const timer3 = setTimeout(() => setStep(4), 12000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const STAGES = [
    { title: 'Sent', icon: Send },
    { title: 'Confirm', icon: ClipboardCheck },
    { title: 'Cooking', icon: Flame },
    { title: 'Served', icon: Sparkles }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-[#FDFBF7]"
    >
      {/* Premium Full-Width Image Header */}
      <div className="h-[11%] w-full relative overflow-hidden group">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80" 
          className="w-full h-full object-cover" 
          alt="Confirmed Meal"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent opacity-80" />
        <button 
           onClick={() => onNavigate('home')}
           className="absolute top-14 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 active:scale-90 transition-transform"
        >
          <ChevronLeft />
        </button>
      </div>

      {/* Main Content: centered and refined typography */}
      <div className="flex-1 flex flex-col items-center justify-start text-center px-10 pt-8">
        <motion.div
           key={step}
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="flex flex-col items-center"
        >
          <h1 className="text-zinc-900 text-5xl font-black italic tracking-tight mb-4 leading-none">
            {step === 4 ? 'Bon Appétit!' : 'Order Confirmed'}
          </h1>
          <p className="text-stone-500 text-xl font-medium tracking-tight">
            {step === 1 && "Relaying request to kitchen..."}
            {step === 2 && "Restaurant received your order."}
            {step === 3 && "Chef is working their magic."}
            {step === 4 && "Your table is ready"}
          </p>
          
          {step === 4 && (
             <motion.button
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               onClick={() => onNavigate('home')}
               className="mt-10 px-8 py-4 bg-brand-amber text-white rounded-full font-black shadow-lg shadow-brand-amber/20 active:scale-95 transition-all"
             >
               Explore More
             </motion.button>
          )}
        </motion.div>
      </div>

      {/* Borderless Progress Timeline at the very bottom */}
      <div className="w-full pb-16 pt-8 border-t border-stone-100/50">
        <div className="max-w-sm mx-auto px-8 relative">
          {/* Progress Track */}
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-stone-100" />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `calc(${((step - 1) / (STAGES.length - 1)) * 100}% - 24px)` }}
            className="absolute top-5 left-10 h-0.5 bg-brand-amber origin-left"
          />
          
          <div className="flex justify-between items-start relative z-10">
            {STAGES.map((s, i) => {
              const active = step >= i + 1;
              const isCurrent = step === i + 1;
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <motion.div 
                    animate={isCurrent ? { 
                      scale: [1, 1.2, 1],
                      boxShadow: ["0 0 0 0 rgba(249,135,62,0)", "0 0 0 8px rgba(249,135,62,0.1)", "0 0 0 0 rgba(249,135,62,0)"]
                    } : {}}
                    transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      active ? 'bg-brand-amber text-white' : 'bg-stone-50 text-stone-300'
                    }`}
                  >
                    <Icon size={18} strokeWidth={active ? 3 : 2} />
                  </motion.div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    active ? 'text-zinc-800' : 'text-stone-300'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WhatToEatIntro({ onNavigate, setSelectedRestaurant }: { onNavigate: (s: Screen) => void; setSelectedRestaurant: (r: Restaurant | null) => void }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const categories = ['Street Food', 'Fast Food', 'Buffet', 'Japanese', 'Western', 'Healthy', 'Dessert', 'Drinks'];

  const handleRandomize = () => {
    setIsRandomizing(true);
    
    // Logic remains the same, but deferred
    setTimeout(() => {
      let pool = RESTAURANTS;
      if (selectedTypes.length > 0) {
        pool = pool.filter(r => selectedTypes.includes(r.type));
      }
      if (priceFilter !== 'All') {
        pool = pool.filter(r => {
          const price = parseInt(r.price);
          if (priceFilter === 'Under 100 THB') return price < 100;
          if (priceFilter === '100 - 300 THB') return price >= 100 && price <= 300;
          if (priceFilter === 'Over 300 THB') return price > 300;
          return true;
        });
      }
      if (pool.length === 0) pool = RESTAURANTS;
      const random = pool[Math.floor(Math.random() * pool.length)];
      setSelectedRestaurant(random);
      setIsRandomizing(false);
      onNavigate('what-to-eat-result');
    }, 2000);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 bg-white flex flex-col relative overflow-hidden"
    >
      <Header onProfileClick={() => onNavigate('profile')} />
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 scale-[0.9] transform origin-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
           <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
           <h1 className="text-primary text-5xl font-black italic leading-tight relative">What to Eat<br/>Today?</h1>
        </motion.div>
        
        <motion.button 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          onClick={handleRandomize}
          disabled={isRandomizing}
          className="relative w-64 h-64 group"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 animate-pulse" />
          <div className="absolute inset-0 border-8 border-primary/20 rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary rounded-full shadow-2xl shadow-primary/40 transform group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
             <div className="text-white mb-4"><Dices size={80} strokeWidth={1.5} /></div>
             <span className="text-white text-2xl font-black uppercase tracking-widest max-w-[120px] leading-tight text-center">Random Meal</span>
          </div>
        </motion.button>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isRandomizing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary z-[200] flex flex-col items-center justify-center text-center"
          >
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                scale: { repeat: Infinity, duration: 1 }
              }}
              className="text-white mb-12"
            >
              <Utensils size={100} strokeWidth={1.5} />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-white text-4xl font-black italic tracking-tight">Shuffling Flavors...</h2>
              <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">Finding your perfect match</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Filter Button */}
      {!isRandomizing && (
        <button 
          onClick={() => setShowFilters(true)}
          className="fixed bottom-32 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-primary border border-primary/10 z-40 transform active:scale-90 transition-transform"
        >
          <SlidersHorizontal size={24} />
          {(selectedTypes.length > 0 || priceFilter !== 'All') && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-amber text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
              {selectedTypes.length + (priceFilter !== 'All' ? 1 : 0)}
            </div>
          )}
        </button>
      )}

      {/* Filter Options Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[110] p-8 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic tracking-tight text-primary">Filters</h3>
                <button 
                  onClick={() => {
                    setSelectedTypes([]);
                    setPriceFilter('All');
                  }}
                  className="text-xs font-black text-brand-amber uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] mb-4">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Under 100 THB', '100 - 300 THB', 'Over 300 THB'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPriceFilter(p)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          priceFilter === p 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-stone-50 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] mb-4">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => {
                      const active = selectedTypes.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            if (active) setSelectedTypes(prev => prev.filter(t => t !== cat));
                            else setSelectedTypes(prev => [...prev, cat]);
                          }}
                          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            active 
                            ? 'bg-primary text-white shadow-lg' 
                            : 'bg-stone-50 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="btn-primary w-full py-5 text-xl"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WhatToEatResult({ onNavigate, restaurant }: { onNavigate: (s: Screen) => void; restaurant: Restaurant | null }) {
  if (!restaurant) return null;

  const handleClaim = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`;
    window.open(mapsUrl, '_blank');
    onNavigate('confirmation');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 bg-surface flex flex-col"
    >
      <Header onProfileClick={() => onNavigate('profile')} />
      <div className="flex-1 flex items-center justify-center p-8 mt-2 mb-20 scale-90 sm:scale-100 transform origin-center">
        <motion.div 
          initial={{ y: 50, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          className="w-80 h-[525px] relative bg-white rounded-[48px] shadow-[0px_24px_48px_0px_rgba(28,28,25,0.06)] outline outline-1 outline-offset-[-1px] outline-stone-400/10 overflow-hidden"
        >
            <div className="w-72 h-56 left-[16px] top-[16px] absolute rounded-[32px] overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src={`https://images.unsplash.com/photo-${['1504674900247-0877df9cc836', '1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1493770348161-369560ae357d'][parseInt(restaurant.id) % 4]}?w=600&q=80`} 
                  alt={restaurant.name}
                />
            </div>

            <div className="w-72 left-[16px] top-[260px] absolute flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="text-zinc-800 text-2xl font-bold font-display leading-8">{restaurant.name}</div>
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 text-zinc-800">
                             <Star className="w-3.5 h-3.5 fill-brand-amber text-brand-amber" />
                             <span className="text-sm font-semibold font-sans leading-5">4.9</span>
                        </div>
                        <span className="text-stone-600 text-xs font-medium font-sans leading-4">• 1.2km away</span>
                    </div>
                </div>
                <button className="p-2 rounded-full flex items-center justify-center text-brand-amber">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            <div className="w-72 left-[16px] bottom-10 absolute flex flex-col justify-start items-start gap-3">
                <button 
                  onClick={handleClaim}
                  className="self-stretch py-4 relative bg-brand-amber rounded-full inline-flex justify-center items-center gap-2 shadow-lg shadow-brand-amber/20 hover:brightness-110 active:scale-95 transition-all"
                >
                    <ClipboardCheck className="w-4 h-4 text-white" />
                    <div className="text-center text-white text-base font-bold font-sans leading-6">Claim & Track</div>
                </button>
                <button 
                  onClick={() => onNavigate('what-to-eat-intro')}
                  className="self-stretch py-4 bg-lime-100 rounded-full inline-flex justify-center items-center gap-2 hover:bg-lime-200 active:scale-95 transition-all"
                >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-800" />
                    <div className="text-center text-zinc-800 text-base font-bold font-sans leading-6">Reroll</div>
                </button>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
