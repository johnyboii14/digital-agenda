import { type RefCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import StyledDropbox from './StyledDropbox';

interface CSVDropboxProps {
  onDrop: RefCallback<File[]>;
}

function CSVDropbox({ onDrop }: CSVDropboxProps): JSX.Element {
  const { getRootProps, getInputProps, isDragAccept, isFocused, isDragReject } =
    useDropzone({
      onDrop,
      noKeyboard: true,
    });
  return (
    <section className="dropbox-container">
      <StyledDropbox
        className="dropbox"
        {...getRootProps({ isDragAccept, isFocused, isDragReject })}
      >
        <input {...getInputProps()} />
        <p>Drag n drop some CSV files </p>
      </StyledDropbox>
    </section>
  );
}

export default CSVDropbox;
