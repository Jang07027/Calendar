// Calendar.jsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './EventModal.jsx';
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: '토마토',
      date: '2025-12-10',
      description: '토마토 내용',
      author: '홍길동',
      worker: '김철수',
      crop: '토마토',
      weather: '맑음',
      images: [],
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: '상추',
      date: '2025-12-10',
      description: '상추 내용',
      author: '이영희',
      worker: '박영수',
      crop: '상추',
      weather: '흐림',
      images: [],
      createdAt: Date.now() + 1,
    },
    {
      id: '3',
      title: '김자',
      date: '2025-12-10',
      description: '상추 내용',
      author: '이영숙',
      worker: '김관수',
      crop: '감자',
      weather: '비',
      images: [],
      createdAt: Date.now() + 1,
    },
    {
      id: '2',
      title: '상추',
      date: '2025-12-15',
      description: '상추 내용',
      author: '이영희',
      worker: '박영수',
      crop: '상추',
      weather: '흐림',
      images: [],
      createdAt: Date.now() + 2,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // 날짜 클릭 → 새 이벤트 작성
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  // 이벤트 클릭 → 수정
  const handleEventClick = (info) => {
    const data = info.event.extendedProps;

    setEditingEvent({
      id: info.event.id,
      title: info.event.title,
      date: info.event.startStr,
      description: data.description,
      author: data.author,
      worker: data.worker,
      crop: data.crop,
      weather: data.weather,
      images: data.images || [],
      createdAt: data.createdAt, // 기존 순서 유지
    });

    setSelectedDate(info.event.startStr);
    setIsModalOpen(true);
  };

  // 저장 (신규 + 수정)
  const handleSaveEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      createdAt: editingEvent?.createdAt || Date.now(), // 저장순 고정
    };

    setEvents((prev) => {
      const exists = prev.find((evt) => evt.id === newEvent.id);
      let updated;

      if (exists) {
        updated = prev.map((evt) =>
          evt.id === newEvent.id ? { ...evt, ...newEvent } : evt
        );
      } else {
        updated = [...prev, newEvent];
      }

      // 날짜 + 저장순 정렬
      return updated.sort((a, b) => {
        if (a.date === b.date) {
          return a.createdAt - b.createdAt;
        }
        return new Date(a.date) - new Date(b.date);
      });
    });

    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // 모달 닫기 공통 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // FullCalendar 이벤트 UI
  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-custom-event">
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      {/* 모달 열려 있으면: 화면 전체를 덮는 투명 오버레이 */}
      {isModalOpen && (
        <div
          className="modal-overlay-clicker"
          onClick={handleCloseModal} // 모달 제외 아무데나 클릭 → 모달 닫힘
        />
      )}

      <div className="calendar-layout">
        {/* 왼쪽: 캘린더 (항상 고정) */}
        <div className="calendar-container">
          <FullCalendar
            locale="ko"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="100%"            // 레이아웃 높이에 맞춤
            aspectRatio={1}
            fixedWeekCount={false}
            headerToolbar={{
              start: 'prev next',
              center: 'title',
              end: 'today',
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            dayCellContent={(info) => <span>{info.date.getDate()}</span>}
            dayMaxEvents={1}
            moreLinkContent={(args) => `+${args.num}`}
            eventOrder="createdAt"
          />
        </div>

        {/* 오른쪽: 모달 패널 */}
        {isModalOpen && (
          <div className="calendar-side">
            <EventModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onAddEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              selectedDate={selectedDate}
              editingEvent={editingEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
