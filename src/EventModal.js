// EventModal.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

function EventModal({ isOpen, onClose, onAddEvent, onDeleteEvent, selectedDate, editingEvent }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [weather, setWeather] = useState('');
  const [author, setAuthor] = useState('');
  const [worker, setWorker] = useState('');
  const [crop, setCrop] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setTitle(editingEvent.title || '');
        setContent(editingEvent.description || '');
        setDate(editingEvent.date || selectedDate);
        setWeather(editingEvent.weather || '');
        setAuthor(editingEvent.author || '');
        setWorker(editingEvent.worker || '');
        setCrop(editingEvent.crop || '');
        setImages(editingEvent.images || []);
      } else {
        setTitle('');
        setContent('');
        setDate(selectedDate);
        setWeather('');
        setAuthor('');
        setWorker('');
        setCrop('');
        setImages([]);
      }
    }
  }, [isOpen, editingEvent, selectedDate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setImages(prev => [...prev, ...results]);
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    onAddEvent({
      id: editingEvent?.id || Date.now().toString(),
      title,
      date,
      description: content,
      weather,
      author,
      worker,
      crop,
      images,
    });

    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && window.confirm("정말 삭제하시겠습니까?")) {
      onDeleteEvent(editingEvent.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="side-modal">
        <div className="modal-header">
          <h3>영농일지</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="row">
            <label>제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="row flex">
            <div>
              <label>날짜</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label>날씨</label>
              <input type="text" value={weather} onChange={(e) => setWeather(e.target.value)} />
            </div>
          </div>

          <div className="row flex">
            <div>
              <label>작성자</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
              <label>작업자</label>
              <input type="text" value={worker} onChange={(e) => setWorker(e.target.value)} />
            </div>
            <div>
              <label>작물</label>
              <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} />
            </div>
          </div>

          <div className="section-label">사진</div>
          <div className="image-box">
            <label className="upload-label">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              <div className="upload-text">
                <div className="plus-icon">＋</div>
                첨부파일
              </div>
            </label>

            <div className="image-preview">
              {images.map((img, i) => (
                <div className="image-item" key={i}>
                  <img src={img} alt="" />
                  <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="section-label">내용</div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="modal-footer">
          {editingEvent && (
            <button className="delete-btn" onClick={handleDelete}>삭제</button>
          )}
          <button className="save-btn" onClick={handleSubmit}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
