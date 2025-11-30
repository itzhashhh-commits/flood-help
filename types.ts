export type HelpSeekerResult = {
  id: string;
  name: string;
  email: string | null;
  details: string | null;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  phone: string;
  created_at: string;
  need: string | null;
};
