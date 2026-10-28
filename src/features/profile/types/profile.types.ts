export type ProfilePlan = 'free' | 'pro';

export interface ProfileEntry {
  id: string;
  title: string;
  subtitle: string | null;
  startMonth: string | null;
  endMonth: string | null;
  description: string | null;
}

export interface Resume {
  fileName: string;
  format: 'pdf';
}

export interface Profile {
  code: string;
  plan: ProfilePlan;
  name: string | null;
  email: string | null;
  phone: string | null;
  currentRole: string | null;
  location: string | null;
  preferredLocations: string[];
  skills: string[];
  resume: Resume | null;
  experience: ProfileEntry[];
  education: ProfileEntry[];
}

export interface PickedResume {
  uri: string;
  name: string;
}

export interface ResumeUploadTarget {
  url: string;
  fields: Record<string, string>;
  fileKey: string;
}

export interface ResumeDownload {
  url: string;
  fileName: string;
}

export type ResumeErrorCode =
  | 'tooLarge'
  | 'tooManyPages'
  | 'notPdf'
  | 'locked'
  | 'notResume'
  | 'unreadable'
  | 'dailyLimit'
  | 'busy'
  | 'unknown';

export class ResumeError extends Error {
  constructor(public readonly code: ResumeErrorCode) {
    super(code);
    this.name = 'ResumeError';
  }
}
