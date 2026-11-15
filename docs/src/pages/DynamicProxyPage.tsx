import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const LABELS = {
  step1Title: {
    vi: 'Quét Classpath Pure Java',
    en: 'Pure Java Classpath Scan',
    ja: 'Pure Java クラスパススキャン',
    zh: '纯 Java 类路径扫描',
  },
  step1Body: {
    vi: ' khám phá toàn bộ interface gắn @AutoRestController kế thừa AutoApiController<E>.',
    en: ' discovers all interfaces annotated with @AutoRestController extending AutoApiController<E>.',
    ja: ' が @AutoRestController 付きの全インターフェースを検出します。',
    zh: ' 扫描所有标注 @AutoRestController 且继承 AutoApiController<E> 的接口。',
  },
  step2Title: {
    vi: 'Khởi Tạo JDK Proxy',
    en: 'JDK Proxy Instantiation',
    ja: 'JDK 動的プロキシ生成',
    zh: 'JDK 动态代理实例化',
  },
  step2BodyPrefix: {
    vi: 'Sử dụng API chuẩn JDK ',
    en: 'Uses standard ',
    ja: '標準 ',
    zh: '直接调用标准库 ',
  },
  step2BodySuffix: {
    vi: ' ủy quyền vào ControllerProxyInvocationHandler (đổi lại: Controller bắt buộc phải là interface).',
    en: ' backed by ControllerProxyInvocationHandler (trade-off: controller declarations must be Java interfaces rather than concrete classes).',
    ja: ' と ControllerProxyInvocationHandler でプロキシを生成します（制約：コントローラーはJavaインターフェースである必要があります）。',
    zh: ' 并委派至 ControllerProxyInvocationHandler（架构取舍：控制器必须声明为 Java 接口而非具体类）。',
  },
  step3Title: {
    vi: 'Ánh Xạ Tuyến Đường Phản Xạ',
    en: 'Reflective Route Binding',
    ja: 'リフレクションルート登録',
    zh: '反射路由映射绑定',
  },
  step3BodyPrefix: {
    vi: ' gắn các hợp đồng REST đã lọc qua EndpointFeatureFilterHelper vào ',
    en: ' binds filtered REST contracts (evaluated via EndpointFeatureFilterHelper) into the host ',
    ja: ' は EndpointFeatureFilterHelper で選別された全ルートをホストの ',
    zh: ' 将经由 EndpointFeatureFilterHelper 筛选后的契约直接注册到宿主的 ',
  },
  colChar: { vi: 'Tiêu Chí', en: 'Characteristic', ja: '評価軸', zh: '对比维度' },
  colJdk: { vi: 'Spring-NWVMC (JDK Dynamic Proxy)', en: 'Spring-NWVMC (JDK Dynamic Proxy)', ja: 'Spring-NWVMC (JDK 動的プロキシ)', zh: 'Spring-NWVMC (JDK 原生动态代理)' },
  colCglib: { vi: 'Subclass Bytecode (CGLIB / Byte Buddy)', en: 'Subclass Bytecode (CGLIB / Byte Buddy)', ja: 'バイトコード生成 (CGLIB / Byte Buddy)', zh: '字节码生成 (CGLIB / Byte Buddy)' },
  rBoot: { vi: 'Tác Động Khởi Động', en: 'Bootstrap Overhead', ja: '起動オーバーヘッド', zh: '启动开销' },
  rSpring: { vi: 'Phụ Thuộc Phiên Bản Spring', en: 'Spring Version Coupling', ja: 'Spring バージョン結合度', zh: 'Spring 版本耦合度' },
  rMem: { vi: 'Bộ Nhớ Metaspace', en: 'Metaspace Footprint', ja: 'Metaspace 消費', zh: 'Metaspace 内存开销' },
  rTarget: { vi: 'Phạm Vi Áp Dụng', en: 'Target Constraint', ja: '対象制約', zh: '适用前提约束' },
  vTargetJdk: {
    vi: 'Interface only (phù hợp chuẩn AutoApiController<E>)',
    en: 'Java interfaces only (matches AutoApiController<E> contract)',
    ja: 'インターフェース専用（AutoApiController<E> と整合）',
    zh: '仅支持接口代理（契合 AutoApiController<E> 声明规范）',
  },
  vTargetCglib: {
    vi: 'Hỗ trợ class thường nhưng không proxy được class final',
    en: 'Supports concrete non-final classes via subclassing',
    ja: '非 final 具象クラスの継承プロキシに対応',
    zh: '支持非 final 具体类的子类代理',
  },
};

export const DynamicProxyPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-blue">JDK InvocationHandler</span>
        <span className="badge badge-emerald">Zero Bytecode Weaving</span>
        <span className="badge badge-purple">SpringMvcEndpointBridge</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'Dynamic Java Proxy Dispatcher'}
        {currentLang === 'vi' && 'Bộ Điều Phối Dynamic Java Proxy (ControllerProxyInvocationHandler)'}
        {currentLang === 'ja' && '動的Javaプロキシディスパッチャ（ControllerProxyInvocationHandler）'}
        {currentLang === 'zh' && 'Java 动态代理分发引擎（ControllerProxyInvocationHandler）'}
      </h1>

      <p className="page-lead">
        {currentLang === 'en' && 'Spring-NWVMC synthesizes REST endpoints at boot time using JDK Dynamic Proxies (java.lang.reflect.Proxy) and reflection bridges without generating physical Java files or rewriting bytecode.'}
        {currentLang === 'vi' && 'Spring-NWVMC tổng hợp các endpoint REST tại thời điểm khởi động bằng JDK Dynamic Proxy (java.lang.reflect.Proxy) và cầu nối phản xạ Pure Java mà không sinh tệp .java vật lý hay biến đổi bytecode.'}
        {currentLang === 'ja' && 'Spring-NWVMC は物理ソースコード生成やバイトコード改変を行わず、JDK動的プロキシと Pure Java リフレクションブリッジで起動時にRESTルートを登録します。'}
        {currentLang === 'zh' && 'Spring-NWVMC 在启动阶段通过 JDK 原生动态代理与纯 Java 反射桥接直接注册 REST 路由，零物理源码生成与零字节码织入开销。'}
      </p>

      <h2 id="how-it-works" className="section-heading">
        {currentLang === 'en' && '1. Runtime Route Synthesis Pipeline'}
        {currentLang === 'vi' && '1. Quy Trình Tổng Hợp Tuyến Đường Runtime'}
        {currentLang === 'ja' && '1. 実行時ルート合成パイプライン'}
        {currentLang === 'zh' && '1. 运行时路由动态合成管线'}
      </h2>

      <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem', lineHeight: 1.75 }}>
        <li style={{ marginBottom: '0.5rem' }}>
          <strong>{LABELS.step1Title[currentLang]}</strong>: <code>PureJavaClasspathScannerUtil</code>
          {LABELS.step1Body[currentLang]}
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <strong>{LABELS.step2Title[currentLang]}</strong>: {LABELS.step2BodyPrefix[currentLang]}
          <code>java.lang.reflect.Proxy.newProxyInstance()</code>
          {LABELS.step2BodySuffix[currentLang]}
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <strong>{LABELS.step3Title[currentLang]}</strong>: <code>SpringMvcEndpointBridge</code>
          {LABELS.step3BodyPrefix[currentLang]}
          <code>RequestMappingHandlerMapping</code> (<code>BridgeConstant</code>).
        </li>
      </ol>

      <h2 id="reflection-vs-cglib" className="section-heading">
        {currentLang === 'en' && '2. Trade-Off Analysis: JDK Dynamic Proxy vs CGLIB / Byte Buddy'}
        {currentLang === 'vi' && '2. Đánh Đổi Kiến Trúc: JDK Dynamic Proxy Với CGLIB / Byte Buddy'}
        {currentLang === 'ja' && '2. アーキテクチャ設計比較：JDK 動的プロキシ vs CGLIB / Byte Buddy'}
        {currentLang === 'zh' && '2. 架构取舍对比：JDK 原生动态代理 vs CGLIB / Byte Buddy'}
      </h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>{LABELS.colChar[currentLang]}</th>
            <th>{LABELS.colJdk[currentLang]}</th>
            <th>{LABELS.colCglib[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>{LABELS.rBoot[currentLang]}</strong></td>
            <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>&lt; 50 ms (No ASM class generation)</td>
            <td style={{ color: 'var(--accent-rose)' }}>Synthetic class generation at startup</td>
          </tr>
          <tr>
            <td><strong>{LABELS.rSpring[currentLang]}</strong></td>
            <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>0% (Pure JDK + BridgeConstant)</td>
            <td style={{ color: 'var(--accent-rose)' }}>Coupled to bundled ASM / Spring proxy classes</td>
          </tr>
          <tr>
            <td><strong>{LABELS.rMem[currentLang]}</strong></td>
            <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Single JDK $Proxy per interface</td>
            <td style={{ color: 'var(--accent-rose)' }}>Additional generated subclass bytecode in Metaspace</td>
          </tr>
          <tr>
            <td><strong>{LABELS.rTarget[currentLang]}</strong></td>
            <td>{LABELS.vTargetJdk[currentLang]}</td>
            <td>{LABELS.vTargetCglib[currentLang]}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="route-registration" className="section-heading">
        {currentLang === 'en' && '3. Pure Java Route Registration Implementation'}
        {currentLang === 'vi' && '3. Hiện Thực Đăng Ký Tuyến Đường (SpringMvcEndpointBridge.java)'}
        {currentLang === 'ja' && '3. Pure Java ルート登録ブリッジの実装'}
        {currentLang === 'zh' && '3. 纯 Java 路由注册桥接核心实现'}
      </h2>
      <CodeBlock
        language="java"
        fileName="io/github/natswarchuan/core/bridge/SpringMvcEndpointBridge.java"
        code={`package io.github.natswarchuan.core.bridge;

import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.core.annotation.AutoRestController;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Objects;

public final class SpringMvcEndpointBridge {

  private SpringMvcEndpointBridge() {
    throw new UnsupportedOperationException(CommonConstant.MSG_UTILITY_CLASS);
  }

  public static void registerConcreteControllerEndpoints(
      final Object handlerMapping, final Object controllerBean) {
    if (Objects.isNull(handlerMapping)) {
      return;
    }
    if (Objects.isNull(controllerBean)) {
      return;
    }
    final Class<?> beanClass = controllerBean.getClass();
    final String basePath = resolveConcreteControllerBasePath(beanClass);
    for (final Method method : beanClass.getDeclaredMethods()) {
      final List<String> httpMethods = resolveAllHttpMethods(method);
      if (!httpMethods.isEmpty()) {
        registerEndpoint(handlerMapping, controllerBean, basePath, method);
      }
    }
  }
}`}
      />

      <Callout
        type="info"
        title={
          currentLang === 'vi'
            ? 'Không Import Spring Trong Lõi Framework'
            : currentLang === 'ja'
            ? 'コア層での Spring インポートゼロ'
            : currentLang === 'zh'
            ? '核心层零 Spring 源码导入'
            : 'Zero Compile-Time Spring Imports'
        }
      >
        {currentLang === 'vi' && 'Mọi thao tác dựng RequestMappingInfo và đăng ký vào RequestMappingHandlerMapping đều đi qua BridgeConstant và ReflectionMetadataCacheUtil.'}
        {currentLang === 'en' && 'All RequestMappingInfo construction and handler binding executes reflectively via BridgeConstant and ReflectionMetadataCacheUtil.'}
        {currentLang === 'ja' && 'RequestMappingInfo の構築と登録はすべて BridgeConstant と ReflectionMetadataCacheUtil を介してリフレクション実行されます。'}
        {currentLang === 'zh' && '所有 RequestMappingInfo 构建与路由注册均通过 BridgeConstant 与 ReflectionMetadataCacheUtil 动态反射执行。'}
      </Callout>
    </div>
  );
};
