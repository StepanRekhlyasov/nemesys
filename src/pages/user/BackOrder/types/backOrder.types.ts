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
  transactiontype?: string[];
  typecase?: string[];
  mapData?: {
    lat?: string;
    lng?: string;
    radiusInM?: string;
  };
  customerRepresentative?: string;
}
