import React from "react";
import "./ImageShadowCard.css";

function ImageShadowCard({ name, date, title, image, onClick }) {
  return (
    <div className="image-shadow-card" onClick={onClick}>
      <div className="card-content">
        <div className="top">
          <h3 className="name">{name}</h3>

          <div className="date">
            <span>{date}</span>
          </div>
        </div>

        <div className="bottom">
          <h2>{title}</h2>

          <div className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="bookmark-icn"
            >
              <path d="M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card-bg">
        {/* 
          ADD IMAGE URL HERE

          Example:
          <img 
             src="/images/my-image.jpg"
             alt={title}
             className="bg-img"
          />

          This image is used as the card background.
        */}

        <img src={image} alt={title} className="bg-img" />
      </div>

      <div className="shadow">
        {/* 
          ADD IMAGE URL HERE IF YOU WANT A DIFFERENT SHADOW IMAGE

          Usually the same image can be reused:
          src={image}

          For a custom shadow:
          src="/images/shadow-image.jpg"
        */}

        <img src={image} alt={`${title} shadow`} className="shadow-img" />
      </div>
    </div>
  );
}

export default ImageShadowCard;
