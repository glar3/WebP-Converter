import React, { useState, useRef, useEffect } from "react";
import "./ImageConverter.scss";

export const ImageConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filetype, setFiletype] = useState("png");
  const [imageSrc, setImageSrc] = useState("");
  const [dropdownHeader, setDropdownHeader] = useState("Choose filetype");
  const fileInputRef = useRef(null);
  const downloadLinkRef = useRef(null);

  useEffect(() => {
    setDropdownHeader(`${filetype} selected`);

    return () => {
      setDropdownHeader(`${filetype} selected`);
    };
  }, [filetype]);

  const getImage = () => {
    const file = fileInputRef.current.files[0];

    if (file) {
      setIsConverting(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const pngData = canvas.toDataURL(`image/${filetype}`);
          setImageSrc(pngData);
          setIsConverting(false);
        };

        img.onerror = () => {
          alert("Failed to load the image. Please try again.");
          setIsConverting(false);
        };
      };

      reader.onerror = () => {
        alert("Failed to read the file. Please try again.");
        setIsConverting(false);
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please select a WebP file!");
    }
  };

  const downloadImage = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.download = `converted_image.${filetype}`;
      downloadLinkRef.current.click();
    }
  };

  return (
    <div className="container">
      <h1>WebP Converter</h1>

      <input
        type="file"
        ref={fileInputRef}
        accept=".webp"
        disabled={isConverting}
      />
      <div className="convertContainer">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setVisible(!visible)}
          >
            {dropdownHeader}
          </button>
          <ul className={`dropdown-menu ${!visible ? "visible" : ""}`}>
            <button
              className="dropdown-list"
              onClick={() => {
                setFiletype("png");
                setVisible(!visible);
              }}
            >
              png
            </button>
            <button
              className="dropdown-list"
              onClick={() => {
                setFiletype("jpg");
                setVisible(!visible);
              }}
            >
              jpg
            </button>
          </ul>
        </div>
        <button
          className="convertToPNG"
          onClick={getImage}
          disabled={isConverting}
        >
          Convert
        </button>
      </div>
      <div className="output">
        {imageSrc && (
          <>
            <img className="imageSource" src={imageSrc} alt="Converted Image" />
            <button className="download" onClick={downloadImage}>
              Download
              <a ref={downloadLinkRef} href={imageSrc}></a>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
