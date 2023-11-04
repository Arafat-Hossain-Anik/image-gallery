import { useState } from 'react';
import './App.css';
import {
  DndContext, closestCenter, MouseSensor, TouchSensor, DragOverlay, useSensor, useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faImage } from '@fortawesome/free-solid-svg-icons'
import images from './images.json';
import { SortablePhoto } from './SortablePhoto';
import { Photo } from './Photo';




function App() {
  const [imagesList, setImagesList] = useState(images);
  const [activeId, setActiveId] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Enable sort function when dragging 10px   💡 here!!!
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 5,
      pointerMovementTolerance: 5,
      // distance: 2,
      tolerance: 1,
    },
  })
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleImageClick = (url) => {
    console.log(url);
    if (selectedImages.includes(url)) {
      const updatedSelection = selectedImages.filter((selected) => selected !== url);
      setSelectedImages(updatedSelection);
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleDeleteSelected = () => {
    const imagesToKeep = imagesList.filter((url) => !selectedImages.includes(url));
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
    <div className="container">
      <div style={{ textAlign: "center", fontFamily: "'Source Code Pro', monospace" }}>
        <h1>Welcome To Image Gallery</h1>
      </div>
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={imagesList} strategy={rectSortingStrategy}>
          <div className='all-image-container'>
            {
              imagesList.map((url, index) => (
                <SortablePhoto key={url} url={url} index={index} selectedImages={selectedImages} onClick={() => handleImageClick(url)} />
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
        </SortableContext>

        <DragOverlay adjustScale={true}>
          {activeId ? (
            <Photo url={activeId} activeId={activeId} selectedImages={selectedImages} index={imagesList.indexOf(activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );



  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImagesList((image) => {
        const oldIndex = image.indexOf(active.id);
        const newIndex = image.indexOf(over.id);

        return arrayMove(image, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }


}

export default App;
