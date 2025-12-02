import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Heart, Building2, Stethoscope, Droplets, ArrowLeft, CheckCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register';
type UserRole = 'patient' | 'donor' | 'doctor' | 'hospital';

const roleConfig = {
  patient: {
    icon: User,
    title: 'Patient',
    description: 'Book appointments, view prescriptions, order medicines',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  donor: {
    icon: Droplets,
    title: 'Blood Donor',
    description: 'Register as donor, respond to blood requests',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  hospital: {
    icon: Building2,
    title: 'Hospital Admin',
    description: 'Manage hospital, doctors, and blood requests',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  doctor: {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage appointments and prescriptions',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
};

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = (searchParams.get('role') as UserRole) || 'patient';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Donor specific
    bloodGroup: '',
    // Hospital specific
    hospitalName: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: mode === 'login' ? 'Welcome back!' : 'Registration successful!',
      description: mode === 'login' 
        ? 'You have been logged in successfully.'
        : 'Your account has been created. Please check your email to verify.',
    });

    // Persist a simple auth token + user info so the rest of the app can detect signed-in state.
    try {
      const user = {
        name: formData.name || formData.email,
        email: formData.email,
        role: selectedRole,
      };

      // This is a placeholder token for demo. Replace with real token from backend.
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('authUser', JSON.stringify(user));
    } catch (err) {
      // ignore storage errors
    }

    setIsLoading(false);

    // If a redirect param exists, follow it; otherwise go to home
    const redirect = searchParams.get('redirect') || '/';
    navigate(redirect, { replace: true });
  };

  const RoleConfig = roleConfig[selectedRole];

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-lg">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card variant="elevated" className="overflow-hidden">
            {/* Header */}
            <CardHeader className="text-center bg-muted/30">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${RoleConfig.bgColor}`}>
                <RoleConfig.icon className={`h-8 w-8 ${RoleConfig.color}`} />
              </div>
              <CardTitle className="text-2xl">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' 
                  ? 'Sign in to your account to continue'
                  : `Register as ${RoleConfig.title}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {/* Role Selector (Only for Register) */}
              {mode === 'register' && (
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Select Your Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                      const config = roleConfig[role];
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedRole === role
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <config.icon className={`h-4 w-4 ${config.color}`} />
                            <span className="font-medium text-sm">{config.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Register only) */}
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Hospital Name (Hospital Admin only) */}
                {mode === 'register' && selectedRole === 'hospital' && (
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="hospitalName"
                        placeholder="Enter hospital name"
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Phone (Register only) */}
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Blood Group (Donor only) */}
                {mode === 'register' && selectedRole === 'donor' && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <select
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center text-sm">
                {mode === 'login' ? (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-semibold text-primary hover:underline"
                    >
                      Register now
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Forgot Password (Login only) */}
              {mode === 'login' && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Verified Hospitals</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
