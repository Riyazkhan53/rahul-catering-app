// ─── Indian Government Holidays (National + Tamil Nadu State) ───
// Updated for 2025-2026. Update yearly as needed.

export const govtHolidays = {
  // 2025
  "2025-01-01": { name: "New Year's Day", type: "state" },
  "2025-01-14": { name: "Pongal", type: "state" },
  "2025-01-15": { name: "Thiruvalluvar Day", type: "state" },
  "2025-01-16": { name: "Uzhavar Thirunal", type: "state" },
  "2025-01-26": { name: "Republic Day", type: "national" },
  "2025-02-26": { name: "Maha Shivaratri", type: "national" },
  "2025-03-14": { name: "Holi", type: "national" },
  "2025-03-30": { name: "Ramadan (Start)", type: "national" },
  "2025-03-31": { name: "Id-ul-Fitr (Eid)", type: "national" },
  "2025-04-06": { name: "Mahavir Jayanti", type: "national" },
  "2025-04-10": { name: "Telugu New Year / Ugadi", type: "state" },
  "2025-04-14": { name: "Tamil New Year (Puthandu) / Dr. Ambedkar Jayanti", type: "national" },
  "2025-04-18": { name: "Good Friday", type: "national" },
  "2025-05-01": { name: "May Day", type: "state" },
  "2025-05-12": { name: "Buddha Purnima", type: "national" },
  "2025-06-07": { name: "Eid-ul-Adha (Bakrid)", type: "national" },
  "2025-07-06": { name: "Muharram", type: "national" },
  "2025-08-15": { name: "Independence Day", type: "national" },
  "2025-08-16": { name: "Janmashtami", type: "national" },
  "2025-09-05": { name: "Milad-un-Nabi (Prophet's Birthday)", type: "national" },
  "2025-10-02": { name: "Gandhi Jayanti", type: "national" },
  "2025-10-02": { name: "Ayudha Pooja / Saraswati Pooja", type: "state" },
  "2025-10-03": { name: "Vijayadashami (Dussehra)", type: "national" },
  "2025-10-20": { name: "Diwali (Deepavali)", type: "national" },
  "2025-11-01": { name: "All Saints' Day", type: "state" },
  "2025-11-05": { name: "Guru Nanak Jayanti", type: "national" },
  "2025-12-25": { name: "Christmas", type: "national" },

  // 2026
  "2026-01-01": { name: "New Year's Day", type: "state" },
  "2026-01-14": { name: "Pongal", type: "state" },
  "2026-01-15": { name: "Thiruvalluvar Day", type: "state" },
  "2026-01-16": { name: "Uzhavar Thirunal", type: "state" },
  "2026-01-26": { name: "Republic Day", type: "national" },
  "2026-02-15": { name: "Maha Shivaratri", type: "national" },
  "2026-03-03": { name: "Holi", type: "national" },
  "2026-03-20": { name: "Id-ul-Fitr (Eid)", type: "national" },
  "2026-04-14": { name: "Tamil New Year (Puthandu) / Dr. Ambedkar Jayanti", type: "national" },
  "2026-04-03": { name: "Good Friday", type: "national" },
  "2026-05-01": { name: "May Day / Buddha Purnima", type: "state" },
  "2026-05-27": { name: "Eid-ul-Adha (Bakrid)", type: "national" },
  "2026-06-26": { name: "Muharram", type: "national" },
  "2026-08-15": { name: "Independence Day", type: "national" },
  "2026-08-25": { name: "Milad-un-Nabi (Prophet's Birthday)", type: "national" },
  "2026-09-22": { name: "Vijayadashami (Dussehra)", type: "national" },
  "2026-10-02": { name: "Gandhi Jayanti", type: "national" },
  "2026-10-09": { name: "Diwali (Deepavali)", type: "national" },
  "2026-10-25": { name: "Guru Nanak Jayanti", type: "national" },
  "2026-12-25": { name: "Christmas", type: "national" },
};

// ─── Tamil Months ───
// Tamil months mapped to approximate Gregorian start dates for 2025 & 2026.
// Each Tamil month starts around the same Gregorian date every year (±1 day).

export const tamilMonths = [
  { name: "சித்திரை (Chithirai)", startMonth: 4, startDay: 14 },
  { name: "வைகாசி (Vaikasi)", startMonth: 5, startDay: 15 },
  { name: "ஆனி (Aani)", startMonth: 6, startDay: 15 },
  { name: "ஆடி (Aadi)", startMonth: 7, startDay: 17 },
  { name: "ஆவணி (Aavani)", startMonth: 8, startDay: 17 },
  { name: "புரட்டாசி (Purattasi)", startMonth: 9, startDay: 17 },
  { name: "ஐப்பசி (Aippasi)", startMonth: 10, startDay: 18 },
  { name: "கார்த்திகை (Karthigai)", startMonth: 11, startDay: 17 },
  { name: "மார்கழி (Margazhi)", startMonth: 12, startDay: 16 },
  { name: "தை (Thai)", startMonth: 1, startDay: 14 },
  { name: "மாசி (Maasi)", startMonth: 2, startDay: 13 },
  { name: "பங்குனி (Panguni)", startMonth: 3, startDay: 14 },
];

// Tamil festivals / special days (beyond govt holidays)
export const tamilFestivals = {
  "2025-01-14": { name: "தை பொங்கல் (Thai Pongal)" },
  "2025-01-15": { name: "மாட்டுப் பொங்கல் (Mattu Pongal)" },
  "2025-04-14": { name: "தமிழ் புத்தாண்டு (Tamil New Year)" },
  "2025-08-27": { name: "விநாயகர் சதுர்த்தி (Vinayagar Chaturthi)" },
  "2025-10-01": { name: "நவராத்திரி (Navaratri Start)" },
  "2025-10-21": { name: "தீபாவளி (Deepavali)" },
  "2025-11-27": { name: "கார்த்திகை தீபம் (Karthigai Deepam)" },
  "2025-12-25": { name: "கிறிஸ்துமஸ் (Christmas)" },
  "2026-01-14": { name: "தை பொங்கல் (Thai Pongal)" },
  "2026-01-15": { name: "மாட்டுப் பொங்கல் (Mattu Pongal)" },
  "2026-04-14": { name: "தமிழ் புத்தாண்டு (Tamil New Year)" },
  "2026-09-16": { name: "விநாயகர் சதுர்த்தி (Vinayagar Chaturthi)" },
  "2026-10-09": { name: "தீபாவளி (Deepavali)" },
};

// ─── Islamic / Hijri Calendar ───
// Key Islamic dates mapped to approximate Gregorian dates for 2025-2026.
// These shift ~11 days earlier each Gregorian year.

export const islamicDates = {
  "2025-01-07": { name: "Rajab 7 – Isra & Mi'raj", hijriMonth: "Rajab" },
  "2025-03-01": { name: "Ramadan Begins", hijriMonth: "Ramadan" },
  "2025-03-31": { name: "Eid ul-Fitr", hijriMonth: "Shawwal" },
  "2025-06-07": { name: "Eid ul-Adha (Bakrid)", hijriMonth: "Dhul Hijjah" },
  "2025-06-27": { name: "Islamic New Year (1447 AH)", hijriMonth: "Muharram" },
  "2025-07-06": { name: "Ashura", hijriMonth: "Muharram" },
  "2025-09-05": { name: "Milad-un-Nabi (Mawlid)", hijriMonth: "Rabi ul-Awal" },

  "2026-02-18": { name: "Ramadan Begins", hijriMonth: "Ramadan" },
  "2026-03-20": { name: "Eid ul-Fitr", hijriMonth: "Shawwal" },
  "2026-05-27": { name: "Eid ul-Adha (Bakrid)", hijriMonth: "Dhul Hijjah" },
  "2026-06-17": { name: "Islamic New Year (1448 AH)", hijriMonth: "Muharram" },
  "2026-06-26": { name: "Ashura", hijriMonth: "Muharram" },
  "2026-08-25": { name: "Milad-un-Nabi (Mawlid)", hijriMonth: "Rabi ul-Awal" },
};

// ─── Hijri Month Names ───
export const hijriMonthNames = [
  "Muharram", "Safar", "Rabi ul-Awal", "Rabi ul-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah",
];

// ─── Helper: Get Tamil month for a given Gregorian date ───
export function getTamilMonth(date) {
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate();

  for (let i = tamilMonths.length - 1; i >= 0; i--) {
    const tm = tamilMonths[i];
    if (m > tm.startMonth || (m === tm.startMonth && d >= tm.startDay)) {
      return tm.name;
    }
  }
  // Wrap around: if before Thai (Jan 14), it's still Margazhi
  return tamilMonths[8].name; // Margazhi
}

// ─── Helper: Get Tamil month + day for a given Gregorian date ───
export function getTamilDate(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let matched = null;

  for (let i = tamilMonths.length - 1; i >= 0; i--) {
    const tm = tamilMonths[i];
    if (m > tm.startMonth || (m === tm.startMonth && d >= tm.startDay)) {
      matched = tm;
      break;
    }
  }
  if (!matched) matched = tamilMonths[8]; // Margazhi

  // Calculate day within Tamil month
  const tamilStart = new Date(date.getFullYear(), matched.startMonth - 1, matched.startDay);
  // If the Tamil month start is after the current date (year wrap for Margazhi/Thai etc)
  if (tamilStart > date) {
    tamilStart.setFullYear(tamilStart.getFullYear() - 1);
  }
  const dayNum = Math.floor((date - tamilStart) / 86400000) + 1;
  return { month: matched.name, day: dayNum };
}

// ─── Helper: Get approximate Hijri date for a Gregorian date ───
export function getHijriDate(date) {
  try {
    const dayFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric' });
    const monthFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'long' });
    const yearFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric' });
    const day = dayFmt.format(date);
    const month = monthFmt.format(date);
    const year = yearFmt.format(date).replace(/\s*AH$/, '');
    return `${day} ${month} ${year} AH`;
  } catch {
    return null;
  }
}

// ─── Helper: Get all events for a given date string (YYYY-MM-DD) ───
export function getEventsForDate(dateStr) {
  const events = [];

  if (govtHolidays[dateStr]) {
    events.push({ ...govtHolidays[dateStr], category: "govt" });
  }
  if (tamilFestivals[dateStr]) {
    events.push({ ...tamilFestivals[dateStr], category: "tamil" });
  }
  if (islamicDates[dateStr]) {
    events.push({ ...islamicDates[dateStr], category: "islamic" });
  }

  return events;
}

// ─── Helper: Format date to YYYY-MM-DD ───
export function formatDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
