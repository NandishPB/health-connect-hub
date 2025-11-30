import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, ArrowRight, Tag, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockHospitals, mockOffers } from '@/lib/mock-data';

export function HospitalsSection() {
  const featuredHospitals = mockHospitals.slice(0, 4);

  const getHospitalOffers = (hospitalId: string) => {
    return mockOffers.filter(o => o.hospitalId === hospitalId && o.isActive);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Recommended Hospitals
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Verified healthcare facilities near you with special offers
            </p>
          </div>
          <Link to="/hospitals">
            <Button variant="outline" className="gap-2">
              View All Hospitals
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Hospitals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredHospitals.map((hospital, index) => {
            const offers = getHospitalOffers(hospital.id);
            return (
              <Card
                key={hospital.id}
                variant="interactive"
                className="group overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'}
                    alt={hospital.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {offers.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="success" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {offers.length} Offer{offers.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-1">{hospital.name}</CardTitle>
                    {hospital.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{hospital.rating}</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {hospital.specialties.slice(0, 3).join(', ')}
                    {hospital.specialties.length > 3 && ` +${hospital.specialties.length - 3}`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="line-clamp-1">{hospital.address.city}, {hospital.address.district}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link to={`/hospitals/${hospital.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Offers Highlight */}
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-foreground">Special Health Packages</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockOffers.slice(0, 4).map((offer, index) => {
              const hospital = mockHospitals.find(h => h.id === offer.hospitalId);
              return (
                <Card key={offer.id} variant="featured" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">{hospital?.name}</span>
                    </div>
                    <h4 className="font-semibold text-foreground line-clamp-1">{offer.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                    {offer.discountedPrice && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">₹{offer.discountedPrice}</span>
                        {offer.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
