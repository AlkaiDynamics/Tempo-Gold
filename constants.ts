
import { ForensicAnchor, CalendarType } from './types';

export const ULS_EPOCH_UNIX = -62135596800000; // Jan 1, 0001
export const TROPICAL_YEAR = 31556925.26;
export const TROPICAL_YEAR_SECONDS = TROPICAL_YEAR;
export const PROPHETIC_YEAR = 31104000; // 360 days
export const PROPHETIC_YEAR_SECONDS = PROPHETIC_YEAR;

export const FORENSIC_ANCHORS: ForensicAnchor[] = [
  // Antediluvian / Pre-Flood Era (Approximate ULS targets)
  {
    id: 'great-flood',
    name: 'The Great Deluge',
    type: 'HISTORICAL',
    uls: -74100000000, // ~2348 BC (Traditional)
    description: 'The primary reset of human chronological records.',
    color: 'text-blue-600'
  },
  {
    id: 'pyramids-giza',
    name: 'Giza Construction',
    type: 'CELESTIAL',
    uls: -80700000000, // ~2560 BC
    description: 'Stellar alignment with Orion belt, establishing the first Alpha Anchor.',
    color: 'text-yellow-500'
  },

  // Biblical / Prophetic Origins
  {
    id: 'daniel-decree',
    name: "Artaxerxes' Decree",
    type: 'POLITICAL',
    uls: -14000000000, // ~444 BC
    description: 'The start of the 70-weeks prophetic count.',
    color: 'text-purple-400'
  },

  // Classical Political Recalibrations
  {
    id: 'council-nicaea',
    name: 'Council of Nicaea',
    type: 'POLITICAL',
    uls: 10224403200, // 325 AD
    description: 'Stabilization of the Easter cycle and Julian calendar constraints.',
    color: 'text-purple-600'
  },

  // The Information Rift
  {
    id: 'printing-press',
    name: 'Gutenberg Printing Press',
    type: 'HISTORICAL',
    uls: 45412896000, // 1440 AD
    description: 'The locking of chronological history via mass-produced records.',
    color: 'text-indigo-500'
  },

  // The Great Reforms
  {
    id: 'gregorian-reform',
    name: 'Papal Bull: Oct 1582',
    type: 'INSTITUTIONAL',
    uls: 49914432000, 
    description: '10 days deleted (Oct 5-14) to create the Gregorian Mask.',
    color: 'text-red-500'
  },
  {
    id: 'british-calendar-act',
    name: 'British Reform 1752',
    type: 'INSTITUTIONAL',
    uls: 55276416000,
    description: '11 days deleted in Britain/Americas (Sep 3-13).',
    color: 'text-red-400'
  },

  // Celestial Events
  {
    id: 'halleys-comet-1066',
    name: "Halley's Comet (1066)",
    type: 'CELESTIAL',
    uls: 33608352000,
    description: 'Celestial omen recorded during the Battle of Hastings.',
    color: 'text-cyan-400'
  },
  {
    id: 'great-conjunction-1603',
    name: 'Great Conjunction 1603',
    type: 'CELESTIAL',
    uls: 50579616000,
    description: 'Jupiter-Saturn alignment analyzed by Johannes Kepler.',
    color: 'text-yellow-300'
  },

  // Modern / Future Fulfilments
  {
    id: 'atomic-clock-1955',
    name: 'Atomic Time Inception',
    type: 'INSTITUTIONAL',
    uls: 61664160000, 
    description: 'Definition of the second via Caesium-133 vibration.',
    color: 'text-[#00ffaa]'
  },
  {
    id: 'nostradamus-quatrain',
    name: 'X-72 King of Terror',
    type: 'PROPHECY',
    uls: 63063552000, // 1999 target
    originULS: 49052544000, // 1555 publication
    description: 'The arrival of the "Great King of Terror" from the sky.',
    color: 'text-orange-500'
  },
  {
    id: 'newton-2060',
    name: "Newton's 2060",
    type: 'PROPHECY',
    uls: 65000000000, 
    originULS: 53772288000, 
    description: "Calculated end of the 1260-year count from 800 AD.",
    color: 'text-yellow-600'
  }
];

export const SCALES = [
  { id: '24h', label: '24 Hours', unit: 86400, count: 24 },
  { id: 'month', label: 'Month', unit: 2629743, count: 31 },
  { id: 'year', label: 'Year', unit: 31556925, count: 12 },
  { id: 'decade', label: 'Decade', unit: 315569250, count: 10 },
  { id: 'century', label: 'Century', unit: 3155692500, count: 10 },
  { id: 'millennium', label: 'Millennium', unit: 31556925000, count: 10 }
];
