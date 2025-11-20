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
      date: '2025-11-10',
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
      date: '2025-11-10',
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
      title: '상추',
      date: '2025-11-15',
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
      createdAt: data.createdAt, // 중요: 기존 순서 유지
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

      // 🔥 날짜 기준 + 저장순 기준 정렬
      return updated.sort((a, b) => {
        if (a.date === b.date) {
          return a.createdAt - b.createdAt; // 같은 날짜면 저장순
        }
        return new Date(a.date) - new Date(b.date);
      });
    });

    setIsModalOpen(false);
  };

  // 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
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
      <div className={`calendar-layout ${isModalOpen ? 'is-open' : ''}`}>

        {/* 🔥 모달 외부 클릭 → 닫기 */}
        {isModalOpen && (
          <div
            className="modal-overlay-clicker"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        {/* 왼쪽: 캘린더 */}
        <div className="calendar-container">
          <FullCalendar
            locale="ko"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
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
            eventOrder= "createdAt"
          />
        </div>

        {/* 오른쪽: 모달 */}
        {isModalOpen && (
          <div
            className="calendar-side"
            onClick={(e) => e.stopPropagation()} // ← 모달 클릭 보호 (닫히지 않게)
          >
            <EventModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
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
