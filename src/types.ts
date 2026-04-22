/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 
  | 'splash' 
  | 'setup' 
  | 'home' 
  | 'food-map' 
  | 'matching' 
  | 'confirmation' 
  | 'what-to-eat-intro' 
  | 'what-to-eat-result';

export interface UserPreferences {
  monthlyBudget: number;
  budget: number;
  halal: boolean;
  vegetarian: boolean;
  budgetFocused: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  promotion: string;
  location: { top: string; left: string };
  price: string;
  type: string;
  spots: string;
  joined: string;
  buddies: string[];
}
