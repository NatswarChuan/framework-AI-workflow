# Rule 25: Tối Ưu Hóa SQL Cho Big Data & Ưu Tiên Eager-Load Thay Vì Lazy-Load

Tài liệu này quy chuẩn bắt buộc về việc tối đa hóa hiệu năng câu lệnh SQL để làm việc với dữ liệu lớn (**Big Data / Millions of Records**) và xác lập nguyên tắc **luôn ưu tiên Eager-Loading hơn Lazy-Loading** nhằm triệt tiêu hoàn toàn độ trễ I/O mạng, lỗi n+1 query và chi phí tính toán ngầm.

---

## 1. NGUYÊN TẮC: LUÔN ƯU TIÊN EAGER-LOAD HƠN LAZY-LOAD

> **NGUYÊN TẮC BẮT BUỘC (EAGER-LOADING FIRST IN BIG DATA)**:
> Trong các hệ thống xử lý dữ liệu lớn (Big Data) và công suất cao, **Lazy-Loading là phản mẫu (Anti-Pattern) cực kỳ nguy hiểm**:
> - Lazy-load gây ra thảm họa **N+1 Query**: Quét 10,000 bản ghi sẽ phát sinh thêm 10,000 câu lệnh SELECT tiếp theo, làm sập Database và tắc nghẽn đường truyền mạng.
> - Lazy-load gây lỗi `LazyInitializationException` khi truy cập dữ liệu bên ngoài transaction.
> - **QUY TẮC**: **LUÔN ƯU TIÊN EAGER-LOAD CÓ CHỦ ĐÍCH**:
>   1. Tải trọn vẹn các quan hệ liên quan trong **DUY NHẤT 1 CÂU TRUY VẤN SQL** thông qua **`@EntityGraph`** hoặc mệnh đề **`JOIN FETCH`**.
>   2. Sử dụng **DTO Projections** (`SELECT new ...`) để chỉ truy vấn đúng các cột dữ liệu cần thiết từ Database, không tải toàn bộ Entity cồng kềnh vào bộ nhớ.

---

## 2. TỐI ƯU HÓA SQL CHO DỮ LIỆU LỚN (BIG DATA QUERY OPTIMIZATION)

1. **Phân Trang Hiệu Năng Cao: Keyset Pagination (Cursor-based) Thay Vì OFFSET**:
   - Phân trang truyền thống `LIMIT :size OFFSET :offset` khi dữ liệu đạt hàng triệu bản ghi (ví dụ: `OFFSET 1000000`) cực kỳ chậm (độ phức tạp O(N)) do cơ sở dữ liệu phải quét qua và vứt bỏ 1,000,000 bản ghi trước đó.
   - Với Big Data: **BẮT BUỘC ÁP DỤNG KEYSET PAGINATION (Cursor-based / Seek Method)**:
     ```sql
     SELECT * FROM orders WHERE id > :lastSeenId ORDER BY id ASC LIMIT :size
     ```
   - Tận dụng chỉ mục B-Tree của **UUIDv7** để đạt tốc độ truy vấn **O(1)** bất kể dữ liệu lớn đến đâu.
2. **Triệt Tiêu `SELECT *` - Sử Dụng Column Projections**:
   - Tuyệt đối không chọn toàn bộ cột của bảng lớn. Chỉ truy vấn các cột cần thiết cho nghiệp vụ để giảm tải băng thông mạng và tiết kiệm RAM.
3. **Đánh Index Chuẩn Xác & Phủ Kín Điều Kiện Truy Vấn**:
   - Đánh B-Tree Index cho mọi khóa ngoại (Foreign Keys), trường thời gian (`created_at`) và định danh `UUIDv7`.
   - Tạo Composite Index cho các mệnh đề kết hợp: `WHERE tenant_id = ... AND status = ... ORDER BY created_at DESC`.
4. **Tránh Các Cú Pháp Vô Hiệu Hóa Index**:
   - CẤM sử dụng ký tự đại diện `%` ở đầu chuỗi (`LIKE '%keyword'`) gây Full Table Scan.
   - CẤM dùng hàm tính toán trên cột có index (ví dụ: cấm `WHERE UPPER(email) = ...`, thay vào đó lưu chuỗi lowercase sẵn).
5. **Xử Lý Dữ Liệu Lớn Bằng Stream & Chunking**:
   - Không nạp hàng trăm nghìn bản ghi vào `List<T>` gây tràn bộ nhớ (`OutOfMemoryError`).
   - Sử dụng `Stream<T>` kết hợp Hibernate Scrollable Results hoặc xử lý theo từng khối (Batch Chunking).

---

## 3. MẪU TRIỂN KHAI JPA REPOSITORY TỐI ƯU BIG DATA

```java
package com.enterprise.app.repository;

import com.enterprise.app.dto.OrderSummaryDto;
import com.enterprise.app.entity.OrderEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác dữ liệu Đơn Hàng tối ưu hóa tối đa cho Big Data.
 */
@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {

  /**
   * Ưu tiên Eager-load các mối quan hệ (items, customer) trong DUY NHẤT 1 CÂU TRUY VẤN
   * thông qua @EntityGraph, triệt tiêu hoàn toàn lỗi N+1 Query.
   */
  @EntityGraph(attributePaths = {"orderItems", "customer"})
  @Query("SELECT o FROM OrderEntity o WHERE o.id = :orderId")
  Optional<OrderEntity> findByIdWithDetails(@Param("orderId") String orderId);

  /**
   * Keyset Pagination (Cursor-based) tối ưu cho Big Data (O(1) complexity).
   * Thay thế hoàn toàn phân trang OFFSET chậm chạp trên hàng triệu bản ghi.
   */
  @Query("SELECT o FROM OrderEntity o WHERE o.id > :lastSeenId ORDER BY o.id ASC")
  List<OrderEntity> findNextPageWithKeyset(
      @Param("lastSeenId") String lastSeenId,
      Pageable pageable
  );

  /**
   * DTO Projection tối ưu: Chỉ đọc các cột cần thiết từ DB, giảm 90% tải bộ nhớ.
   */
  @Query("SELECT new com.enterprise.app.dto.OrderSummaryDto(o.id, o.orderCode, o.totalAmount, o.status) "
      + "FROM OrderEntity o WHERE o.customerId = :customerId ORDER BY o.id DESC")
  List<OrderSummaryDto> findSummariesByCustomerId(
      @Param("customerId") String customerId,
      Pageable pageable
  );
}
```

---

## 4. CHECKLIST ĐỐI SOÁT SQL & BIG DATA TRƯỚC KHI BÀN GIAO

- [ ] **Ưu Tiên Eager-Load**: Quan hệ liên quan được tải chủ động bằng `@EntityGraph` hoặc `JOIN FETCH`, 0 câu lệnh Lazy lén lút sinh ra N+1 query.
- [ ] **DTO Projections**: Sử dụng projection cho các truy vấn danh sách, không load toàn bộ Entity nặng nề.
- [ ] **Big Data Pagination**: Áp dụng Keyset Pagination (Cursor-based) cho các bảng dữ liệu lớn thay vì `OFFSET`.
- [ ] **Tối Ưu Index**: Mọi cột trong mệnh đề `WHERE`, `JOIN`, `ORDER BY` đều có chỉ mục B-Tree tương ứng.
- [ ] **Không Có Full Table Scan**: Không dùng `LIKE '%...'`, không dùng hàm trên cột index.
