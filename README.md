# AadhaarScan AI (Aadhaar Scanner Pro)

> **AI-powered Aadhaar Card OCR & identity extraction system. Features live camera & image/video capture, full 12-digit number & demographic parsing, Verhoeff checksum validation, PII masking toggle, instant PDF/JSON exports with embedded card photos, and a sleek glassmorphic dashboard.**

---

## 🌟 Key Features

- 📸 **Camera & Upload Scanning**: Live viewfinder with ID-1 reticle, laser beam alignment, plus image & video upload with steady-frame extraction.
- 🔍 **Full 12-Digit Extraction**: Extracts and displays full 12-digit Aadhaar numbers (`XXXX XXXX XXXX`) with 1-click masking toggle and copy.
- 👤 **Demographic Parsing**: Extracts English Name, Regional/Hindi Name (`निरंजन कुमार`), Date of Birth, Gender, Care of, Full Address, State, and PIN Code.
- 🛡️ **Verhoeff Algorithm Checksum**: Real-time D5 dihedral group mathematical checksum validation.
- 📄 **Export to PDF**: Generates formal verification reports embedding the uploaded card picture, QR code, and demographic details.
- 💾 **Export to JSON**: Structured data payload with embedded card photo in base64 Data URI.
- 🖨️ **Printable Report**: Dedicated `@media print` styling for clean paper/PDF printing.
- ✨ **Sleek Glassmorphic Dashboard**: Ambient video background with interactive stats, history logs, search, and editing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kishanarva/aadhaar-scanner-pro.git

# Navigate into the project
cd aadhaar-scanner-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS Glassmorphism
- **OCR Engine**: Tesseract.js, Canvas Preprocessing Pipeline
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

---

## 🔒 Privacy & Compliance

All optical character recognition and image processing execute entirely in local client-side memory. Zero biometric or demographic data is stored externally.
