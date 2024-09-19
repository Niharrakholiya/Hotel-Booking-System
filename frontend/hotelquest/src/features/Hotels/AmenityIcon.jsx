import { Wifi, Coffee, CircleParking } from 'lucide-react';
import PoolIcon from '@mui/icons-material/Pool';
const AmenityIcon = ({ amenity }) => {
  switch (amenity) {
    case 'wifi':
      return <Wifi className="h-4 w-4" />;
    case 'parking':
      return <CircleParking className="h-4 w-4" />;
    case 'pool':
      return <PoolIcon className="h-4 w-4" />;
    case 'restaurant':
      return <Coffee className="h-4 w-4" />;
    default:
      return null;
  }
};

export default AmenityIcon;
