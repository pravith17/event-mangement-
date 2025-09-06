# Event Check-in Web App MVP

## Core Features to Implement:
1. User registration form (name, email, phone)
2. Generate unique QR code on registration
3. QR scan via camera → auto-mark attendance
4. Organizer dashboard: list of registered + present users

## Files to Create/Modify:
1. **src/pages/Index.tsx** - Main landing page with navigation
2. **src/pages/Register.tsx** - User registration form
3. **src/pages/CheckIn.tsx** - QR code scanner for attendance
4. **src/pages/Dashboard.tsx** - Organizer dashboard
5. **src/components/QRCodeDisplay.tsx** - Component to display generated QR codes
6. **src/components/QRScanner.tsx** - Camera-based QR code scanner
7. **src/lib/storage.ts** - localStorage utilities for data persistence
8. **src/types/index.ts** - TypeScript interfaces
9. **src/App.tsx** - Update routing
10. **index.html** - Update title

## Data Structure:
- Users: { id, name, email, phone, qrCode, registeredAt, checkedIn, checkedInAt }
- Store in localStorage as 'event-users'

## Dependencies to Add:
- qrcode (for QR generation)
- qr-scanner (for QR scanning)
- @types/qrcode

## Implementation Strategy:
- Simple, clean UI with minimal styling
- localStorage for data persistence
- Unique ID generation for each user
- Camera access for QR scanning
- Real-time dashboard updates