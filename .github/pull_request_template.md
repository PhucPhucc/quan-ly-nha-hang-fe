## 🎨 Governance Checklist (FoodHub Guardian v1.1) — Frontend

> **Bắt buộc hoàn thành trước khi merge.** Đánh dấu ✅ hoặc ghi N/A nếu không applicable.

---

### 🧱 FFE-CMP — Component Standard

- [ ] Component có **1 responsibility** — không phải god component (>200 lines, >3 chức năng)
- [ ] Props có TypeScript `interface`/`type` rõ ràng — **không dùng `any`**
- [ ] `"use client"` chỉ dùng khi thực sự cần (`useState`, `useEffect`, `onClick`...)
- [ ] Component tái sử dụng đặt trong `src/components/` — không để trong `app/`

### 🌐 FFE-API — API Integration

- [ ] API call nằm trong `src/services/` — **không gọi `fetch`/`axios` trực tiếp trong component**
- [ ] Response có TypeScript type rõ ràng — không nhận `any`
- [ ] Mọi API call có error handling (`try-catch`)
- [ ] Form submit validate bằng Zod trước khi gọi API

### 🔐 FFE-SEC — Security

- [ ] **Không lưu token** trong `localStorage`/`sessionStorage` — dùng HttpOnly Cookie
- [ ] Không `console.log` token, user data, password
- [ ] Route cần auth có guard/middleware redirect
- [ ] **Không có secret** trong biến `NEXT_PUBLIC_*`

### ⚡ FFE-PERF — Performance

- [ ] Initial data fetch trong **Server Component** — không dùng `useEffect` để fetch khi có thể tránh
- [ ] Không có API call trong loop (N+1 FE)
- [ ] Image dùng `next/image` — **không dùng `<img>` tag**
- [ ] Expensive computation dùng `useMemo`

### 📁 FFE-STR — Project Structure

- [ ] File đặt đúng vị trí: Component→`components/`, Service→`services/`, Type→`types/`
- [ ] Naming: Component=`PascalCase.tsx`, Hook=`useXxx.ts`, Folder=`kebab-case`
- [ ] Không có circular import
- [ ] Không có ESLint error (`npm run lint` pass)

### 🧪 FFE-TST — Test Compliance

- [ ] Feature component có test file (`{Name}.test.tsx`)
- [ ] Test verify **rendering** — component hiển thị đúng content
- [ ] Test verify **interaction** — click, submit, input change đúng behavior
- [ ] Dùng **user-centric queries** (`getByRole`, `getByText`) — không `querySelector`

---

### 📊 Self-Assessment Score (FFO)

| Skill    | Weight | Estimate |
| -------- | ------ | -------- |
| FFE-CMP  | 20%    | /100     |
| FFE-API  | 20%    | /100     |
| FFE-SEC  | 20%    | /100     |
| FFE-PERF | 15%    | /100     |
| FFE-STR  | 10%    | /100     |
| FFE-TST  | 15%    | /100     |

> ❌ **Block merge** nếu: `any` trong Props, token ở localStorage, secret trong `NEXT_PUBLIC_`, thiếu error handling cho API call, feature component không có test.
