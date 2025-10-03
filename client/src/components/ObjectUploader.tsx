import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";

const loadUppyStyles = () => {
  const existing = document.getElementById('uppy-styles');
  if (!existing) {
    const link = document.createElement('link');
    link.id = 'uppy-styles';
    link.rel = 'stylesheet';
    link.href = 'https://releases.transloadit.com/uppy/v3.3.1/uppy.min.css';
    document.head.appendChild(link);
  }
};

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  children: ReactNode;
  disabled?: boolean;
}

export function ObjectUploader({
  maxNumberOfFiles = 30,
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  buttonVariant = "default",
  children,
  disabled = false,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUppyStyles();
  }, []);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
        limit: 1,
      })
      .on("complete", (result) => {
        setShowModal(false);
        onComplete?.(result);
      })
  );

  return (
    <div>
      <Button 
        type="button"
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
        variant={buttonVariant}
        disabled={disabled}
        data-testid="button-upload-photos"
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        locale={{
          strings: {
            dropPasteFiles: 'Перетащите фотографии сюда или %{browseFiles}',
            browseFiles: 'выберите файлы',
            uploadXFiles: {
              0: 'Загрузить %{smart_count} файл',
              1: 'Загрузить %{smart_count} файла',
            },
            xFilesSelected: {
              0: '%{smart_count} файл выбран',
              1: '%{smart_count} файла выбрано',
            },
          },
        }}
      />
    </div>
  );
}
