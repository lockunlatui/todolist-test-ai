import './EmptyState.css';

export function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">📋</div>
      <h2 className="empty-state__title">Chưa có công việc nào</h2>
      <p className="empty-state__hint">
        Nhập tiêu đề bên trên và nhấn <strong>Thêm</strong> để bắt đầu!
      </p>
    </div>
  );
}
