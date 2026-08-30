import React from 'react';

interface FileItem {
  uid: string;
  name: string;
  size: string;
  status: string;
}

interface UploadProps extends React.HTMLAttributes<HTMLDivElement> {
  action: string;
  defaultFileList?: FileItem[];
  listType?: 'list' | 'picture' | 'none';
  prompt?: React.ReactNode;
  showPicInfo?: boolean;
}

export default function Upload({
  children,
  className,
  defaultFileList = [],
  listType = 'list',
  prompt,
  showPicInfo: _showPicInfo,
  ...props
}: UploadProps): React.ReactElement {
  void _showPicInfo;
  return (
    <div
      className={`semi-upload${listType === 'picture' ? ' semi-upload-picture' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      <div className={listType === 'picture' ? 'semi-upload-picture-add' : 'semi-upload-add'}>
        {children}
      </div>
      {prompt ? <div className="semi-upload-prompt">{prompt}</div> : null}
      {listType !== 'none' ? (
        <div className="semi-upload-file-list">
          <div className="semi-upload-file-list-main">
            {defaultFileList.map((file) => (
              <div
                className={
                  listType === 'picture' ? 'semi-upload-picture-file-card' : 'semi-upload-file-card'
                }
                key={file.uid}
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
