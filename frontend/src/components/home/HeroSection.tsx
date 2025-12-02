import { Link } from 'react-router-dom';
import { Droplets, Hospital, Pill, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm animate-fade-in">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Trusted by 10,000+ users across India</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Healthcare Made{' '}
            <span className="text-gradient">Simple</span>{' '}
            for Everyone
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            From emergency blood donation to doctor appointments and medicine delivery — 
            all healthcare services in one place. Designed for rural and semi-urban communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/blood-donation">
              <Button variant="urgent" size="xl" className="w-full sm:w-auto gap-2">
                <Droplets className="h-5 w-5" />
                Emergency Blood Request
              </Button>
            </Link>
            <Link to="/hospitals">
              <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
                <Hospital className="h-5 w-5" />
                Find Hospitals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Users, value: '10,000+', label: 'Registered Donors' },
              { icon: Hospital, value: '500+', label: 'Partner Hospitals' },
              { icon: Droplets, value: '25,000+', label: 'Lives Saved' },
              { icon: Clock, value: '24/7', label: 'Emergency Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
