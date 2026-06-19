# Todolist App

Ứng dụng quản lý công việc hàng ngày (Todo) xây dựng bằng React + TypeScript + Vite.

## Tính năng

- Thêm công việc mới
- Đánh dấu hoàn thành / chưa hoàn thành
- Xóa công việc (có hiệu ứng thoát)
- Trạng thái rỗng thân thiện khi chưa có công việc
- Lưu trữ offline qua `localStorage`; sẵn sàng tích hợp backend qua `GET /todos`
- Giao diện responsive trên mobile

## Yêu cầu

- Node.js ≥ 18
- npm ≥ 9 (hoặc pnpm / yarn)

## Cài đặt & chạy

```bash
npm install
npm run dev        # khởi động dev server tại http://localhost:5173
```

## Kiểm thử

```bash
npm test           # chạy toàn bộ test suite (vitest, chế độ run-once)
npm run test:watch # chế độ watch (tự reload khi thay đổi file)
```

## Build

```bash
npm run build      # TypeScript kiểm tra + Vite build → thư mục dist/
npm run preview    # xem trước bản build tại http://localhost:4173
```

## Cấu trúc thư mục

```
src/
├── components/       # UI components (TodoItem, TodoList, AddTodo, EmptyState)
├── hooks/            # useTodos — state management + localStorage + API sync
├── pages/            # Home page
├── types/            # TypeScript types (Todo, TodoAction)
├── __tests__/        # Unit & integration tests
└── test/setup.ts     # Vitest global setup (jest-dom matchers, fetch mock)
```

## Hành vi offline-first

Khi **không có backend**, tất cả thao tác (thêm, xóa, đánh dấu hoàn thành) chỉ được lưu vào `localStorage`. Fetch tới `PATCH /todos/:id` và `DELETE /todos/:id` sẽ thất bại lặng lẽ — dữ liệu vẫn được giữ nguyên trên thiết bị. Không có rollback hay thông báo lỗi trong chế độ offline-first này.

Khi backend **đã triển khai và phản hồi** (tức là `GET /todos` ban đầu trả về 200), mọi lỗi từ `PATCH`/`DELETE` (response không `ok`) sẽ:
1. **Rollback** state về trạng thái trước thao tác (undo optimistic update).
2. **Hiển thị thông báo lỗi** inline để người dùng biết cần thử lại.

## Tích hợp backend (tuỳ chọn)

Hook `useTodos` gọi `GET /todos` khi mount. Nếu endpoint trả về danh sách todo (JSON array), dữ liệu sẽ được dùng làm nguồn chính và lưu lại vào `localStorage` làm cache offline. Nếu không có backend, fetch thất bại lặng lẽ và `localStorage` được dùng thay thế.

Định dạng response mong đợi:

```json
[
  {
    "id": "uuid",
    "title": "Tên công việc",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```
