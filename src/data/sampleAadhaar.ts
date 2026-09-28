// Sample test data for Aadhaar Vision demonstration
export interface ExtractedAadhaarData {
  name: string;
  dob: string;
  gender: string;
  aadhaarNumber: string; // Masked format: XXXX-XXXX-1234
  address: string;
  fatherOrHusbandName?: string;
  pincode?: string;
  state?: string;
  detectionConfidence: number;
  ocrConfidence: number;
  checksumValid: boolean;
  processingTimeMs: number;
}

export const SAMPLE_AADHAAR_DATA: ExtractedAadhaarData = {
  name: "DEMO USER",
  dob: "01/01/2000",
  gender: "DEMO",
  aadhaarNumber: "XXXX-XXXX-1234",
  address: "DEMO ADDRESS, NEW DELHI, DELHI - 110001",
  fatherOrHusbandName: "DEMO GUARDIAN",
  pincode: "110001",
  state: "Delhi",
  detectionConfidence: 99.6,
  ocrConfidence: 98.9,
  checksumValid: true,
  processingTimeMs: 142,
};

export const SAMPLE_CARDS = [
  {
    id: "sample-1",
    label: "Sample Demo Card 01",
    type: "Front (Standard)",
    data: {
      name: "DEMO USER",
      dob: "01/01/2000",
      gender: "DEMO",
      aadhaarNumber: "XXXX-XXXX-1234",
      address: "DEMO ADDRESS, NEW DELHI - 110001",
      fatherOrHusbandName: "DEMO GUARDIAN",
      pincode: "110001",
      state: "Delhi",
      detectionConfidence: 99.6,
      ocrConfidence: 98.9,
      checksumValid: true,
      processingTimeMs: 138,
    },
    // SVG Data URI for immediate visual rendering
    imageUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <defs>
        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </linearGradient>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="%23ff9933"/>
          <stop offset="50%" stop-color="%23ffffff"/>
          <stop offset="100%" stop-color="%23138808"/>
        </linearGradient>
      </defs>
      <!-- Card Body -->
      <rect width="600" height="380" rx="16" fill="url(%23cardBg)" stroke="%23cbd5e1" stroke-width="2"/>
      <!-- Tricolor header bar -->
      <rect x="0" y="0" width="600" height="12" rx="0" fill="url(%23headerGrad)"/>
      
      <!-- Top header text -->
      <text x="300" y="38" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e293b" text-anchor="middle">GOVERNMENT OF INDIA</text>
      <text x="300" y="56" font-family="sans-serif" font-size="11" fill="%23475569" text-anchor="middle">DEMONSTRATION SAMPLE CARD</text>

      <!-- Photo Box -->
      <rect x="36" y="80" width="110" height="140" rx="6" fill="%2394a3b8" stroke="%2364748b" stroke-width="1.5"/>
      <circle cx="91" cy="130" r="30" fill="%23cbd5e1"/>
      <path d="M 56 200 C 60 170, 122 170, 126 200 Z" fill="%23cbd5e1"/>
      <text x="91" y="235" font-family="monospace" font-size="10" fill="%2364748b" text-anchor="middle">SAMPLE PHOTO</text>

      <!-- Details -->
      <text x="170" y="105" font-family="sans-serif" font-size="12" fill="%2364748b">Name / नाम</text>
      <text x="170" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">DEMO USER</text>

      <text x="170" y="155" font-family="sans-serif" font-size="12" fill="%2364748b">DOB / जन्म तिथि</text>
      <text x="170" y="175" font-family="sans-serif" font-size="15" font-weight="bold" fill="%230f172a">01/01/2000</text>

      <text x="340" y="155" font-family="sans-serif" font-size="12" fill="%2364748b">Gender / लिंग</text>
      <text x="340" y="175" font-family="sans-serif" font-size="15" font-weight="bold" fill="%230f172a">DEMO</text>

      <!-- QR Code Placeholder -->
      <rect x="460" y="85" width="105" height="105" rx="4" fill="%230f172a"/>
      <!-- QR pattern squares -->
      <rect x="470" y="95" width="25" height="25" fill="%23ffffff"/>
      <rect x="475" y="100" width="15" height="15" fill="%230f172a"/>
      <rect x="530" y="95" width="25" height="25" fill="%23ffffff"/>
      <rect x="535" y="100" width="15" height="15" fill="%230f172a"/>
      <rect x="470" y="155" width="25" height="25" fill="%23ffffff"/>
      <rect x="475" y="160" width="15" height="15" fill="%230f172a"/>
      <rect x="505" y="130" width="15" height="15" fill="%23ffffff"/>

      <!-- Aadhaar Number (Masked) -->
      <rect x="36" y="270" width="528" height="56" rx="8" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="1.5"/>
      <text x="300" y="306" font-family="monospace" font-size="24" font-weight="bold" letter-spacing="4" fill="%23b91c1c" text-anchor="middle">XXXX  XXXX  1234</text>

      <!-- Bottom Tagline -->
      <text x="300" y="352" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230369a1" text-anchor="middle">मेरा आधार, मेरी पहचान</text>
      <text x="300" y="368" font-family="sans-serif" font-size="9" fill="%2394a3b8" text-anchor="middle">SPECIMEN DOCUMENT FOR AI EXTRACTION TESTING</text>
    </svg>`
  },
  {
    id: "sample-2",
    label: "Sample Demo Card 02",
    type: "Card Specimen B",
    data: {
      name: "PRIYA SHARMA",
      dob: "14/08/1995",
      gender: "FEMALE",
      aadhaarNumber: "XXXX-XXXX-8921",
      address: "FLAT 402, PALM GROVE APTS, BANGALORE - 560034",
      fatherOrHusbandName: "R. SHARMA",
      pincode: "560034",
      state: "Karnataka",
      detectionConfidence: 99.8,
      ocrConfidence: 99.1,
      checksumValid: true,
      processingTimeMs: 124,
    },
    imageUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <defs>
        <linearGradient id="cardBg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23f1f5f9"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </linearGradient>
      </defs>
      <rect width="600" height="380" rx="16" fill="url(%23cardBg2)" stroke="%23cbd5e1" stroke-width="2"/>
      <rect x="0" y="0" width="600" height="12" fill="%230284c7"/>
      <text x="300" y="38" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e293b" text-anchor="middle">UNIQUE IDENTIFICATION AUTHORITY OF INDIA</text>
      <text x="300" y="56" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">GOVERNMENT OF INDIA</text>

      <rect x="36" y="80" width="110" height="140" rx="6" fill="%2394a3b8" stroke="%2364748b" stroke-width="1.5"/>
      <circle cx="91" cy="130" r="30" fill="%23cbd5e1"/>
      <path d="M 56 200 C 60 170, 122 170, 126 200 Z" fill="%23cbd5e1"/>
      <text x="91" y="235" font-family="monospace" font-size="10" fill="%2364748b" text-anchor="middle">ID PHOTO</text>

      <text x="170" y="105" font-family="sans-serif" font-size="12" fill="%2364748b">Name</text>
      <text x="170" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">PRIYA SHARMA</text>

      <text x="170" y="155" font-family="sans-serif" font-size="12" fill="%2364748b">DOB</text>
      <text x="170" y="175" font-family="sans-serif" font-size="15" font-weight="bold" fill="%230f172a">14/08/1995</text>

      <text x="340" y="155" font-family="sans-serif" font-size="12" fill="%2364748b">Gender</text>
      <text x="340" y="175" font-family="sans-serif" font-size="15" font-weight="bold" fill="%230f172a">FEMALE</text>

      <rect x="460" y="85" width="105" height="105" rx="4" fill="%230f172a"/>
      <rect x="470" y="95" width="25" height="25" fill="%23ffffff"/>
      <rect x="475" y="100" width="15" height="15" fill="%230f172a"/>
      <rect x="530" y="95" width="25" height="25" fill="%23ffffff"/>
      <rect x="535" y="100" width="15" height="15" fill="%230f172a"/>
      <rect x="470" y="155" width="25" height="25" fill="%23ffffff"/>
      <rect x="475" y="160" width="15" height="15" fill="%230f172a"/>

      <rect x="36" y="270" width="528" height="56" rx="8" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="1.5"/>
      <text x="300" y="306" font-family="monospace" font-size="24" font-weight="bold" letter-spacing="4" fill="%23b91c1c" text-anchor="middle">XXXX  XXXX  8921</text>

      <text x="300" y="352" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230284c7" text-anchor="middle">Aadhaar - Identity of Ordinary Resident</text>
    </svg>`
  }
];
