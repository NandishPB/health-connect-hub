import { useState } from 'react';
import { Calendar, Clock, User, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { appointmentsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitalId: string;
  hospitalName: string;
  doctorId?: string;
  doctorName?: string;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  hospitalId,
  hospitalName,
  doctorId,
  doctorName,
}: AppointmentDialogProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: 'Missing information',
        description: 'Please select both date and time for your appointment.',
        variant: 'destructive',
      });
      return;
    }

    const requestedDateTime = new Date(`${date}T${time}`).toISOString();
    
    // Check if date is in the past
    if (new Date(requestedDateTime) < new Date()) {
      toast({
        title: 'Invalid date',
        description: 'Please select a future date and time.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await appointmentsAPI.create({
        hospitalId,
        doctorId,
        requestedDateTime,
        notes: notes || undefined,
      });

      toast({
        title: 'Appointment Requested!',
        description: response.message,
      });

      // Reset form and close dialog
      setDate('');
      setTime('');
      setNotes('');
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: 'Failed to book appointment',
        description: err.message || 'Could not create appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Request an appointment at {hospitalName}
            {doctorName && ` with ${doctorName}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Hospital Info */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{hospitalName}</p>
                {doctorName && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    {doctorName}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or symptoms you'd like to mention..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></span>
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

