import { FilterOperatorSpec } from '../types/docs';

export const OPERATORS_DATA: FilterOperatorSpec[] = [
  {
    operator: 'eq',
    syntax: 'status.eq=ACTIVE',
    sqlEquivalent: "= 'ACTIVE'",
    description: {
      en: 'Exact equality comparison (default operator when omitting a suffix, e.g. status=ACTIVE).',
      vi: 'So sánh bằng chính xác (mặc định khi bỏ hậu tố, ví dụ status=ACTIVE).',
      ja: '完全一致比較（演算子接尾辞を省略した場合の既定）。',
      zh: '精确相等匹配（省略运算符后缀时的默认行为）。',
    },
  },
  {
    operator: 'ne',
    syntax: 'status.ne=ARCHIVED',
    sqlEquivalent: "!= 'ARCHIVED'",
    description: {
      en: 'Not-equal exclusion filter matching records whose field value differs.',
      vi: 'So sánh khác (loại trừ các bản ghi mang giá trị chỉ định).',
      ja: '不一致除外フィルタ。',
      zh: '不等于排除过滤。',
    },
  },
  {
    operator: 'like',
    syntax: 'name.like=Server',
    sqlEquivalent: "LOWER(name) LIKE '%server%'",
    description: {
      en: 'Case-insensitive substring match wrapped with SQL % wildcards.',
      vi: 'Tìm chuỗi con không phân biệt hoa thường (%text%).',
      ja: '大文字小文字を区別しない部分一致。',
      zh: '忽略大小写模糊包含匹配。',
    },
  },
  {
    operator: 'startsWith',
    syntax: 'code.startsWith=PRD-',
    sqlEquivalent: "LIKE 'PRD-%'",
    description: {
      en: 'Prefix match leveraging B-Tree index scans when paired with leading constants.',
      vi: 'Khớp tiền tố, tận dụng tốt chỉ mục B-Tree ở phía đầu chuỗi.',
      ja: '前方一致検索（B-Tree インデックス活用可能）。',
      zh: '前缀匹配（可有效利用 B-Tree 索引）。',
    },
  },
  {
    operator: 'endsWith',
    syntax: 'email.endsWith=@corp.com',
    sqlEquivalent: "LIKE '%@corp.com'",
    description: {
      en: 'Suffix match against string endings.',
      vi: 'Khớp hậu tố ở cuối chuỗi ký tự.',
      ja: '後方一致検索。',
      zh: '后缀结束字符匹配。',
    },
  },
  {
    operator: 'gt',
    syntax: 'price.gt=100',
    sqlEquivalent: '> 100',
    description: {
      en: 'Strictly greater-than numeric or ISO-8601 temporal comparison.',
      vi: 'Lớn hơn nghiêm ngặt cho kiểu số hoặc dấu thời gian ISO-8601.',
      ja: 'より大きい（数値・ISO-8601日時対応）。',
      zh: '严格大于比较（支持数值与时间类型）。',
    },
  },
  {
    operator: 'gte',
    syntax: 'price.gte=100',
    sqlEquivalent: '>= 100',
    description: {
      en: 'Greater-than or equal-to inclusive threshold comparison.',
      vi: 'Lớn hơn hoặc bằng ngưỡng giá trị.',
      ja: '以上比較。',
      zh: '大于或等于比较。',
    },
  },
  {
    operator: 'lt',
    syntax: 'stock.lt=50',
    sqlEquivalent: '< 50',
    description: {
      en: 'Strictly less-than boundary comparison.',
      vi: 'Nhỏ hơn nghiêm ngặt.',
      ja: '未満比較。',
      zh: '严格小于比较。',
    },
  },
  {
    operator: 'lte',
    syntax: 'stock.lte=50',
    sqlEquivalent: '<= 50',
    description: {
      en: 'Less-than or equal-to boundary comparison.',
      vi: 'Nhỏ hơn hoặc bằng ngưỡng tối đa.',
      ja: '以下比較。',
      zh: '小于或等于比较。',
    },
  },
  {
    operator: 'in',
    syntax: 'status.in=DRAFT,ACTIVE',
    sqlEquivalent: "IN ('DRAFT', 'ACTIVE')",
    description: {
      en: 'Matches any item inside the comma-separated list of candidate values.',
      vi: 'Khớp một trong các giá trị trong danh sách phân tách dấu phẩy.',
      ja: 'カンマ区切り候補リスト内のいずれかに一致。',
      zh: '匹配逗号分隔集合中的任一成员。',
    },
  },
  {
    operator: 'notIn',
    syntax: 'status.notIn=DELETED,BANNED',
    sqlEquivalent: "NOT IN ('DELETED', 'BANNED')",
    description: {
      en: 'Excludes records matching any item inside the comma-separated exclusion list.',
      vi: 'Loại trừ các bản ghi có giá trị thuộc tập danh sách liệt kê.',
      ja: '除外リストに含まれないレコードを抽出。',
      zh: '排除在指定集合内的值。',
    },
  },
  {
    operator: 'between',
    syntax: 'price.between=100,500',
    sqlEquivalent: 'BETWEEN 100 AND 500',
    description: {
      en: 'Inclusive closed-range comparison with comma-separated lower and upper bounds.',
      vi: 'Tìm trong khoảng đóng [min, max] phân tách bằng dấu phẩy.',
      ja: '下限・上限を含む範囲指定（カンマ区切り）。',
      zh: '闭合区间范围匹配（由逗号分隔上下界）。',
    },
  },
  {
    operator: 'null',
    syntax: 'deletedAt.null=true',
    sqlEquivalent: 'IS NULL / IS NOT NULL',
    description: {
      en: 'Evaluates SQL IS NULL when true, or IS NOT NULL when false.',
      vi: 'Kiểm tra giá trị NULL (true là IS NULL, false là IS NOT NULL).',
      ja: 'true で IS NULL、false で IS NOT NULL を判定。',
      zh: '传入 true 检查 IS NULL，false 检查 IS NOT NULL。',
    },
  },
];
