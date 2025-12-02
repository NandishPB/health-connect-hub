import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Search, Filter, Tag, Building2, Stethoscope, Calendar, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockHospitals, mockOffers, specialties } from '@/lib/mock-data';

const Hospitals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  const getHospitalOffers = (hospitalId: string) => {
    return mockOffers.filter(o => o.hospitalId === hospitalId && o.isActive);
  };

  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = searchQuery === '' || 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
      hospital.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    
    const matchesOffers = !showOffersOnly || getHospitalOffers(hospital.id).length > 0;
    
    return matchesSearch && matchesSpecialty && matchesOffers;
  });

  return (
    <MainLayout>
      {/* Hero Banner */}
      <section className="bg-gradient-primary py-12 md:py-16">
        <div className="container text-center text-primary-foreground">
          <Building2 className="mx-auto mb-4 h-12 w-12" />
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Find Hospitals Near You</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            Discover verified healthcare facilities, view specialties, check ratings, and explore exclusive health packages and offers.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-40 border-b bg-card/95 backdrop-blur py-4">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hospitals by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialty Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={selectedSpecialty === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialty('all')}
                className="whitespace-nowrap"
              >
                All Specialties
              </Button>
              {specialties.slice(0, 5).map((specialty) => (
                <Button
                  key={specialty.id}
                  variant={selectedSpecialty === specialty.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty.name)}
                  className="whitespace-nowrap"
                >
                  {specialty.name}
                </Button>
              ))}
            </div>

            {/* Offers Toggle */}
            <Button
              variant={showOffersOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOffersOnly(!showOffersOnly)}
              className="gap-2 whitespace-nowrap"
            >
              <Tag className="h-4 w-4" />
              With Offers
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredHospitals.length}</span> hospitals
            </p>
          </div>

          {/* Hospitals Grid */}
          {filteredHospitals.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHospitals.map((hospital, index) => {
                const offers = getHospitalOffers(hospital.id);
                return (
                  <Card
                    key={hospital.id}
                    variant="interactive"
                    className="group overflow-hidden animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600'}
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
                      {hospital.rating && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="gap-1 bg-card/90 backdrop-blur">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            {hospital.rating}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{hospital.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {hospital.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-2">
                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1">
                        {hospital.specialties.slice(0, 3).map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {hospital.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hospital.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{hospital.address.city}, {hospital.address.district}</span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <span>{hospital.phone}</span>
                      </div>

                      {/* Reviews */}
                      {hospital.reviewCount && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-warning shrink-0" />
                          <span>{hospital.reviewCount} reviews</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2 pt-4">
                      <Link to={`/hospitals/${hospital.id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="flat" className="py-12 text-center">
              <CardContent>
                <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Hospitals Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find more results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Special Health Packages</h2>
            <p className="mt-2 text-muted-foreground">
              Exclusive discounts and health check-up packages from our partner hospitals
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockOffers.filter(o => o.isActive).map((offer, index) => {
              const hospital = mockHospitals.find(h => h.id === offer.hospitalId);
              return (
                <Card key={offer.id} variant="featured" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground line-clamp-1">{hospital?.name}</span>
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2">{offer.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{offer.description}</p>
                    {offer.discountedPrice && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">₹{offer.discountedPrice}</span>
                        {offer.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>
                        )}
                        {offer.originalPrice && offer.discountedPrice && (
                          <Badge variant="success" className="ml-auto">
                            {Math.round((1 - offer.discountedPrice / offer.originalPrice) * 100)}% off
                          </Badge>
                        )}
                      </div>
                    )}
                    <Button variant="outline" className="mt-4 w-full">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Hospitals;
