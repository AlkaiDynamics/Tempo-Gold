
import { ULS_EPOCH_UNIX, TROPICAL_YEAR, PROPHETIC_YEAR } from '../constants';
import { CalendarType } from '../types';

export const getNowULS = (theories: any[] = []): number => {
  let uls = (Date.now() - ULS_EPOCH_UNIX) / 1000;
  
  const phantom = theories.find(t => t.id === 'phantom-time');
  if (phantom?.enabled) {
    uls -= (297 * TROPICAL_YEAR);
  }

  const axial = theories.find(t => t.id === 'axial-shift');
  if (axial?.enabled) {
    uls *= (86400 / 86164.0905);
  }

  return uls;
};

export const getSystemDate = (uls: number, type: CalendarType): string => {
  const date = new Date(ULS_EPOCH_UNIX + uls * 1000);
  
  switch (type) {
    case CalendarType.MAYAN:
      const totalKins = Math.floor(uls / 86400) + 1872000;
      const baktun = Math.floor(totalKins / 144000);
      const katun = Math.floor((totalKins % 144000) / 7200);
      const tun = Math.floor((totalKins % 7200) / 360);
      return `${baktun}.${katun}.${tun}`;
    
    case CalendarType.JULIAN:
      const offset = 13 * 86400; 
      const julDate = new Date((uls - offset) * 1000 + ULS_EPOCH_UNIX);
      return julDate.toISOString().split('T')[0];
      
    case CalendarType.PROPHETIC:
      const years = Math.floor(uls / PROPHETIC_YEAR);
      const days = Math.floor((uls % PROPHETIC_YEAR) / 86400);
      return `Y${years} D${days}`;

    case CalendarType.NIBIRU:
      const cycle = Math.floor(uls / (3600 * TROPICAL_YEAR));
      return `Orb ${cycle}`;

    default:
      return date.toISOString().split('T')[0];
  }
};

export const formatTimeParts = (uls: number) => {
  const date = new Date(ULS_EPOCH_UNIX + uls * 1000);
  return {
    hours: date.getUTCHours().toString().padStart(2, '0'),
    minutes: date.getUTCMinutes().toString().padStart(2, '0'),
    seconds: date.getUTCSeconds().toString().padStart(2, '0'),
    ms: (date.getUTCMilliseconds()).toString().padStart(3, '0'),
    dateStr: date.toISOString().split('T')[0]
  };
};

// Added missing formatULS function
export const formatULS = (uls: number): string => {
  return uls.toFixed(4);
};

// Added missing calculateCelestialOffset function
export const calculateCelestialOffset = (uls: number): number => {
  // Rough approximation of precession: 1 degree every ~71.6 years
  // 360 degrees / 25772 years
  const yearsSinceEpoch = uls / TROPICAL_YEAR;
  return (yearsSinceEpoch * 360) / 25772;
};

// Added missing getULSFromDate function
export const getULSFromDate = (date: Date): number => {
  return (date.getTime() - ULS_EPOCH_UNIX) / 1000;
};

// Added missing getTropicalZodiac function
export const getTropicalZodiac = (uls: number): string => {
  const date = new Date(ULS_EPOCH_UNIX + uls * 1000);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Added missing getSiderealZodiac function
export const getSiderealZodiac = (uls: number): string => {
  const offset = calculateCelestialOffset(uls);
  // Shift the ULS back by the precession amount relative to the current zodiacal epoch
  const shiftedULS = uls - (offset / 360) * (25772 * TROPICAL_YEAR);
  return getTropicalZodiac(shiftedULS);
};

// Added missing generateLayeredMonth function for Calendar view
export const generateLayeredMonth = (year: number, month: number, patch1582: boolean) => {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const startingDay = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  
  const cells = [];
  for (let i = 0; i < startingDay; i++) {
    cells.push({ betaDay: null, alphaDay: null, isGap: false });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    let isGap = false;
    
    // October 1582 reform: Oct 5-14 were removed
    if (patch1582 && year === 1582 && month === 9) {
      if (d > 4 && d < 15) {
        isGap = true;
      }
    }
    // September 1752 reform: Sep 3-13 were removed
    if (patch1582 && year === 1752 && month === 8) {
        if (d > 2 && d < 14) {
          isGap = true;
        }
    }
    
    const cellULS = getULSFromDate(new Date(Date.UTC(year, month, d)));
    cells.push({
      betaDay: d,
      alphaDay: Math.floor(cellULS / 86400),
      isGap
    });
  }
  
  return cells;
};