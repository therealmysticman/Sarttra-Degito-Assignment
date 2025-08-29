# 🏨 แอปพลิเคชันโรงแรม (Hotel App)

แอปพลิเคชันค้นหาและจองโรงแรมที่สร้างด้วย Next.js 15 และ React 19 พร้อมด้วย UI ที่สวยงามและใช้งานง่าย ที่มีทั้ง FrontEnd/API Project

## ✨ คุณสมบัติหลัก

- **หน้าค้นหาโรงแรม** - ค้นหาโรงแรมตามสถานที่และวันที่
- **ระบบจองห้องพัก** - จองห้องพักพร้อมระบบชำระเงิน
- **การสำรวจสถานที่ท่องเที่ยว** - ดูข้อมูลสถานที่ท่องเที่ยวต่างๆ
- **ระบบชำระเงิน** - รองรับหลายช่องทางชำระเงิน
- **การรีวิว** - ระบบรีวิวและให้คะแนนโรงแรม
- **การจัดการโปรไฟล์** - จัดการข้อมูลส่วนตัวและการเดินทาง

## 🚀 เทคโนโลยีที่ใช้

- **Frontend Framework**: Next.js 15.5.2
- **React**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Development**: ESLint, Turbopack
- **Architecture**: App Router (Next.js 13+)

## 📱 หน้าจอหลัก

- **หน้าแรก**: แสดงสถานที่ท่องเที่ยวและค้นหาโรงแรม
- **หน้าค้นหา**: ค้นหาโรงแรมตามเงื่อนไขต่างๆ
- **หน้าผลการค้นหา**: แสดงรายการโรงแรมที่พบ
- **หน้าจอง**: จองห้องพักและเลือกช่องทางชำระเงิน
- **หน้าสำเร็จ**: แสดงการจองสำเร็จ

## 🛠️ การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น
- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **โคลนโปรเจค**
```bash
git clone [repository-url]
cd hotel-app
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **รันในโหมด development**
```bash
npm run dev
```

4. **เปิดเบราว์เซอร์**
```
http://localhost:3000
```

### คำสั่งที่มีประโยชน์

```bash
# รันในโหมด development
npm run dev

# สร้าง production build
npm run build

# รัน production build
npm start

# ตรวจสอบ code quality
npm run lint
```

## 📁 โครงสร้างโปรเจค

```
hotel-app/
├── assets/             # ไฟล์สื่อและไอคอน
│   ├── icons/         # ไอคอน SVG แบบ React Components
│   │   ├── AppIcon.js      # ไอคอนแอปพลิเคชัน
│   │   ├── ArrowIcon.js    # ไอคอนลูกศร
│   │   ├── BathIcon.js     # ไอคอนห้องน้ำ
│   │   ├── CarIcon.js      # ไอคอนรถยนต์
│   │   ├── DrinkIcon.js    # ไอคอนเครื่องดื่ม
│   │   ├── FlightIcon.js   # ไอคอนเครื่องบิน
│   │   ├── GymIcon.js      # ไอคอนโรงยิม
│   │   ├── HomeIcon.js     # ไอคอนหน้าหลัก
│   │   ├── HotelIcon.js    # ไอคอนโรงแรม
│   │   ├── ProfileIcon.js  # ไอคอนโปรไฟล์
│   │   ├── SearchIcon.js   # ไอคอนค้นหา
│   │   ├── TripsIcon.js    # ไอคอนการเดินทาง
│   │   ├── WifiIcon.js     # ไอคอน WiFi
│   │   └── index.js        # Export ไฟล์ไอคอนทั้งหมด
│   └── images/        # ไฟล์รูปภาพ
│       ├── tajmahal.png    # รูปทัชมาฮาล (Hero Image)
│       ├── Agra.png        # รูปเมืองอัครา
│       ├── Bhutan Tour.png # รูปทัวร์ภูฏาน
│       ├── Trip to Thai.png # รูปทริปไทย
│       ├── Credit Card.png # รูปบัตรเครดิต
│       ├── Debit Card.png  # รูปบัตรเดบิต
│       ├── UPI.png         # รูป UPI
│       ├── Phone Pay.png   # รูป PhonePe
│       ├── Net Banking.png # รูป Net Banking
│       └── success_logo.png # รูปโลโก้สำเร็จ
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── explore/        # หน้าค้นหาและสำรวจ
│   │   ├── exploreHotel/   # หน้าโรงแรม
│   │   ├── exploreResult/  # ผลการค้นหา
│   │   ├── payment/        # หน้าชำระเงิน
│   │   ├── paymentsuccess/ # หน้าสำเร็จ
│   │   └── review/         # หน้ารีวิว
│   ├── components/         # React Components
│   │   ├── HotelCard.js   # การ์ดแสดงโรงแรม
│   │   ├── RoomCard.js    # การ์ดแสดงห้องพัก
│   │   ├── SearchHeader.js # ส่วนหัวการค้นหา
│   │   ├── SearchSection.js # ส่วนค้นหา
│   │   └── SideNavbar.js  # แถบนำทางด้านข้าง
│   ├── contexts/           # React Contexts
│   │   └── SearchContext.js # Context สำหรับการค้นหา
│   └── data/              # ข้อมูล
│       └── hotels.json    # ข้อมูลโรงแรม
```

## 🎨 การออกแบบ UI

- **Responsive Design**: รองรับทุกขนาดหน้าจอ
- **Modern UI**: ใช้ Tailwind CSS สำหรับการออกแบบที่ทันสมัย
- **Icon System**: ระบบไอคอนที่สวยงามและใช้งานง่าย
- **Color Scheme**: ใช้โทนสีฟ้าและขาวที่ดูสะอาดตา

## 🎯 ระบบ Assets และ Media

### 📱 ไอคอน (Icons)
- **SVG Components**: ไอคอนทั้งหมดสร้างเป็น React Components ที่สามารถปรับแต่งสีและขนาดได้
- **Centralized Export**: ใช้ `assets/icons/index.js` เพื่อ export ไอคอนทั้งหมดในที่เดียว
- **Customizable**: แต่ละไอคอนสามารถรับ props เช่น `color`, `size`, `className` ได้

### 🖼️ รูปภาพ (Images)
- **Hero Images**: รูปภาพหลักสำหรับหน้าต่างๆ เช่น ทัชมาฮาล, เมืองอัครา
- **Payment Methods**: รูปภาพสำหรับช่องทางชำระเงินต่างๆ
- **Tour Images**: รูปภาพสำหรับทัวร์และสถานที่ท่องเที่ยว
- **Optimized**: รูปภาพได้รับการปรับแต่งขนาดและคุณภาพที่เหมาะสม

### 🔧 การใช้งาน Assets
```javascript
// การใช้งานไอคอน
import { AppIcon, SearchIcon, HotelIcon } from '../assets/icons';

// การใช้งานรูปภาพ
import tajmahalImage from '../assets/images/tajmahal.png';
```

## 🔧 การพัฒนา

### การเพิ่มฟีเจอร์ใหม่
1. สร้าง component ใหม่ใน `src/components/`
2. เพิ่ม route ใหม่ใน `src/app/`
3. อัปเดต navigation ใน `SideNavbar.js`

### การแก้ไขข้อมูล
- แก้ไขข้อมูลโรงแรมใน `src/data/hotels.json`
- อัปเดต API routes ใน `src/app/api/`

## 📱 การใช้งาน

1. **ค้นหาโรงแรม**: ใช้ช่องค้นหาที่หน้าแรก
2. **เลือกโรงแรม**: คลิกที่การ์ดโรงแรมเพื่อดูรายละเอียด
3. **จองห้องพัก**: เลือกห้องพักและวันที่ที่ต้องการ
4. **ชำระเงิน**: เลือกช่องทางชำระเงินที่เหมาะสม
5. **ยืนยันการจอง**: ตรวจสอบข้อมูลและยืนยันการจอง

## 📄 License

โปรเจคนี้เป็นส่วนหนึ่งของการเทสสมัครงานที่ Degito

---

**สร้างด้วย ❤️ โดยใช้ Next.js และ React**
