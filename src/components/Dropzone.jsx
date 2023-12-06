import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { create } from 'ipfs-http-client';

const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });
function MyDropzone() {
    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const file = acceptedFiles[0];
            const added = await ipfs.add({
                path: file.path,
                content: file,
            });
            console.log('File added to IPFS with hash', added.cid.toString());
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
}

export default MyDropzone;