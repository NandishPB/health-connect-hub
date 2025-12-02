import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Globe, Clock, Calendar, Tag, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockHospitals, mockOffers, mockDoctors } from '@/lib/mock-data';

const HospitalDetail = () => {
  const { id } = useParams();
  const hospital = mockHospitals.find(h => h.id === id);
  const offers = mockOffers.filter(o => o.hospitalId === id && o.isActive);
  const doctors = mockDoctors.filter(d => d.hospitalId === id && d.isActive);

  if (!hospital) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold">Hospital not found</h1>
          <Link to="/hospitals">
            <Button className="mt-4">Back to Hospitals</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={hospital.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200'}
          alt={hospital.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container">
            <Link to="/hospitals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Hospitals
            </Link>
            <h1 className="text-2xl font-bold text-foreground md:text-4xl">{hospital.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {hospital.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">{hospital.rating}</span>
                  {hospital.reviewCount && (
                    <span className="text-muted-foreground">({hospital.reviewCount} reviews)</span>
                  )}
                </div>
              )}
              {offers.length > 0 && (
                <Badge variant="success" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {offers.length} Active Offer{offers.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{hospital.description}</p>
                
                {/* Specialties */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty, i) => (
                      <Badge key={i} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctors */}
            {doctors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Doctors</CardTitle>
                  <CardDescription>Meet our team of experienced healthcare professionals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
                        <img
                          src={doctor.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100'}
                          alt={doctor.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          {doctor.qualification && (
                            <p className="text-xs text-muted-foreground mt-1">{doctor.qualification}</p>
                          )}
                          {doctor.experience && (
                            <p className="text-xs text-primary mt-1">{doctor.experience} years experience</p>
                          )}
                          <Button variant="outline" size="sm" className="mt-3 gap-2">
                            <Calendar className="h-3 w-3" />
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Offers */}
            {offers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Special Packages & Offers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {offers.map((offer) => (
                      <Card key={offer.id} variant="featured">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-foreground">{offer.title}</h4>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                          {offer.discountedPrice && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">₹{offer.discountedPrice}</span>
                              {offer.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>
                              )}
                            </div>
                          )}
                          <Button variant="default" size="sm" className="mt-3 w-full">
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card variant="elevated" className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {hospital.address.line}, {hospital.address.city}, {hospital.address.district}, {hospital.address.state} - {hospital.address.pinCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{hospital.phone}</p>
                  </div>
                </div>

                {hospital.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{hospital.email}</p>
                    </div>
                  </div>
                )}

                {hospital.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {hospital.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <Button variant="hero" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full mt-2 gap-2">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification Badge */}
            <Card variant="success">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="font-semibold text-foreground">Verified Hospital</p>
                  <p className="text-sm text-muted-foreground">All details verified by ChikitsaVigyan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HospitalDetail;
