import React, { useState } from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { Cpu, Zap, Shield, GitBranch, Briefcase, Award, Server, GraduationCap, Sparkles, UserCheck } from 'lucide-react';

interface PageProps {
  currentLang: SupportedLanguage;
}

type ViewpointKey = 'cto' | 'architect' | 'senior' | 'syseng' | 'lecturer' | 'grad' | 'freshman';

const t = (lang: SupportedLanguage, map: Record<SupportedLanguage, string>) => map[lang];

export const OverviewPage: React.FC<PageProps> = ({ currentLang }) => {
  const [activeViewpoint, setActiveViewpoint] = useState<ViewpointKey>('cto');

  const viewpoints = [
    { key: 'cto', icon: Briefcase, title: { en: '1. CTO Viewpoint', vi: '1. Góc Nhìn CTO', ja: '1. CTO の視点', zh: '1. CTO 战略视角' } },
    { key: 'architect', icon: Award, title: { en: '2. Technical Architect', vi: '2. Kiến Trúc Sư Kỹ Thuật', ja: '2. テクニカルアーキテクト', zh: '2. 首席架构师' } },
    { key: 'senior', icon: Zap, title: { en: '3. Senior Java Dev', vi: '3. Senior Java Dev', ja: '3. シニア Java 開発者', zh: '3. 资深 Java 工程师' } },
    { key: 'syseng', icon: Server, title: { en: '4. System / SRE', vi: '4. Kỹ Sư Hệ Thống / SRE', ja: '4. システム / SRE エンジニア', zh: '4. 系统与运维工程' } },
    { key: 'lecturer', icon: GraduationCap, title: { en: '5. Back-end Lecturer', vi: '5. Giảng Viên Back-end', ja: '5. バックエンド講師', zh: '5. 高校计算机讲师' } },
    { key: 'grad', icon: UserCheck, title: { en: '6. Junior Backend', vi: '6. Kỹ Sư Mới Gia Nhập', ja: '6. 若手エンジニア', zh: '6. 初级后端工程师' } },
    { key: 'freshman', icon: Sparkles, title: { en: '7. CS Undergraduate', vi: '7. Sinh Viên CNTT', ja: '7. 情報系学生', zh: '7. 计算机专业学生' } },
  ];

  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-blue">503 Pure Java Files</span>
        <span className="badge badge-amber">38 @Auto* Contracts</span>
        <span className="badge badge-emerald">Java 21+ Enforced</span>
        <span className="badge badge-purple">8 Customizer SPIs</span>
      </div>

      <h1 className="page-title">
        {t(currentLang, {
          en: 'Architecture Overview & 7-Viewpoint Matrix',
          vi: 'Tổng Quan Kiến Trúc & Ma Trận 7 Góc Nhìn',
          ja: 'アーキテクチャ概要と 7つの視点マトリクス',
          zh: '架构全景概述与七重视角矩阵',
        })}
      </h1>

      <p className="page-lead">
        {t(currentLang, {
          en: 'Spring-NWVMC (Next-Wave Virtual Multi-Controller) is a Pure Java (zero compile-time import org.springframework.* across 503 framework files) declarative runtime engine for Java 21+ and Spring Boot 3.3.5. One JPA entity and one marker interface synthesize 38 REST contracts (36 default-visible), multi-cloud storage (Local/S3/GCS), GraphQL SDL, WebSocket STOMP, and Keyset O(1) pagination.',
          vi: 'Spring-NWVMC (Next-Wave Virtual Multi-Controller) là động cơ runtime khai báo thuần Java 21+ cho Spring Boot 3.3.5 gồm 503 tệp không chứa import org.springframework.* khi biên dịch. Từ 1 JPA Entity và 1 Interface rỗng, hệ thống tổng hợp 38 hợp đồng REST (36 tuyến hiển thị mặc định), lưu trữ đa đám mây (Local/S3/GCS), GraphQL SDL, WebSocket STOMP và phân trang Keyset O(1).',
          ja: 'Spring-NWVMCは、Java 21+およびSpring Boot 3.3.5向けにコンパイル時のSpring依存インポートゼロ（503ファイル）で実装された宣言的実行基盤です。1つのJPA EntityとマーカーInterfaceから38のREST契約（標準公開36本）、マルチクラウドストレージ、GraphQL SDL、Keyset O(1)ページネーションを合成します。',
          zh: 'Spring-NWVMC 是基于 Java 21+ 与 Spring Boot 3.3.5 构建的声明式元框架，全核心 503 个文件零编译期 import org.springframework.* 语句。通过 1 个 JPA 实体与 1 个标记接口即可合成 38 个 REST 契约（默认展示 36 个）、多云存储、GraphQL SDL 与 O(1) Keyset 游标分页。',
        })}
      </p>

      <div className="doc-grid-2">
        <div className="doc-card">
          <Zap size={22} style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }} />
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {t(currentLang, {
              en: '1. Two-Directory Layout & 38 Contracts',
              vi: '1. Quy Tắc 2 Thư Mục & 38 Hợp Đồng API',
              ja: '1. 2ディレクトリ構成と38契約API',
              zh: '1. 双目录规范与 38 项内置接口契约',
            })}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {t(currentLang, {
              en: 'Declare Entity classes and AutoApiController<E> interfaces to synthesize 38 REST contracts plus 6 Storage endpoints at /api/v1/storage/*.',
              vi: 'Chỉ khai báo Entity và Interface AutoApiController<E> để sinh tự động 38 hợp đồng REST và 6 API lưu trữ tệp tại /api/v1/storage/*.',
              ja: 'EntityとAutoApiController<E>インターフェースを定義するだけで、38のREST契約と6個のストレージAPIを生成します。',
              zh: '只需编写 Entity 与继承 AutoApiController<E> 的接口，即刻生成 38 个 REST 接口及 6 个 /api/v1/storage/* 存储端点。',
            })}
          </p>
        </div>

        <div className="doc-card">
          <Cpu size={22} style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }} />
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {t(currentLang, {
              en: '2. Pure Java Core & Virtual Threads',
              vi: '2. Lõi Pure Java & Virtual Threads Java 21+',
              ja: '2. Pure Java コア＆仮想スレッド',
              zh: '2. 纯 Java 核心与虚拟线程并发',
            })}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {t(currentLang, {
              en: 'Zero Spring compile-time imports via PureJavaSpringBootstrapBridge, JavaVersionGuardUtil (JDK 21+), and L1 MethodHandle caching.',
              vi: 'Không chứa import Spring tĩnh nhờ PureJavaSpringBootstrapBridge, kiểm soát JVM >= 21 qua JavaVersionGuardUtil và L1 MethodHandle cache.',
              ja: 'PureJavaSpringBootstrapBridgeによる実行時バインド、JavaVersionGuardUtil（JDK 21+強制）、MethodHandle L1キャッシュを搭載。',
              zh: '依托 PureJavaSpringBootstrapBridge 运行时桥接、JavaVersionGuardUtil 版本校验与 L1 MethodHandle 缓存驱动。',
            })}
          </p>
        </div>

        <div className="doc-card">
          <Shield size={22} style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }} />
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {t(currentLang, {
              en: '3. Defense-in-Depth & PII Masking',
              vi: '3. Bảo Mật Đa Tầng & Che Mờ Dữ Liệu PII',
              ja: '3. 多層防御RBACとPIIデータマスキング',
              zh: '3. 纵深防御安全与 PII 动态脱敏',
            })}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {t(currentLang, {
              en: 'Stateless HS512 JWT, CSPRNG 64-byte ephemeral key rotation, @FieldSecurity masking, ConstantTimeComparisonUtil, and @StateMachine guards.',
              vi: 'JWT HS512 phi trạng thái, xoay khóa CSPRNG 64-byte, che mờ @FieldSecurity, ConstantTimeComparisonUtil và luật @StateMachine.',
              ja: 'ステートレスJWT、64バイトCSPRNG鍵ローテーション、@FieldSecurityマスキング、定数時間比較、@StateMachine保護を実装。',
              zh: '提供无状态 HS512 JWT、64 字节 CSPRNG 临时密钥轮换、@FieldSecurity 脱敏、恒定时间比对与状态机防线。',
            })}
          </p>
        </div>

        <div className="doc-card">
          <GitBranch size={22} style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem' }} />
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {t(currentLang, {
              en: '4. Keyset O(1) & 13 Filter Operators',
              vi: '4. Phân Trang Keyset O(1) & 13 Toán Tử Lọc',
              ja: '4. Keyset O(1) と13種類のフィルタ演算子',
              zh: '4. Keyset O(1) 游标与 13 种动态运算符',
            })}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {t(currentLang, {
              en: 'Eliminates linear SQL OFFSET scans using monotonic UUIDv7 cursors, paired with O(1)-RAM CSV/NDJSON streaming.',
              vi: 'Loại bỏ quét OFFSET tuyến tính bằng con trỏ UUIDv7 tăng đơn điệu, kèm xuất/nhập CSV & JSONL tiêu tốn RAM O(1).',
              ja: '単調増加UUIDv7カーソルでOFFSET走査を回避し、O(1)メモリでのCSV/JSONLストリーミングに対応。',
              zh: '利用单调递增 UUIDv7 消除 OFFSET 全表扫描退化，并支持 O(1) 内存 CSV/NDJSON 流式吞吐。',
            })}
          </p>
        </div>
      </div>

      <h2 id="7-viewpoint-matrix" className="section-heading">
        {t(currentLang, {
          en: '1. The 7-Viewpoint Architectural Matrix',
          vi: '1. Ma Trận Kiến Trúc Theo 7 Vai Trò Kỹ Thuật',
          ja: '1. 7つの技術ロール別アーキテクチャマトリクス',
          zh: '1. 七大技术角色视角架构矩阵',
        })}
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {viewpoints.map((vp) => {
          const Icon = vp.icon;
          const isActive = activeViewpoint === vp.key;
          return (
            <button
              key={vp.key}
              onClick={() => setActiveViewpoint(vp.key as ViewpointKey)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                background: isActive ? 'var(--brand-glow)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} />
              {vp.title[currentLang]}
            </button>
          );
        })}
      </div>

      <div className="doc-card" style={{ marginBottom: '2rem' }}>
        {activeViewpoint === 'cto' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'CTO Viewpoint: Standardized CRUD Footprint & Spring Version Decoupling',
                vi: 'Góc Nhìn CTO: Chuẩn Hóa Lớp API & Độc Lập Phiên Bản Spring',
                ja: 'CTO視点: CRUD標準化とSpringバージョン非依存設計',
                zh: 'CTO 视角: 标准化 CRUD 资产与 Spring 版本解耦',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: '38 @Auto* REST contracts + 6 File Storage APIs + GraphQL synthesized uniformly across domain entities.',
                vi: '38 hợp đồng REST @Auto* + 6 API lưu trữ tệp + GraphQL đồng bộ trên toàn hệ thống.',
                ja: '全エンティティで統一された38の@Auto* REST契約、6ストレージAPI、GraphQLを提供。',
                zh: '全领域实体统一提供 38 个 @Auto* REST 契约、6 个存储接口与 GraphQL 子系统。',
              })}</li>
              <li>{t(currentLang, {
                en: 'Zero compile-time Spring source coupling protects multi-year platform upgrades.',
                vi: 'Tách biệt hoàn toàn import org.springframework.* trong lõi framework giúp an toàn nâng cấp dài hạn.',
                ja: 'コアにSpring直接インポートを持たないため長期的なメジャーアップデート影響を隔離。',
                zh: '核心零 Spring 源码导入，显著降低长期框架跨版本升级耦合风险。',
              })}</li>
              <li>{t(currentLang, {
                en: 'Secure-by-Default locks (/system/studio and /api/v1/auth/token return 404 when disabled).',
                vi: 'Cơ chế Secure-by-Default khóa /system/studio và /api/v1/auth/token bằng HTTP 404 trong production.',
                ja: 'Secure-by-Defaultにより本番初期状態では/system/studioとデモ認証をHTTP 404で閉鎖。',
                zh: '默认安全加固策略确保未显式开启时 /system/studio 与演示鉴权接口返回 HTTP 404。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'architect' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'Technical Architect: Pure Java Bridges, Layer SRP & Open RFC Compliance',
                vi: 'Kiến Trúc Sư Kỹ Thuật: Cầu Nối Pure Java, Layer SRP & Chuẩn RFC',
                ja: 'テクニカルアーキテクト: Pure Javaブリッジ、厳格SRP＆RFC準拠',
                zh: '首席架构师: 纯 Java 运行时桥接、严格分层 SRP 与 RFC 标准',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'Runtime registration orchestrated by PureJavaSpringBootstrapBridge, PureJavaBeanRegistrarBridge, and SpringMvcEndpointBridge.',
                vi: 'Đăng ký bean và định tuyến runtime qua PureJavaSpringBootstrapBridge, PureJavaBeanRegistrarBridge và SpringMvcEndpointBridge.',
                ja: 'PureJavaSpringBootstrapBridge・PureJavaBeanRegistrarBridge・SpringMvcEndpointBridgeによる動的配線。',
                zh: '通过 PureJavaSpringBootstrapBridge、PureJavaBeanRegistrarBridge 与 SpringMvcEndpointBridge 动态完成装配。',
              })}</li>
              <li>{t(currentLang, {
                en: 'Strict Layer SRP: Marker Controller dispatches requests; complex domain flows live inside @AutoComponent final Helper classes.',
                vi: 'Strict Layer SRP: Interface Controller chỉ điều phối; nghiệp vụ mở rộng tách vào lớp Helper @AutoComponent final.',
                ja: 'Strict Layer SRP: Controllerはディスパッチ専任、拡張処理は@AutoComponent final Helperへ分離。',
                zh: '严格分层单职责：Controller 接口纯调度，扩展逻辑拆入 @AutoComponent final Helper 类。',
              })}</li>
              <li>{t(currentLang, {
                en: 'Implements RFC 9562 (UUIDv7), RFC 6902 (JSON Patch), RFC 7232 (ETag), RFC 4180 (CSV), W3C TraceContext, and CloudEvents v1.0.',
                vi: 'Tuân thủ RFC 9562 (UUIDv7), RFC 6902 (JSON Patch), RFC 7232 (ETag), RFC 4180 (CSV), W3C TraceContext và CloudEvents v1.0.',
                ja: 'RFC 9562、RFC 6902、RFC 7232、RFC 4180、W3C TraceContext、CloudEvents v1.0に準拠。',
                zh: '严格遵循 RFC 9562 (UUIDv7)、RFC 6902 (JSON Patch)、RFC 7232 (ETag)、RFC 4180 (CSV) 与 CloudEvents v1.0。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'senior' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'Senior Java Dev: Reflection L1 Caches, Zero Magic Strings & Test Coverage',
                vi: 'Senior Java Dev: L1 Cache Reflection, Zero Hard-Code & Độ Phủ Kiểm Thử',
                ja: 'シニアJava開発者: L1キャッシュ設計・定数管理・自動テスト品質',
                zh: '资深 Java 工程师: L1 反射缓存、零硬编码与全量测试覆盖',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'ReflectionMetadataCacheUtil caches Class<?>, Method, Constructor<?>, and unreflected MethodHandles across 13 lock-free ConcurrentHashMaps.',
                vi: 'ReflectionMetadataCacheUtil lưu sẵn Class<?>, Method, Constructor<?> và MethodHandle trong 13 ConcurrentHashMap không khóa.',
                ja: 'ReflectionMetadataCacheUtilがClass/Method/MethodHandleを13のConcurrentHashMapに事前キャッシュ。',
                zh: 'ReflectionMetadataCacheUtil 在 13 个无锁 ConcurrentHashMap 中缓存类型、方法与 MethodHandle 句柄。',
              })}</li>
              <li>{t(currentLang, {
                en: 'Verified suite: 473 framework unit tests + 140 JitPack implementation integration tests = 613 PASS (0 failures).',
                vi: 'Kết quả kiểm thử: 473 unit test framework + 140 integration test JitPack implementation = 613 PASS (0 lỗi).',
                ja: '検証済みテスト：フレームワーク単体473件＋JitPack統合140件＝合計613件PASS（失敗0）。',
                zh: '自动化测试实测：核心框架 473 项 + JitPack 集成参考 140 项 = 613 项全部通过（0 失败）。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'syseng' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'System / SRE: Virtual Threads, Bounded Pools & Zero Whitelabel Errors',
                vi: 'System / SRE: Virtual Threads, Connection Pool Giới Hạn & Zero Whitelabel',
                ja: 'システム / SRE: 仮想スレッド、有界プール制御＆Whitelabel完全排除',
                zh: '系统与运维工程: 虚拟线程、有界连接池与容器异常归一化',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'Apache JMeter benchmark: 2,000 requests with 0.0% error rate at 151.0 req/s (avg 91 ms).',
                vi: 'Kiểm thử tải Apache JMeter: 2,000 requests với 0.0% lỗi, thông lượng 151.0 req/s (trung bình 91 ms).',
                ja: 'Apache JMeter負荷試験：2,000リクエストでエラー率0.0%、スループット151.0 req/s（平均91 ms）。',
                zh: 'Apache JMeter 压测实绩：2,000 次请求 0.0% 错误率，吞吐 151.0 req/s，平均响应 91 ms。',
              })}</li>
              <li>{t(currentLang, {
                en: 'RateLimitingFilter (10,000-entry Caffeine cache, 20 req/s on /api/v1/auth/**) + CircuitBreaker + CustomContainerErrorController.',
                vi: 'RateLimitingFilter (Caffeine giới hạn 10,000 khóa, 20 req/s tại /api/v1/auth/**) + CircuitBreaker + CustomContainerErrorController.',
                ja: 'RateLimitingFilter（10,000件上限Caffeine、認証API 20 req/s）＋CircuitBreaker＋コンテナエラー正規化。',
                zh: '集成 RateLimitingFilter（10,000 上限 Caffeine，认证路径 20 req/s）、熔断器与全量容器错误 JSON 归一。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'lecturer' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'Back-end Lecturer: Concrete Implementation of Design Patterns & SOLID',
                vi: 'Giảng Viên Back-end: Mô Hình Thực Hành Design Patterns & SOLID',
                ja: 'バックエンド講師: デザインパターンとSOLID原則の教材実装',
                zh: '高校计算机讲师: 设计模式与 SOLID 原则工程样本',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'Demonstrates JDK Dynamic Proxy (ControllerProxyInvocationHandler), Builder Pattern, Strategy Pattern (FileStorageProvider), and 8 SPI Customizer interfaces.',
                vi: 'Minh họa cụ thể JDK Dynamic Proxy (ControllerProxyInvocationHandler), Builder Pattern, Strategy Pattern và 8 giao diện SPI Customizer.',
                ja: 'JDK動的プロキシ、Builderパターン、Strategyパターン、8種のSPIカスタマイザインターフェースを網羅。',
                zh: '涵盖 JDK 动态代理、建造者模式、策略模式以及 8 个基于 default 方法的 SPI 扩展接口。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'grad' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'Junior Backend: Auto-Generated OpenAPI 3.0 & TypeScript Schemas',
                vi: 'Kỹ Sư Mới Gia Nhập: Tự Sinh OpenAPI 3.0 & Schema TypeScript',
                ja: '若手エンジニア: OpenAPI 3.0とTypeScriptスキーマ自動出力',
                zh: '初级后端工程师: 即用型 OpenAPI 3.0 与 TypeScript 类型导出',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'Export frontend interfaces from GET /schema/typescript and Draft-07 contracts from GET /schema/json.',
                vi: 'Xuất trực tiếp interface TypeScript qua GET /schema/typescript và JSON Schema Draft-07 qua GET /schema/json.',
                ja: 'GET /schema/typescript および GET /schema/json からフロントエンド型定義を即座に抽出。',
                zh: '通过 GET /schema/typescript 与 GET /schema/json 直接同步前端强类型定义。',
              })}</li>
              <li>{t(currentLang, {
                en: '20-language /system/studio interactive runner (gated behind app.framework.studio.enabled=true in dev environments).',
                vi: 'Giao diện /system/studio hỗ trợ 20 ngôn ngữ (chỉ bật qua app.framework.studio.enabled=true ở môi trường phát triển).',
                ja: '20言語対応の /system/studio（開発環境で app.framework.studio.enabled=true 時のみ有効）。',
                zh: '支持 20 国语言的 /system/studio 联调台（仅开发配置开启 app.framework.studio.enabled=true 时启用）。',
              })}</li>
            </ul>
          </div>
        )}
        {activeViewpoint === 'freshman' && (
          <div>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
              {t(currentLang, {
                en: 'CS Undergraduate: Minimal Boilerplate & Actionable Startup Diagnostics',
                vi: 'Sinh Viên CNTT: Khởi Tạo Tối Giản & Chẩn Đoán Lỗi Rõ Ràng',
                ja: '情報系学生: 最小ボイラープレートと起動時エラー診断ガイド',
                zh: '计算机专业学生: 极简启动与明确自检诊断提示',
              })}
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>{t(currentLang, {
                en: 'One JPA Entity class and one AutoApiController<E> interface expose functional REST endpoints immediately.',
                vi: 'Khai báo 1 lớp Entity và 1 Interface AutoApiController<E> là đủ để chạy đầy đủ endpoint REST.',
                ja: '1つのEntityクラスと1つのAutoApiController<E>インターフェースのみでREST API一式が起動します。',
                zh: '只需编写 1 个实体类与 1 个继承 AutoApiController<E> 的接口即可运行完整接口。',
              })}</li>
              <li>{t(currentLang, {
                en: 'DeveloperFriendlyDiagnosticsHelper flags missing @Id or missing no-arg constructors cleanly during startup.',
                vi: 'DeveloperFriendlyDiagnosticsHelper chỉ rõ vị trí thiếu @Id hoặc constructor không tham số ngay khi khởi động.',
                ja: 'DeveloperFriendlyDiagnosticsHelperが起動時に@Id欠落や引数なしコンストラクタ不足を明示します。',
                zh: 'DeveloperFriendlyDiagnosticsHelper 在启动自检阶段明确提示 @Id 缺失或无参构造器问题。',
              })}</li>
            </ul>
          </div>
        )}
      </div>

      <h2 id="architecture" className="section-heading">
        {t(currentLang, {
          en: '2. High-Level Execution Pipeline',
          vi: '2. Luồng Thực Thi Hệ Thống Cấp Cao',
          ja: '2. ハイレベル実行パイプライン',
          zh: '2. 高层架构执行链路',
        })}
      </h2>

      <CodeBlock
        language="text"
        title="Spring-NWVMC Pure Java Runtime Execution Flow"
        code={`[ Client HTTP / Multipart / GraphQL / WebSocket Request ]
       │
       ▼
[ JavaVersionGuardUtil (Enforces JDK 21+) ]
       │
       ▼
[ TraceIdFilter (W3C traceparent + UUIDv7 MDC) ] ──> [ RateLimitingFilter (1,000 req/s / 20 req/s Auth) ]
       │
       ▼
[ JwtAuthenticationFilter + PureJavaSecurityFilterBridge (Stateless HS512 RBAC) ]
       │
       ├──> [ DynamicControllerProxyRegistrarHelper -> ControllerProxyInvocationHandler ]
       │      ├── 38 Synthesized Entity REST Contracts (36 Default-Visible; CRUD, Keyset O(1), Patch, Diff)
       │      ├── @EntitySecurity, @FieldSecurity (PII Masking), @StateMachine
       │      └── Caffeine L1 Cache + @HttpCacheable SHA-256 ETag (HTTP 304)
       │
       └──> [ Built-In Platform Controllers ]
              ├── FileStorageController (/api/v1/storage/* -> LOCAL | AWS S3 | GCS)
              ├── GraphQLDynamicApiController (/api/v1/graphql & /api/v1/graphql/schema)
              ├── DevStudioController (/system/studio [@Hidden, opt-in]) & AuthController (/api/v1/auth/token)
              └── TimeTravelDynamicApiController (/api/v1/system/time-travel/*)`}
      />

      <Callout
        type="info"
        title={t(currentLang, {
          en: 'Zero Domain Coupling',
          vi: 'Hoàn Toàn Phi Domain',
          ja: '完全ドメイン非依存設計',
          zh: '完全领域无关通用核心',
        })}
      >
        {t(currentLang, {
          en: 'Packages inside io.github.natswarchuan contain zero domain-specific assumptions; all behaviors derive dynamically from entity metadata and declarative annotations.',
          vi: 'Toàn bộ mã nguồn trong io.github.natswarchuan hoàn toàn phi domain; mọi hành vi suy luận động từ metadata thực thể và chú thích khai báo.',
          ja: 'io.github.natswarchuan 配下に特定業務ロジックは一切含まれず、エンティティのメタデータのみで動的に制御されます。',
          zh: 'io.github.natswarchuan 命名空间绝无写死业务领域代码，完全依据 JPA 元数据与声明式注解动态驱动。',
        })}
      </Callout>

      <h2 id="maven-coordinates" className="section-heading">
        {t(currentLang, {
          en: '3. Maven Dependency Coordinates',
          vi: '3. Tọa Độ Phụ Thuộc Maven (JitPack)',
          ja: '3. Maven 依存関係座標',
          zh: '3. Maven 依赖配置坐标',
        })}
      </h2>

      <CodeBlock
        language="xml"
        fileName="pom.xml"
        code={`<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<properties>
    <java.version>21</java.version>
    <maven.compiler.release>21</maven.compiler.release>
</properties>

<dependencies>
    <dependency>
        <groupId>com.github.NatswarChuan</groupId>
        <artifactId>Spring-NWVMC</artifactId>
        <version>v0.0.2</version>
    </dependency>
</dependencies>`}
      />
    </div>
  );
};
