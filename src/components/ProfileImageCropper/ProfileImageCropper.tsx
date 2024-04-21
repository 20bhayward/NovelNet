import React, { useState, useRef } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Box } from '@chakra-ui/react';
import Cropper from 'react-easy-crop';

interface ProfilePictureCropperProps {
  image: string;
  onCrop: (croppedImage: Blob) => void;
  onCancel: () => void;
}

const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({ image, onCrop, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const modalRef = useRef(null);
  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImage(image, croppedAreaPixels);
      onCrop(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const getCroppedImage = async (imageSrc: string, crop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/jpeg');
    });
  };

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  return (
    <Modal isOpen={true} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box position="relative" width="100%" height="400px">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onCancel} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleCrop}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePictureCropper;