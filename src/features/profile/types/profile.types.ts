export type ProfilePlan = 'guest' | 'pro';

export interface ProfileEntry {
  id: string;
  title: string;
  subtitle: string;
  startMonth: string;
  endMonth: string | null;
  description: string | null;
}

export interface Resume {
  fileName: string;
  format: 'pdf' | 'doc';
}

export interface Profile {
  code: string;
  plan: ProfilePlan;
  name: string;
  email: string;
  currentRole: string | null;
  location: string;
  preferredLocations: string[];
  resume: Resume | null;
  experience: ProfileEntry[];
  education: ProfileEntry[];
}
