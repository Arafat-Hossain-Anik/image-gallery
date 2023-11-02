import './App.css';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquare, faImage } from '@fortawesome/free-solid-svg-icons'

const images = [
  'images/image-1.webp',
  'images/image-2.webp',
  'images/image-3.webp',
  'images/image-4.webp',
  'images/image-5.webp',
  'images/image-6.webp',
  'images/image-7.webp',
  'images/image-8.webp',
  'images/image-9.webp',
  'images/image-10.jpeg',
  'images/image-11.jpeg'
]
function App() {
  const [imagesList, setImagesList] = useState(images)
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const dragImage = useRef(null)
  const dragOverImage = useRef(null)
  const handleSort = () => {
    if (dragImage.current === null || dragOverImage.current === null || dragImage.current === dragOverImage.current) {
      return;
    }
    let _imagesList = [...imagesList];

    console.log(dragImage.current, dragOverImage.current);
    const draggedContent = _imagesList[dragImage.current];
    const draggedOverContent = _imagesList[dragOverImage.current];

    // Swap the content
    _imagesList[dragImage.current] = draggedOverContent;
    _imagesList[dragOverImage.current] = draggedContent;

    console.log(draggedContent);
    console.log(draggedOverContent);
    // _imagesList = [...imagesList, draggedOverContent]
    console.log(_imagesList);
    dragImage.current = dragOverImage.current;
    // dragOverImage.current = null;
    setImagesList(_imagesList);
  };




  const handleImageClick = (index) => {
    if (selectedImages.includes(index)) {
      const updatedSelection = selectedImages.filter((selected) => selected !== index);
      setSelectedImages(updatedSelection);
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleDeleteSelected = () => {
    const imagesToKeep = imagesList.filter((_, index) => !selectedImages.includes(index));
    setImagesList(imagesToKeep);
    setSelectedImages([]);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagesList([...imagesList, e.target.result])
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className='container'>
      <div className='header-container'>
        {
          selectedImages.length > 0 ?
            <div className='header'>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} style={{ color: "rgb(195, 0, 88)", paddingRight: "5px" }} />
                <span>{selectedImages.length === 1 ? `${selectedImages.length} File Selected` : `${selectedImages.length} Files Selected`}</span>
              </div>
              <button className='delete-btn' onClick={handleDeleteSelected}>Delete files</button>
            </div>
            : <div className="header">
              <span>Gallery</span>
            </div>
        }
      </div>
      <hr style={{ border: "2px solid white", borderRadius: '1px', margin: "10px 0" }} />
      <div className="App">
        {
          imagesList.map((image, index) => (
            <div key={index} draggable
              onDragStart={(e) => {
                dragImage.current = index;
                setIsDragging(true)
              }}
              onDragEnter={(e) => {
                dragOverImage.current = index
                handleSort();
              }}
              onDragEnd={() => {
                setIsDragging(false);
              }}
              onClick={() => handleImageClick(index)}
              className={`image-container ${index === 0 ? 'first-image-div' : 'other-image-div'} ${selectedImages.includes(index) ? 'selected' : ''
                } ${isDragging ? 'image-dragging' : ''}`}
            >
              <img className="image" src={image} alt={`${index}`} />
              <div className='overlay'></div>
              <FontAwesomeIcon className='white-blank-box' icon={faSquare} />
              <FontAwesomeIcon className='select-icon' icon={faSquareCheck} />
            </div>
          ))
        }
        <div className='last-element'>
          <input type="file" accept="image/*" id='file' onChange={handleImageChange} />
          <label className='file-label' htmlFor="file">
            <FontAwesomeIcon icon={faImage} />
            Add Images
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
