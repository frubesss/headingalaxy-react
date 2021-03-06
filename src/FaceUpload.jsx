import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import config from '../config.json';

const CLOUDINARY_UPLOAD_PRESET = config.upload_preset;
const CLOUDINARY_UPLOAD_URL = config.upload_url;
const CLOUDINARY_CLOUD_NAME = config.cloud_name;

class FaceUpload extends React.Component {
    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });

        this.handleImageUpload(files[0]);
    }

    handleImageUpload(file) {
        const upload = request
            .post(CLOUDINARY_UPLOAD_URL)
            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== '') {
                this.props.handleFaceUpload(
                    response.body.secure_url,
                    response.body.public_id
                );
                this.setState({
                    uploadedFileCloudinaryUrl: response.body.secure_url,
                    uploadedFilePublicId: response.body.public_id,
                    faceUploaded: true
                });
            }
        });
    }

    render() {
        return (
            <div>
                {this.props.faceUploaded
                    ? <div>
                        <CloudinaryContext cloudName={CLOUDINARY_CLOUD_NAME}>
                            <Image publicId={this.props.uploadedFilePublicId}>
                                <Transformation
                                    gravity="face"
                                    crop="thumb"
                                    width="150"
                                    height="150"
                                    radius="max"
                                />
                            </Image>
                        </CloudinaryContext>
                    </div>
                    : <Dropzone
                        className={'cloudinary-dropzone'}
                        multiple={false}
                        accept="image/*"
                        onDrop={this.onImageDrop.bind(this)}
                    >
                        <p>Drop an image or click to select a file to upload.</p>
                    </Dropzone>}
                <div />
            </div>
        );
    }
}

export default FaceUpload;
