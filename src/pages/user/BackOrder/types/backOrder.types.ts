export interface BOElasticFilter {
  all: Record<string, unknown>[];
}

export interface BOElasticSearchData {
  registrationDateMin?: string;
  registrationDateMax?: string;
  ageMin?: string;
  ageMax?: string;
  status?: string;
  boid?: string;
  experience?: string[];
  category?: string[];
  casetype?: string[];
  mapData?: {
    lat?: string;
    lng?: string;
    radiusInM?: string;
  };
}
