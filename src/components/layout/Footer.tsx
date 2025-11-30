import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Stethoscope } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Chikitsa</span>
                <span className="text-xl font-bold text-primary">Vigyan</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tech-enabled healthcare for everyone. Making quality healthcare accessible to rural and semi-urban communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/blood-donation" className="text-muted-foreground hover:text-primary transition-colors">
                  Blood Donation
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Hospitals
                </Link>
              </li>
              <li>
                <Link to="/prescriptions" className="text-muted-foreground hover:text-primary transition-colors">
                  My Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">For Hospitals</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/auth?role=hospital" className="text-muted-foreground hover:text-primary transition-colors">
                  Register Hospital
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Hospital Dashboard
                </Link>
              </li>
              <li>
                <Link to="/blood-donation" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Blood Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 1800 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>help@chikitsavigyan.in</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Raipur, Chhattisgarh, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ChikitsaVigyan. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for India
          </p>
        </div>
      </div>
    </footer>
  );
}
