// EventModal.jsx
import React, { useState, useEffect } from 'react';
import './Modal.css';

function EventModal({
  isOpen,          // 모달 열림 여부
  onClose,         // 닫기 콜백
  onAddEvent,      // 저장(추가/수정) 콜백
  onDeleteEvent,   // 삭제 콜백
  selectedDate,    // 캘린더에서 선택한 날짜
  editingEvent,    // 수정 중인 이벤트 데이터(없으면 새로 작성)
}) {
  // ====== 입력값 상태 관리 ======
  const [title, setTitle] = useState('');          // 제목
  const [content, setContent] = useState('');      // 내용
  const [date, setDate] = useState(selectedDate);  // 날짜
  const [weather, setWeather] = useState('');      // 날씨
  const [author, setAuthor] = useState('');        // 작성자
  const [worker, setWorker] = useState('');        // 작업자
  const [crop, setCrop] = useState('');            // 작물
  const [images, setImages] = useState([]);        // 사진(이미지 dataURL 배열)

  // ====== 모달이 열릴 때마다 값 초기화 or 편집 값 세팅 ======
  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        // 수정 모드일 때: 기존 이벤트 값 세팅
        setTitle(editingEvent.title || '');
        setContent(editingEvent.description || '');
        setDate(editingEvent.date || selectedDate);
        //setWeather(editingEvent.weather || '');
        setAuthor(editingEvent.author || '');
        setWorker(editingEvent.worker || '');
        setCrop(editingEvent.crop || '');
        setImages(editingEvent.images || []);
      } else {
        // 새로 작성 모드일 때: 전체 초기화
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

  // ====== 파일 업로드 시 이미지 읽어서 상태에 저장 ======
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);  // 선택한 파일들을 배열로 변환

    // FileReader로 각각의 파일을 dataURL 형태로 읽어오기
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // 읽기 완료 시 dataURL 반환
        reader.readAsDataURL(file);
      });
    });

    // 모든 파일 읽기가 끝나면 결과를 images 상태에 추가
    Promise.all(readers).then((results) => {
      setImages((prev) => [...prev, ...results]);
    });
  };

  // ====== 저장 버튼 클릭 시 ======
  const handleSubmit = () => {
    // 필수 항목 체크
    const requiredFields = [
      { value: title, label: '제목' },
      { value: date, label: '날짜' },
      { value: author, label: '작성자' },
      { value: worker, label: '작업자' },
      { value: crop, label: '작물' },
      { value: content, label: '내용' },
    ];

    for (const field of requiredFields) {
      if (!field.value || !field.value.toString().trim()) {
        alert(`${field.label}을(를) 입력해주세요!`);
        return;
      }
    }

    // 부모에게 넘겨줄 이벤트 데이터 객체
    onAddEvent({
      id: editingEvent?.id || Date.now().toString(), // 수정이면 기존 id, 아니면 새 id
      title,
      date,
      description: content,
      weather,
      author,
      worker,
      crop,
      images,
    });

    onClose(); // 저장 후 모달 닫기
  };

  // ====== 삭제 버튼 클릭 시 ======
  const handleDelete = () => {
    if (editingEvent && window.confirm('정말 삭제하시겠습니까?')) {
      onDeleteEvent(editingEvent.id);
    }
  };

  // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // ====== 오른쪽 패널 모양의 모달 렌더링 ======
  return (
    <div
      className="side-modal"
      onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 바깥 클릭 이벤트로 전달되지 않게 막기
    >
      {/* 상단 헤더 영역 */}
      <div className="modal-header">
        <h3>영농일지</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* 본문 영역 */}
      <div className="modal-body">
        {/* 제목 */}
        <div className="row">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요." // 예시 텍스트
          />
        </div>

        {/* 날짜 / 날씨 */}
        <div className="row flex">
          <div>
            <label>날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label>날씨</label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="날씨"
            />
          </div>
        </div>

        {/* 작성자 / 작업자 / 작물 */}
        <div className="row flex">
          <div>
            <label>작성자</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작성자"
            />
          </div>
          <div>
            <label>작업자</label>
            <input
              type="text"
              value={worker}
              onChange={(e) => setWorker(e.target.value)}
              placeholder="작업자"
            />
          </div>
          <div>
            <label>작물</label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="작물"
            />
          </div>
        </div>

        {/* 사진 영역 */}
        <div className="section-label">사진</div>
        <div className="image-box">
          {/* 1) 사진이 하나도 없을 때: 가운데 큰 + / 첨부파일 텍스트 */}
          {images.length === 0 && (
            <label className="upload-label">
              {/* 실제 파일 선택 input (숨김) */}
              <input
                type="file"
                accept="image/*"
                multiple      // 여러 장 업로드
                onChange={handleImageChange}
              />
              {/* 사용자가 보는 부분 (상자 정중앙) */}
              <div className="upload-center">
                <div className="plus-icon">＋</div>
                <div className="upload-text">첨부파일</div>
              </div>
            </label>
          )}

          {/* 2) 사진이 하나 이상 있을 때: 격자 + 각 이미지 X + 전체삭제 X + 동그라미 + */}
          {images.length > 0 && (
            <>
              {/* 여러 장을 격자(Grid) 형태로 나열 */}
              <div className="image-grid">
                {images.map((img, i) => (
                  <div className="image-item" key={i}>
                    {/* 썸네일 이미지 */}
                    <img src={img} alt={`업로드 이미지 ${i + 1}`} />
                    {/* 각 이미지 오른쪽 위의 X 버튼(해당 사진만 삭제) */}
                    <button
                      type="button"
                      className="image-delete"
                      onClick={(e) => {
                        e.stopPropagation(); // 상위 클릭 이벤트 전파 방지
                        setImages((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        );
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* 전체 삭제 X 버튼 */}
              <button
                type="button"
                className="image-all-delete circle-btn"
                onClick={() => setImages([])}
              >
                <span className="circle-icon circle-icon-x">✕</span>
              </button>

              {/* 추가 업로드 + 버튼 */}
              <label className="image-box-add">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="image-add-circle circle-btn">
                  <span className="circle-icon circle-icon-plus">＋</span>
                </div>
              </label>
            </>
          )}
        </div>

        {/* 내용 입력 */}
        <div className="section-label">내용</div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요."
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className="modal-footer">
        {editingEvent && (
          <button className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
        )}
        <button className="save-btn" onClick={handleSubmit}>
          {editingEvent ? '수정' : '저장'}
        </button>
      </div>
    </div>
  );
}

export default EventModal;
