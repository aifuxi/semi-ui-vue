import React from 'react';
import Button from '@semi-v2.102.0/button';
import Upload from '@semi-v2.102.0/upload';

const files = [
  { uid: 'guide', name: 'product-guide.pdf', size: '1.2MB', status: 'success' },
  { uid: 'cover', name: 'cover.png', size: '248.0KB', status: 'uploadFail' },
];

const pictureFiles = [
  {
    uid: 'preview',
    name: 'preview.svg',
    size: '1.0KB',
    status: 'success',
    preview: true,
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23608ff0"/%3E%3Cpath d="M18 68l18-20 13 13 12-16 18 23z" fill="white"/%3E%3C/svg%3E',
  },
];

export function UploadScenario(): React.ReactElement {
  return (
    <div className="upload-scenario" data-testid="upload-reference">
      <Upload
        action="/upload"
        data-parity-target="upload-list-root"
        defaultFileList={files}
        prompt="PDF or PNG, up to 5 MB"
      >
        <Button>选择文件</Button>
      </Upload>
      <Upload
        action="/upload"
        data-parity-target="upload-picture-root"
        listType="picture"
        defaultFileList={pictureFiles}
        showPicInfo
      >
        <span className="upload-scenario__plus">+</span>
      </Upload>
    </div>
  );
}
