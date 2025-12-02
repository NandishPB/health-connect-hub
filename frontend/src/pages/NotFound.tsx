import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gradient mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to="/">
            <Button variant="hero" size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-2xl">
          <Link to="/blood-donation" className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">Blood Donation</h3>
            <p className="text-sm text-muted-foreground">Find blood requests</p>
          </Link>
          <Link to="/hospitals" className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">Find Hospitals</h3>
            <p className="text-sm text-muted-foreground">Search nearby facilities</p>
          </Link>
          <Link to="/auth" className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">Login / Register</h3>
            <p className="text-sm text-muted-foreground">Access your account</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
