import { Link } from 'react-router-dom';
import { Droplets, Hospital, Pill, FileText, ArrowRight, Heart, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Droplets,
    title: 'Blood Emergency',
    description: 'Instant notification to nearby donors when blood is needed. Track requests and manage donations effectively.',
    href: '/blood-donation',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: Hospital,
    title: 'Find Hospitals',
    description: 'Discover nearby hospitals, view specialties, check ratings, and explore health packages and offers.',
    href: '/hospitals',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    description: 'Doctors create digital prescriptions. Patients can view their prescription history anytime.',
    href: '/prescriptions',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Pill,
    title: 'Medicine Delivery',
    description: 'Order medicines from your prescriptions and get them delivered to your doorstep. Easy tracking.',
    href: '/prescriptions',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Verified Doctors',
    description: 'All doctors are verified through registered hospitals',
  },
  {
    icon: Clock,
    title: '24/7 Emergency',
    description: 'Round-the-clock blood emergency support',
  },
  {
    icon: Heart,
    title: 'Affordable Care',
    description: 'Special packages and offers for all',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Complete Healthcare Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your health and access quality medical services, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="interactive"
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.href}>
                  <Button variant="ghost" size="sm" className="group/btn gap-2 p-0 h-auto">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Bar */}
        <div className="mt-16 rounded-2xl bg-card p-6 shadow-lg md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
