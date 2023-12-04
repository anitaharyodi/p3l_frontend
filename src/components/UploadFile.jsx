import React, { useState } from 'react';

const UploadFile = ({ handleFileSelection }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (isValidFileType(file)) {
      setSelectedFile(file);
    } else {
      alert("Invalid file type. Please select a JPEG or PNG file.");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (isValidFileType(file)) {
      setSelectedFile(file);
      handleFileSelection(file);
    } else {
      alert("Invalid file type. Please select a JPEG or PNG file.");
    }
  };

  const isValidFileType = (file) => {
    return file && (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png");
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div
      className="border-dashed border-2 border-gray-300 p-4 text-center h-[200px] flex flex-col justify-center items-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
    >
      {selectedFile ? (
        <div>
          <p className="font-semibold">{selectedFile.name}</p>
          <p>File size: {selectedFile.size} bytes</p>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            Remove File
          </button>
        </div>
      ) : (
        <div>
          <p>Drag and drop your file here, or</p>
          <label className="cursor-pointer text-blue-500">
            <span className="underline">Browse File</span>
            <input
              type="file"
              className="hidden"
              accept=".jpeg, .jpg, .png"
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
