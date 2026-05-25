import React from 'react';
import {
  Grid,
  Car,
  Smartphone,
  Sun,
  Home,
  Sprout,
  Sofa,
  Gem,
  Shirt,
  Briefcase
} from 'lucide-react';
import { CategoryID } from '../types';

interface CategoryIconProps {
  id: CategoryID | string;
  className?: string;
}

export default function CategoryIcon({ id, className = 'w-4 h-4' }: CategoryIconProps) {
  switch (id) {
    case 'all':
      return <Grid className={className} />;
    case 'vehicles':
      return <Car className={className} />;
    case 'electronics':
    case 'phones': // fallback key as compatibility
      return <Smartphone className={className} />;
    case 'solar':
      return <Sun className={className} />;
    case 'realestate':
      return <Home className={className} />;
    case 'agriculture':
    case 'livestock': // fallback key as compatibility
      return <Sprout className={className} />;
    case 'home':
      return <Sofa className={className} />;
    case 'traditional':
      return <Gem className={className} />;
    case 'fashion':
      return <Shirt className={className} />;
    case 'jobs_services':
    case 'jobs': // fallback key
    case 'services': // fallback key
      return <Briefcase className={className} />;
    default:
      return <Grid className={className} />;
  }
}
