import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { create } from 'ipfs-http-client';
import './Dropzone.css';
const ipfs = create({ host: '127.0.0.1', port: 5000, protocol: 'http' });
function MyDropzone(props) {
    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const file = acceptedFiles[0];
            const added = await ipfs.add({
                path: file.path,
                content: file,
            });
            //get loadImage(name ,image ,ipfsCID , index)

            const url = URL.createObjectURL(file);

            props.loadImage(file.path, url, added.cid.toString(), file.type, props.index);
            console.log('File added to IPFS with hash', added.cid.toString());
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    return (
        <div className='dropZone' {...getRootProps()}>
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