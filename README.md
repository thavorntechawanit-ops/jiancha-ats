# Jian Cha ATS Dashboard

Dashboard สำหรับ HR ดูข้อมูล ATS จาก Notion แบบ real-time

## วิธี Deploy ขึ้น Vercel (ทำครั้งเดียว ~5 นาที)

### ขั้นตอนที่ 1 — อัปโหลดขึ้น GitHub
1. ไปที่ https://github.com/new
2. ตั้งชื่อ repo เช่น `jiancha-ats`
3. กด **Create repository**
4. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repo

### ขั้นตอนที่ 2 — Deploy ด้วย Vercel
1. ไปที่ https://vercel.com → กด **New Project**
2. เชื่อม GitHub แล้วเลือก repo `jiancha-ats`
3. Framework: **Vite** (auto-detect)
4. กด **Deploy**
5. รอ ~1 นาที → ได้ URL เลย!

### ขั้นตอนที่ 3 — ผูกโดเมน (ถ้ามี)
- ใน Vercel → Settings → Domains → Add Domain

## วิธีอัปเดตโค้ดในอนาคต
- แก้ไฟล์ใน `src/ATSDashboard.jsx`
- Push ขึ้น GitHub → Vercel จะ deploy อัตโนมัติทันที

## Structure
```
ats-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── ATSDashboard.jsx   ← แก้ที่นี่
```
