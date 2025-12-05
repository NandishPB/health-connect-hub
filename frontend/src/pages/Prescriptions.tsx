import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Pill, ShoppingCart, Calendar, User, Building2, Download, Eye, Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { prescriptionsAPI, type Prescription } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Prescriptions = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Read auth state from localStorage (same shape as Header)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Fetch prescriptions when user is logged in
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await prescriptionsAPI.getAll();
        setPrescriptions(data.prescriptions);
      } catch (err: any) {
        console.error('Failed to fetch prescriptions:', err);
        toast({
          title: 'Failed to load prescriptions',
          description: err.message || 'Could not fetch your prescriptions.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: any }> = {
      pending: { variant: 'pending', label: 'Pending', icon: Clock },
      accepted: { variant: 'info', label: 'Accepted', icon: CheckCircle },
      packed: { variant: 'info', label: 'Packed', icon: Package },
      out_for_delivery: { variant: 'warning', label: 'Out for Delivery', icon: Truck },
      delivered: { variant: 'success', label: 'Delivered', icon: CheckCircle },
      cancelled: { variant: 'destructive', label: 'Cancelled', icon: AlertCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <MainLayout>
      {/* Hero Banner */}
      <section className="bg-gradient-primary py-12 md:py-16">
        <div className="container text-center text-primary-foreground">
          <FileText className="mx-auto mb-4 h-12 w-12" />
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">My Prescriptions</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            View your digital prescriptions, order medicines, and track deliveries. All your healthcare records in one place.
          </p>
        </div>
      </section>

      {/* Login Prompt (only when not signed in) */}
      {!user && (
        <section className="border-b bg-card py-8">
          <div className="container">
            <Card variant="info">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-info/20 shrink-0">
                  <User className="h-7 w-7 text-info" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Login to View Your Prescriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to access your prescription history, order medicines, and track your orders.
                  </p>
                </div>
                <Link to="/auth">
                  <Button variant="info">Login / Register</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Prescriptions */}
      {user && (
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Prescriptions</h2>
              <p className="text-sm text-muted-foreground">
                {prescriptions.length === 0 ? 'No prescriptions found' : `${prescriptions.length} prescription(s) found`}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading prescriptions...</p>
              </div>
            ) : prescriptions.length === 0 ? (
              <Card variant="elevated">
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Prescriptions Yet</h3>
                  <p className="text-muted-foreground">Your prescriptions will appear here once they are created.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {prescriptions.map((prescription) => {
                  const handleOrderMedicines = async () => {
                    try {
                      await prescriptionsAPI.createOrder(prescription.id);
                      toast({
                        title: 'Order created',
                        description: 'Your medicine order has been placed successfully.',
                      });
                      // Refresh prescriptions
                      const data = await prescriptionsAPI.getAll();
                      setPrescriptions(data.prescriptions);
                    } catch (err: any) {
                      toast({
                        title: 'Failed to create order',
                        description: err.message || 'Could not place order. Please try again.',
                        variant: 'destructive',
                      });
                    }
                  };

                  return (
                    <Card key={prescription.id} variant="elevated" className="overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg">{prescription.diagnosis}</CardTitle>
                            <CardDescription className="mt-1">
                              Prescribed on {new Date(prescription.createdAt).toLocaleDateString('en-IN', { 
                                day: 'numeric', month: 'long', year: 'numeric' 
                              })}
                            </CardDescription>
                          </div>
                          {prescription.order && getStatusBadge(prescription.order.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {/* Doctor & Hospital */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Doctor</p>
                              <p className="text-sm font-medium">{prescription.doctorName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Hospital</p>
                              <p className="text-sm font-medium">{prescription.hospitalName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Medicines */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            Prescribed Medicines
                          </h4>
                          <div className="space-y-2">
                            {prescription.items.map((item) => (
                              <div key={item.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">{item.medicineName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.dosage} • {item.frequency} • {item.duration}
                                  </p>
                                  {item.instructions && (
                                    <p className="text-xs text-muted-foreground mt-1">{item.instructions}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Tracking */}
                        {prescription.order && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Truck className="h-4 w-4 text-warning" />
                              Order Status
                            </h4>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Ordered on {new Date(prescription.order.createdAt).toLocaleDateString('en-IN')}
                                </p>
                              </div>
                              {getStatusBadge(prescription.order.status)}
                            </div>
                            {/* Progress */}
                            <div className="mt-4 flex items-center gap-1">
                              {['pending', 'accepted', 'packed', 'out_for_delivery', 'delivered'].map((step, index) => {
                                const steps = ['pending', 'accepted', 'packed', 'out_for_delivery', 'delivered'];
                                const currentIndex = steps.indexOf(prescription.order!.status);
                                const isCompleted = index <= currentIndex;
                                return (
                                  <div key={step} className="flex-1">
                                    <div className={`h-2 rounded-full transition-colors ${
                                      isCompleted ? 'bg-success' : 'bg-muted'
                                    }`} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/30 gap-2">
                        <Button variant="outline" className="flex-1 gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        {!prescription.order && (
                          <Button 
                            variant="hero" 
                            className="flex-1 gap-2"
                            onClick={handleOrderMedicines}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Order Medicines
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">How Medicine Delivery Works</h2>
            <p className="mt-2 text-muted-foreground">Simple steps to get your medicines delivered</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: 1, icon: FileText, title: 'Get Prescription', description: 'Doctor creates digital prescription after consultation' },
              { step: 2, icon: ShoppingCart, title: 'Order Medicines', description: 'Click "Order Medicines" from your prescription' },
              { step: 3, icon: Package, title: 'We Prepare', description: 'Our pharmacy partners pack your medicines' },
              { step: 4, icon: Truck, title: 'Doorstep Delivery', description: 'Medicines delivered to your address' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Prescriptions;
