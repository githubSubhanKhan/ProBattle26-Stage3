import { Service } from '../../config/types';

export const servicesData: Service[] = [
  {
    id: 1,
    title: "Professional Plumbing Services",
    description: "Expert plumbing solutions for residential and commercial properties",
    category: "Home Services",
    price: 50,
    provider: "John Smith",
    location: "New York, NY",
    rating: 4.8,
    availability: "Mon-Fri, 9AM-6PM"
  },
  {
    id: 2,
    title: "Electrical Repair & Installation",
    description: "Licensed electrician for all your electrical needs",
    category: "Home Services",
    price: 75,
    provider: "Sarah Johnson",
    location: "Los Angeles, CA",
    rating: 4.9,
    availability: "24/7 Emergency Service"
  },
  {
    id: 3,
    title: "House Cleaning Service",
    description: "Thorough cleaning services for homes and offices",
    category: "Cleaning",
    price: 40,
    provider: "Clean Pro LLC",
    location: "Chicago, IL",
    rating: 4.7,
    availability: "7 days a week"
  },
  {
    id: 4,
    title: "Garden Landscaping",
    description: "Beautiful garden design and maintenance services",
    category: "Outdoor",
    price: 60,
    provider: "Green Thumbs Inc",
    location: "Austin, TX",
    rating: 4.6,
    availability: "Weekends preferred"
  }
];