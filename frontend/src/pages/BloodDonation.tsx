import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Phone, Droplets, AlertTriangle, Filter, Search, Heart, Plus, Users, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { bloodGroups, getBloodGroupVariant, getUrgencyVariant } from '@/lib/mock-data';
import { BloodGroup } from '@/types';
import { bloodRequestsAPI, type BloodRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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

const BloodDonation = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState({
    activeRequests: 0,
    availableDonors: 0,
    livesSaved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [requestsData, statsData] = await Promise.all([
          bloodRequestsAPI.getAll(),
          bloodRequestsAPI.getStats(),
        ]);
        setBloodRequests(requestsData.requests);
        setStats(statsData);
      } catch (err: any) {
        console.error('Failed to fetch blood requests:', err);
        toast({
          title: 'Failed to load blood requests',
          description: err.message || 'Could not fetch blood requests.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredRequests = bloodRequests.filter(request => {
    const matchesBloodGroup = selectedBloodGroup === 'all' || request.blood_group_required === selectedBloodGroup;
    const matchesSearch = searchQuery === '' || 
      (request.hospital_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.location_description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBloodGroup && matchesSearch && request.status === 'ACTIVE';
  });

  const handleDonateClick = async (requestId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to respond to blood requests.',
        variant: 'destructive',
      });
      navigate('/auth?mode=register&role=donor&redirect=/blood-donation');
      return;
    }

    try {
      setRespondingTo(requestId);
      const response = await bloodRequestsAPI.respond(requestId);
      toast({
        title: 'Thank You!',
        description: response.message,
      });
      // Refresh the requests to update responder count
      const requestsData = await bloodRequestsAPI.getAll();
      setBloodRequests(requestsData.requests);
      // Refresh stats too
      const statsData = await bloodRequestsAPI.getStats();
      setStats(statsData);
    } catch (err: any) {
      const errorMessage = err.message || 'Could not submit your response.';
      const isNotDonor = errorMessage.includes('Only registered donors') || errorMessage.includes('donor');
      
      toast({
        title: 'Failed to respond',
        description: isNotDonor 
          ? 'You need to register as a donor first. Click "Become a Donor" to register.'
          : errorMessage,
        variant: 'destructive',
      });
      
      // If user is not a donor, suggest they register
      if (isNotDonor) {
        setTimeout(() => {
          navigate('/auth?mode=register&role=donor&redirect=/blood-donation');
        }, 2000);
      }
    } finally {
      setRespondingTo(null);
    }
  };

  const displayStats = [
    { icon: Droplets, value: stats.activeRequests, label: 'Active Requests' },
    { icon: Users, value: stats.availableDonors, label: 'Available Donors' },
    { icon: CheckCircle, value: stats.livesSaved, label: 'Lives Saved' },
  ];

  return (
    <MainLayout>
      {/* Hero Banner */}
      <section className="bg-gradient-urgent py-12 md:py-16">
        <div className="container text-center text-destructive-foreground">
          <Droplets className="mx-auto mb-4 h-12 w-12" />
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Blood Emergency & Donation</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            Every drop counts. Find urgent blood requests in your area and help save lives. 
            Register as a donor to get notified when your blood type is needed.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/auth?mode=register&role=donor">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                <Heart className="h-5 w-5" />
                Become a Donor
              </Button>
            </Link>
            <Link to="/auth?mode=register&role=hospital">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-destructive-foreground/30 text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground">
                <Plus className="h-5 w-5" />
                Create Blood Request
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-8">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 md:h-12 md:w-12">
                    <stat.icon className="h-5 w-5 text-destructive md:h-6 md:w-6" />
                  </div>
                </div>
                <div className="text-xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Requests */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Filters */}
          <Card variant="elevated" className="mb-8">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by hospital or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Blood Group Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedBloodGroup === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedBloodGroup('all')}
                  >
                    All Types
                  </Button>
                  {bloodGroups.map((bg) => (
                    <Button
                      key={bg}
                      variant={selectedBloodGroup === bg ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedBloodGroup(bg)}
                    >
                      {bg}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredRequests.length}</span> active requests
            </p>
          </div>

          {/* Requests Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading blood requests...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request, index) => {
                const urgencyLevel = request.urgency_level?.toLowerCase() || 'low';
                const isCritical = urgencyLevel === 'critical';
                return (
                  <Card
                    key={request.id}
                    variant={isCritical ? 'urgent' : 'elevated'}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Badge variant={getBloodGroupVariant(request.blood_group_required as BloodGroup)} className="text-lg px-4 py-1">
                            {request.blood_group_required}
                          </Badge>
                          <Badge variant={getUrgencyVariant(urgencyLevel) as any}>
                            {isCritical && (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
                          </Badge>
                        </div>
                        {request.responders_count && parseInt(request.responders_count) > 0 && (
                          <Badge variant="success" className="gap-1">
                            <Users className="h-3 w-3" />
                            {request.responders_count}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base mt-3">{request.hospital_name || 'Unknown Hospital'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span>{request.location_description || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <span>{request.contact_phone || 'Contact not available'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-warning shrink-0" />
                        <span className={isCritical ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                          {formatTimeLeft(new Date(request.needed_by))}
                        </span>
                      </div>
                      {request.notes && (
                        <p className="text-sm text-muted-foreground border-t pt-3 mt-3">
                          {request.notes}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        variant={isCritical ? 'urgent' : 'default'} 
                        className="flex-1"
                        onClick={() => handleDonateClick(request.id)}
                        disabled={respondingTo === request.id}
                      >
                        {respondingTo === request.id ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></span>
                            Responding...
                          </>
                        ) : (
                          'I Can Donate'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => window.open(`tel:${request.contact_phone}`)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="flat" className="py-12 text-center">
              <CardContent>
                <Droplets className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Matching Requests</h3>
                <p className="text-muted-foreground">
                  {selectedBloodGroup !== 'all' 
                    ? `No active requests for ${selectedBloodGroup} blood type.`
                    : 'No active blood requests found.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Why Donate Blood?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Blood cannot be manufactured — it can only come from generous donors. Your single donation can save up to 3 lives.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Safe and quick process (10-15 minutes)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Free health checkup before donation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Body replenishes blood within 24-48 hours
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Most healthy adults can donate blood. Here are the basic requirements:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Age: 18-65 years
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Weight: Above 45 kg
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Hemoglobin: 12.5 g/dL or higher
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No major illness or recent surgery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BloodDonation;
