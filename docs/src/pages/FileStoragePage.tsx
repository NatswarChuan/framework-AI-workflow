import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const FileStoragePage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="file-storage"
        currentLang={currentLang}
        badges={[
          { label: 'FileStorageController', tone: 'emerald' },
          { label: 'Local · AWS S3 · GCS', tone: 'blue' },
          { label: 'StorageCustomizer SPI', tone: 'purple' },
        ]}
      />

      <h2 id="storage-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>FileStorageController</code> (<code>/api/v1/storage</code>) extracts multipart payloads via cached <code>MultipartFileReflectionUtil</code> handles without importing Spring Web classes and delegates persistence to pluggable <code>FileStorageProvider</code> backends (Local Filesystem, AWS S3, or Google Cloud Storage).
      </p>

      <h2 id="storage-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Method &amp; Route</th>
              <th>Contract</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>POST /api/v1/storage/upload</code></td>
              <td><code>uploadFile</code></td>
              <td>Uploads binary multipart payload and returns <code>201 Created</code> with checksum</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/download/{'{fileId}'}</code></td>
              <td><code>downloadFile</code></td>
              <td>Streams stored file bytes with MIME type &amp; <code>Content-Disposition</code></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/metadata/{'{fileId}'}</code></td>
              <td><code>getFileMetadata</code></td>
              <td>Returns size, MIME type, checksum, and storage timestamps without body bytes</td>
            </tr>
            <tr>
              <td><code>DELETE /api/v1/storage/{'{fileId}'}</code></td>
              <td><code>deleteFile</code></td>
              <td>Removes binary artifact from active storage backend</td>
            </tr>
            <tr>
              <td><code>POST /api/v1/storage/presigned-url</code></td>
              <td><code>generatePresignedUrl</code></td>
              <td>Generates expiring direct GET/PUT URL via <code>PresignedUrlRequestDto</code></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/exists/{'{fileId}'}</code></td>
              <td><code>fileExists</code></td>
              <td>Returns boolean existence check for stored key</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="storage-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'storage-yml',
            label: 'application.yml',
            language: 'yaml',
            fileName: 'src/main/resources/application.yml',
            highlightLines: [4, 5, 9, 10],
            code: `app:
  framework:
    storage:
      enabled: true
      provider: local # local | s3 | gcs
      max-file-size: 10485760
      allowed-extensions: [png, jpg, pdf, csv]
      local:
        base-dir: ./uploads
        create-dir-if-missing: true`,
          },
          {
            id: 'storage-s3',
            label: 'AWS S3 / GCS YAML',
            language: 'yaml',
            fileName: 'application-prod.yml',
            code: `app:
  framework:
    storage:
      provider: s3
      s3:
        bucket-name: prod-assets
        region: ap-southeast-1
        path-style-access: true
        presigned-url-ttl-seconds: 900`,
          },
        ]}
      />

      <Callout type="tip" currentLang={currentLang}>
        Implement <code>StorageCustomizer</code> to register custom encryption-at-rest, antivirus scanning hooks, or private CDN URL rewriting via <code>StorageCustomizerRegistryHelper</code>.
      </Callout>
    </article>
  );
};
