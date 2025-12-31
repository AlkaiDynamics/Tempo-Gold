
export enum CalendarType {
  GREGORIAN = 'GREGORIAN',
  JULIAN = 'JULIAN',
  MAYAN = 'MAYAN',
  MAYAN_LONG_COUNT = 'MAYAN_LONG_COUNT',
  PROPHETIC = 'PROPHETIC',
  PROPHETIC_360 = 'PROPHETIC_360',
  NIBIRU = 'NIBIRU',
  PHANTOM_TIME = 'PHANTOM_TIME',
  ATOMIC = 'ATOMIC',
  SOVIET = 'SOVIET'
}

export interface ForensicAnchor {
  id: string;
  name: string;
  type: 'INSTITUTIONAL' | 'PROPHECY' | 'HISTORICAL' | 'CELESTIAL' | 'POLITICAL';
  uls: number;
  originULS?: number; // When the prophecy was made
  targetULS?: number; // When it's meant to be fulfilled
  description: string;
  color: string;
}

export interface TheoryFactor {
  id: string;
  name: string;
  value: number; 
  enabled: boolean;
  description: string;
}

export interface ForensicAuditReport {
  timestamp: number;
  ulsCoordinate: string;
  betaDate: string;
  alphaCalculation: string;
  inheritedDebt: string;
  contaminationFactors: string[];
  celestialOffset: number;
  summary: string;
  sources: { title: string; uri: string }[];
}
