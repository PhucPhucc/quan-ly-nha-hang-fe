# Quan Ly Nha Hang – Next.js + Docker

## 1. Mục tiêu tài liệu

Tài liệu này giúp **mọi thành viên trong team** có thể:

* Clone project
* Chạy được project **ngay lập tức bằng Docker**
* Hiểu rõ luồng làm việc khi **pull code mới**

Không yêu cầu cài Node.js hay môi trường phức tạp trên máy local.

---

## 2. Yêu cầu hệ thống (bắt buộc)

Trước khi bắt đầu, máy cần có:

* Git
* Docker (Docker Engine >= 20)
* Docker Compose v2

### Kiểm tra nhanh

```bash
git --version
docker --version
docker compose version
```

> Nếu Docker báo lỗi `permission denied docker.sock` → user **chưa thuộc group docker**.

Cách sửa (chạy 1 lần):

```bash
sudo usermod -aG docker $USER
```

Sau đó **logout / login lại**.

---

## 3. Clone project

```bash
git clone <REPO_URL>
cd quan-ly-nha-hang
```

---

## 4. Chạy project lần đầu (Development)

Project được cấu hình để chạy **Next.js ở chế độ dev** với hot reload.

### Lệnh duy nhất cần nhớ

```bash
docker compose up --build
```

Sau khi chạy xong, truy cập:

```
http://localhost:3000
```

---

## 5. Luồng làm việc hằng ngày (QUAN TRỌNG)

### Khi có code mới từ team

```bash
git pull
docker compose up
```

* **Không cần `--build`** nếu chỉ thay đổi code `.ts / .tsx`
* Trình duyệt sẽ tự reload khi code thay đổi

### Khi nào CẦN `--build`

Chỉ dùng khi:

* Thay đổi `package.json`
* Thêm / xoá dependency
* Thay đổi `Dockerfile` hoặc `docker-compose.yml`

```bash
docker compose up --build
```

---

## 6. Cấu trúc Docker (tóm tắt để hiểu)

* `Dockerfile.dev`  → dùng cho development
* `docker-compose.yml` → mount source code từ máy vào container
* Docker **chỉ đóng vai trò runtime**, không build lại code mỗi lần

Điều này giúp:

* Dev nhanh
* Không phụ thuộc môi trường máy cá nhân

---

## 7. Các lệnh Docker thường dùng

```bash
# Xem container đang chạy
docker ps

# Dừng project
docker compose down

# Restart container
docker compose restart

# Xem log
docker compose logs -f
```

---

## 8. Lỗi thường gặp & cách xử lý nhanh

### ❌ permission denied docker.sock

Nguyên nhân: user chưa thuộc group docker

Cách sửa:

```bash
sudo usermod -aG docker $USER
```

→ Logout / Login lại

---

### ❌ Port 3000 already in use

Có app khác đang dùng port 3000

Cách xử lý:

* Tắt app đang chiếm port
* Hoặc đổi port trong `docker-compose.yml`

---

## 9. Quy ước cho team

* **KHÔNG** chạy `npm install` trực tiếp trên máy
* **KHÔNG** commit `node_modules`
* Mọi người **chạy project bằng Docker** để đồng nhất môi trường

---

## 10. Ghi chú quan trọng

* Docker cho **development** ≠ Docker cho **production**
* Production sẽ dùng Dockerfile riêng (multi-stage build)
* Tài liệu này chỉ áp dụng cho **dev local**

---

## 11. Hỗ trợ

Nếu gặp lỗi:

* Docker không chạy
* Không access được `localhost:3000`
* Container crash

→ Gửi log cho người phụ trách DevOps / Tech Lead để xử lý.

---

✅ Chỉ cần làm đúng theo README này, mọi thành viên mới vào team đều có thể chạy project trong **5 phút**.
