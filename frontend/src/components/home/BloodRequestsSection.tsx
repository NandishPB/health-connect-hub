import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, ArrowRight, Droplets, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockBloodRequests, getBloodGroupVariant, getUrgencyVariant } from '@/lib/mock-data';

function formatTimeLeft(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 0) return 'Expired';
  if (hours === 0) return `${minutes} mins left`;
  if (hours < 24) return `${hours}h ${minutes}m left`;
  return `${Math.floor(hours / 24)} days left`;
}

export function BloodRequestsSection() {
  const activeRequests = mockBloodRequests.filter(r => r.status === 'active').slice(0, 3);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-destructive" />
              <span className="text-sm font-semibold uppercase tracking-wider text-destructive">
                Urgent Blood Requests
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Someone Needs Your Help
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Active blood donation requests from hospitals near you
            </p>
          </div>
          <Link to="/blood-donation">
            <Button variant="outline" className="gap-2">
              View All Requests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Blood Requests Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeRequests.map((request, index) => (
            <Card
              key={request.id}
              variant={request.urgencyLevel === 'critical' ? 'urgent' : 'elevated'}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={getBloodGroupVariant(request.bloodGroupRequired)} className="text-lg px-4 py-1">
                      {request.bloodGroupRequired}
                    </Badge>
                    <Badge variant={getUrgencyVariant(request.urgencyLevel) as any}>
                      {request.urgencyLevel === 'critical' && (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-base mt-3">{request.hospitalName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{request.locationDescription}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{request.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className={request.urgencyLevel === 'critical' ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                    {formatTimeLeft(request.neededBy)}
                  </span>
                </div>
                {request.notes && (
                  <p className="text-sm text-muted-foreground border-t pt-3 mt-3">
                    {request.notes}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="default" className="flex-1">
                  I Can Donate
                </Button>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-urgent p-8 text-center text-destructive-foreground md:p-12">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">Become a Blood Donor</h3>
          <p className="mb-6 text-lg opacity-90">
            Register as a donor and help save lives in your community. Get notified when your blood type is needed nearby.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/auth?role=donor">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Register as Donor
              </Button>
            </Link>
            <Link to="/blood-donation">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-destructive-foreground/30 text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
