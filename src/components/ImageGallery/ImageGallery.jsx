import { useState } from 'react';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem.jsx';
import { ImaGalleryUl } from './ImageGallery.styled.js';
import { Modal } from '../Modal/Modal.jsx';

export const ImageGallery = ({ images }) => {
  
  const [isModal, setIsShowModal] = useState(false);
  const [ImageData, setImageData] = useState({});
  //знаходжу картинку по кліку по айді
  const getImgById = id => {
    setIsShowModal(true);
    setImageData(images.find(el => el.id === id));
  };

  //   //закриття модалки
  function modalIsClose() {
    setIsShowModal(false);
  }

  return (
    <ImaGalleryUl>
      {images.map(img => {
        return (
          <ImageGalleryItem
            key={img.id}
            isModal={isModal}
            getImgById={getImgById}
            picture={img}
          />
        );
      })}
      <Modal
        modalIsOpen={isModal}
        img={ImageData}
        closeModal={modalIsClose}
      ></Modal>
    </ImaGalleryUl>
  );
};
export default ImageGallery

