import { Link } from 'react-router-dom';
import { UserPlus, Building2, Stethoscope, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const roles = [
  {
    icon: UserPlus,
    title: 'For Patients',
    description: 'Book appointments, access prescriptions, order medicines, and manage your health records.',
    cta: 'Register as Patient',
    href: '/auth?role=patient',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Building2,
    title: 'For Hospitals',
    description: 'Manage your hospital profile, doctors, appointments, and create blood donation requests.',
    cta: 'Register Hospital',
    href: '/auth?role=hospital',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Stethoscope,
    title: 'For Doctors',
    description: 'View appointments, create digital prescriptions, and manage patient consultations.',
    cta: 'Doctor Login',
    href: '/auth?role=doctor',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Join ChikitsaVigyan
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a patient, hospital, or healthcare provider — we have the tools you need.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role, index) => (
            <Card
              key={index}
              variant="elevated"
              className="group text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${role.bgColor} transition-transform group-hover:scale-110`}>
                  <role.icon className={`h-8 w-8 ${role.color}`} />
                </div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={role.href}>
                  <Button variant="hero" className="w-full gap-2">
                    {role.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
