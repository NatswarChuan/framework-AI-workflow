import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE4_CONTENT } from '../data/pages/stage4Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const FileStoragePage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="file-storage"
        currentLang={currentLang}
        guardrailTip={{
          type: 'tip',
          content: <RichDocText text={STAGE4_CONTENT.fsCalloutTip} currentLang={currentLang} />,
        }}
      />

      <h2 id="storage-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE4_CONTENT.fsGoalBody} currentLang={currentLang} />
      </p>

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
            highlightLines: [4, 5, 8, 9, 10],
            code: `app:
  framework:
    storage:
      enabled: true
      provider: LOCAL # LOCAL | S3 | GCS
      max-file-size: 52428800
      local:
        base-dir: target/uploads
        create-dir-if-missing: true
        url-prefix: /api/v1/storage/download/`,
          },
          {
            id: 'storage-s3',
            label: pickText(STAGE4_CONTENT.fsTabS3, currentLang),
            language: 'yaml',
            fileName: 'application-prod.yml',
            code: `app:
  framework:
    storage:
      provider: S3
      s3:
        bucket-name: prod-assets
        region: ap-southeast-1
        path-style-access: true
        presigned-url-ttl-seconds: 900`,
          },
          {
            id: 'storage-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '08-file-storage-roundtrip.sh',
            code: `# 1. Upload an electronic invoice attachment (returns HTTP 201 Created with UUIDv7 fileId)
echo "Electronic Invoice Payload Verified" > invoice-doc-001.txt
FILE_ID=$(curl -s -X POST "http://localhost:8080/api/v1/storage/upload" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -F "file=@invoice-doc-001.txt;type=text/plain" | jq -r '.data.fileId')

# 2. Download the stored binary file
curl -s "http://localhost:8080/api/v1/storage/download/$FILE_ID" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Inspect metadata & delete when no longer needed
curl -s "http://localhost:8080/api/v1/storage/metadata/$FILE_ID" -H "Authorization: Bearer $ADMIN_TOKEN" | jq
curl -s -X DELETE "http://localhost:8080/api/v1/storage/$FILE_ID" -H "Authorization: Bearer $ADMIN_TOKEN" | jq`,
          },
        ]}
      />

      <h2 id="storage-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE4_CONTENT.fsThRoute, currentLang)}</th>
              <th>{pickText(STAGE4_CONTENT.fsThContract, currentLang)}</th>
              <th>{pickText(STAGE4_CONTENT.fsThBehavior, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>POST /api/v1/storage/upload</code></td>
              <td><code>uploadFile</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowUpload} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/download/{'{fileId}'}</code></td>
              <td><code>downloadFile</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowDownload} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/metadata/{'{fileId}'}</code></td>
              <td><code>getFileMetadata</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowMeta} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>DELETE /api/v1/storage/{'{fileId}'}</code></td>
              <td><code>deleteFile</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowDelete} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>POST /api/v1/storage/presigned-url</code></td>
              <td><code>generatePresignedUrl</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowPresigned} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/storage/exists/{'{fileId}'}</code></td>
              <td><code>fileExists</code></td>
              <td><RichDocText text={STAGE4_CONTENT.fsRowExists} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};
