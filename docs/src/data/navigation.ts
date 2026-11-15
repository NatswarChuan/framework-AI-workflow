import { NavCategory } from '../types/docs';

export const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    id: 'getting-started',
    title: {
      en: '1. Getting Started',
      vi: '1. Bắt Đầu Nhanh',
      ja: '1. はじめに',
      zh: '1. 快速入门',
    },
    items: [
      {
        id: 'overview',
        category: 'getting-started',
        title: {
          en: 'Architecture Overview & 7-Viewpoint Matrix',
          vi: 'Tổng Quan Kiến Trúc & Ma Trận 7 Viewpoints',
          ja: 'アーキテクチャ概要と7つの視点マトリクス',
          zh: '架构概览与七重视角决策矩阵',
        },
      },
      {
        id: 'quickstart',
        category: 'getting-started',
        title: {
          en: '3-Step Quickstart Guide',
          vi: 'Hướng Dẫn 3 Bước Triển Khai',
          ja: '3ステップクイックスタート',
          zh: '三步极速上手指南',
        },
      },
      {
        id: 'two-directory',
        category: 'getting-started',
        title: {
          en: 'The Strict 2-Directory Rule',
          vi: 'Quy Tắc Nghiêm Ngặt 2 Thư Mục',
          ja: '厳格な2ディレクトリ規則',
          zh: '严格的双目录规范',
        },
      },
    ],
  },
  {
    id: 'core-engine',
    title: {
      en: '2. Framework Core Engine',
      vi: '2. Lõi Động Cơ Framework',
      ja: '2. フレームワークコアエンジン',
      zh: '2. 框架核心引擎',
    },
    items: [
      {
        id: 'pure-java-storage',
        category: 'core-engine',
        badge: 'NEW',
        badgeType: 'emerald',
        title: {
          en: '100% Pure Java Core & Multi-Cloud File Storage',
          vi: 'Lõi 100% Pure Java & Lưu Trữ Tệp (Local/S3/GCS)',
          ja: '100% Pure Java コア＆マルチクラウドストレージ',
          zh: '100% 纯 Java 引擎与多云文件存储 (Local/S3/GCS)',
        },
      },
      {
        id: 'dynamic-proxy',
        category: 'core-engine',
        title: {
          en: 'Dynamic Java Proxy Dispatcher',
          vi: 'Điều Phối Viên Dynamic Java Proxy',
          ja: '動的Javaプロキシディスパッチャ',
          zh: '动态Java代理调度器',
        },
      },
      {
        id: 'virtual-threads',
        category: 'core-engine',
        title: {
          en: 'Java 21 Virtual Threads & Concurrency',
          vi: 'Virtual Threads Java 21 & Hiệu Năng',
          ja: 'Java 21仮想スレッドと並行性',
          zh: 'Java 21虚拟线程与高并发',
        },
      },
      {
        id: 'custom-endpoints',
        category: 'core-engine',
        title: {
          en: 'Custom Endpoints & Delegate Beans (@CustomEndpoint)',
          vi: 'Mở Rộng Endpoint Tùy Biến (@CustomEndpoint)',
          ja: 'カスタムエンドポイントと委譲ビーン (@CustomEndpoint)',
          zh: '自定义端点与委托Bean扩展 (@CustomEndpoint)',
        },
      },
      {
        id: 'graphql-subsystem',
        category: 'core-engine',
        title: {
          en: 'Dynamic GraphQL Engine (/api/v1/graphql & SDL)',
          vi: 'Động Cơ GraphQL Động (/api/v1/graphql & SDL)',
          ja: '動的GraphQLエンジン (/api/v1/graphql & SDL)',
          zh: '动态GraphQL引擎 (/api/v1/graphql 与 SDL)',
        },
      },
      {
        id: 'multi-database',
        category: 'core-engine',
        title: {
          en: 'Multi-Database Platform & Dynamic Cluster Routing',
          vi: 'Đa Nền Tảng CSDL & Định Tuyến Cụm Động',
          ja: 'マルチDBプラットフォームと動的クラスタルーティング',
          zh: '多数据库平台支持与动态集群路由',
        },
      },
      {
        id: 'websocket-stomp',
        category: 'core-engine',
        title: {
          en: 'Real-Time WebSocket & STOMP Messaging Subsystem',
          vi: 'Hạ Tầng Real-Time WebSocket & STOMP',
          ja: 'リアルタイム WebSocket & STOMP メッセージング',
          zh: '实时 WebSocket 与 STOMP 消息子系统',
        },
      },
      {
        id: 'distributed-lock',
        category: 'core-engine',
        title: {
          en: 'Declarative Distributed Locks (@DistributedLock)',
          vi: 'Khóa Phân Tán Declarative (@DistributedLock)',
          ja: '宣言的分散ロック (@DistributedLock)',
          zh: '声明式分布式锁机制 (@DistributedLock)',
        },
      },
      {
        id: 'webhook-subsystem',
        category: 'core-engine',
        title: {
          en: 'Declarative Outbound Webhooks (@EntityWebhook)',
          vi: 'Hệ Thống Outbound Webhooks (@EntityWebhook)',
          ja: '宣言的アウトバウンドWebhook (@EntityWebhook)',
          zh: '声明式外部Webhook事件分发 (@EntityWebhook)',
        },
      },
      {
        id: 'time-travel',
        category: 'core-engine',
        title: {
          en: 'Audit Trail Time-Travel & State Reconstruction',
          vi: 'Động Cơ Time-Travel & Tái Tạo Lịch Sử',
          ja: '監査タイムトラベルと過去状態復元',
          zh: '审计追踪时间旅行与实体历史状态复原',
        },
      },
      {
        id: 'idempotency',
        category: 'core-engine',
        title: {
          en: 'Distributed Idempotency Engine (@Idempotent)',
          vi: 'Hạ Tầng Idempotency Phân Tán (@Idempotent)',
          ja: '分散冪等性（Idempotency）基盤 (@Idempotent)',
          zh: '分布式幂等性保障子系统 (@Idempotent)',
        },
      },
      {
        id: 'distributed-tracing',
        category: 'core-engine',
        title: {
          en: 'W3C TraceContext Distributed Tracing',
          vi: 'Truy Vết Phân Tán Chuẩn W3C TraceContext',
          ja: 'W3C TraceContext 準拠分散トレーシング',
          zh: 'W3C TraceContext 标准分布式全链路追踪',
        },
      },
    ],
  },
  {
    id: 'annotations',
    title: {
      en: '3. Declarative Annotations',
      vi: '3. Chú Thích Khai Báo (Annotations)',
      ja: '3. 宣言的アノテーション',
      zh: '3. 声明式注解系统',
    },
    items: [
      {
        id: 'annotations-ref',
        category: 'annotations',
        title: {
          en: 'Universal Annotations Deep Dive (10 Core Annotations)',
          vi: 'Phân Tích Chi Tiết 10 Chú Thích Khai Báo Cốt Lõi',
          ja: '10大中核アノテーション徹底解説',
          zh: '10大核心声明式注解技术专篇',
        },
      },
    ],
  },
  {
    id: 'endpoints',
    title: {
      en: '4. REST API Endpoint Catalog',
      vi: '4. Danh Mục 38 Endpoint RESTful',
      ja: '4. 38のREST APIエンドポイントカタログ',
      zh: '4. 38个内置RESTful端点目录',
    },
    items: [
      {
        id: 'endpoints-catalog',
        category: 'endpoints',
        title: {
          en: '38 Auto-Generated REST Endpoints Catalog',
          vi: '38 Endpoint Tự Động Sinh & Chi Tiết',
          ja: '38の自動生成RESTエンドポイント詳述',
          zh: '38个自动生成REST端点完全清单',
        },
      },
    ],
  },
  {
    id: 'query-engine',
    title: {
      en: '5. Dynamic Query Engine',
      vi: '5. Động Cơ Truy Vấn Động',
      ja: '5. 動的クエリエンジン',
      zh: '5. 动态查询与过滤引擎',
    },
    items: [
      {
        id: 'query-operators',
        category: 'query-engine',
        title: {
          en: '13 Filter Operators & Keyset Pagination',
          vi: '13 Toán Tử Lọc & Phân Trang Keyset',
          ja: '13のフィルタ演算子とKeysetページネーション',
          zh: '13种过滤运算符与Keyset游标分页',
        },
      },
    ],
  },
  {
    id: 'security-rbac',
    title: {
      en: '6. Security & Data Masking',
      vi: '6. Bảo Mật RBAC & Che Mờ Dữ Liệu',
      ja: '6. セキュリティとデータマスキング',
      zh: '6. 安全RBAC与数据脱敏',
    },
    items: [
      {
        id: 'security-rbac-ref',
        category: 'security-rbac',
        title: {
          en: 'NIST Level 2 RBAC & JWT Stateless',
          vi: 'RBAC Phân Quyền & JWT Không Trạng Thái',
          ja: 'NISTレベル2 RBACとステートレスJWT',
          zh: 'NIST Level 2 RBAC与无状态JWT',
        },
      },
    ],
  },
  {
    id: 'spring-ai',
    title: {
      en: '7. Spring AI Integration',
      vi: '7. Tích Hợp Trí Tuệ Nhân Tạo (Spring AI)',
      ja: '7. Spring AI連携',
      zh: '7. Spring AI大模型集成',
    },
    items: [
      {
        id: 'spring-ai-ref',
        category: 'spring-ai',
        title: {
          en: 'Natural Language SQL & AI Tool Schemas',
          vi: 'Truy Vấn Ngôn Ngữ Tự Nhiên & AI Tool Schema',
          ja: '自然言語クエリとAIツールスキーマ',
          zh: '自然语言SQL转换与AI工具定义',
        },
      },
    ],
  },
  {
    id: 'customizers-integration',
    title: {
      en: '8. 8 Customizer SPIs & Integration',
      vi: '8. 8 Giao Diện SPI Customizer & Tích Hợp Ngoài',
      ja: '8. 8種のSPIカスタマイザ＆外部システム統合',
      zh: '8. 8 个扩展自定义器 SPI 与外部集成',
    },
    items: [
      {
        id: 'customizers-ref',
        category: 'customizers-integration',
        title: {
          en: '8 Customizer SPIs, HTTP ETag & DevEx',
          vi: '8 Customizer SPIs, HTTP ETag & DevEx',
          ja: '8種カスタマイザSPI、HTTP ETag＆DevEx',
          zh: '8 个自定义器 SPI、HTTP ETag 与启动诊断',
        },
      },
    ],
  },
];
