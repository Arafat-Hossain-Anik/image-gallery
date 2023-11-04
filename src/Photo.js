import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquare } from '@fortawesome/free-solid-svg-icons'

export const Photo = forwardRef(({ url, index, faded, style, selectedImages, activeId, ...props }, ref) => {
  const inlineStyles = {
    opacity: faded ? '0.2' : '1',
    transformOrigin: '0 0',
    height: index === 0 ? 310 : 150,
    width: index === 0 ? 310 : 150,
    gridRowStart: index === 0 ? 'span 2' : null,
    gridColumnStart: index === 0 ? 'span 2' : null,
    backgroundImage: `url("${url}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'white',
    borderRadius: "8px",
    ...style,
  };
  return (
    <div className={`image-container ${index === 0 ? 'first-image-div' : 'other-image-div'} ${selectedImages.includes(url) ? 'selected' : ''
      }`} ref={ref} style={inlineStyles} {...props}>
      {
        activeId ? "" : <div> <div className='overlay'></div>
          <FontAwesomeIcon className='white-blank-box' icon={faSquare} />
          <FontAwesomeIcon className='select-icon' icon={faSquareCheck} />
        </div>
      }
    </div >
  );
});
