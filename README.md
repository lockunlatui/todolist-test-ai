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
