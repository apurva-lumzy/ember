import React from "react";

function ImageShadowCard({ title, image, onClick }) {
  return (
    <div className="image-shadow-card" onClick={onClick}>
      <div className="card-content">
        <div className="bottom">
          <h3>{title}</h3>
        </div>
      </div>

      <div className="card-bg">
        <img src={image} alt={title} className="bg-img" />
      </div>

      <div className="shadow">
        <img src={image} alt={`${title} shadow`} className="shadow-img" />
      </div>
    </div>
  );
}

export default ImageShadowCard;
