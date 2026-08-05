export type TourCategory =
  | 'boat'
  | 'diving'
  | 'atv'
  | 'jeep'
  | 'paragliding'
  | 'fishing'
  | 'camp'
  | 'transfer'
  | 'hotel';

export type Tour = {
  id: string;
  category: TourCategory;
  title: string;
  operator: string;
  departurePort: string;
  departureTime: string;
  duration: string;
  route: string[];
  mealIncluded: boolean;
  drinkIncluded: boolean;
  foamParty: boolean;
  familyFriendly: boolean;
  diving: boolean;
  rating: number;
  reviewCount: number;
  price: number;
  seatsLeft: number;
  capacity: number;
  image: string;
  description: string;
  latitudeLabel: string;
  longitudeLabel: string;
  mapX: number;
  mapY: number;
  featured?: boolean;
};

export type Booking = {
  id: string;
  tourId: string;
  tourTitle: string;
  operator: string;
  date: string;
  departureTime: string;
  departurePort: string;
  guests: number;
  total: number;
  status: 'Onaylandı' | 'Bekliyor';
  code: string;
};

export type TabKey = 'discover' | 'map' | 'bookings' | 'business';
