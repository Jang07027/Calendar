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
    },
    {
      id: '2',
      title: '상추',
      date: '2025-11-15',
      description: '상추 내용',
      author: '이영희',
      worker: '박영수',
      crop: '상추',
      weather: '흐림',
      images: [],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

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
    });

    setSelectedDate(info.event.startStr);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    setEvents((prev) => {
      const exists = prev.find((evt) => evt.id === eventData.id);
      if (exists) {
        return prev.map((evt) =>
          evt.id === eventData.id ? { ...evt, ...eventData } : evt
        );
      }
      return [...prev, { ...eventData, id: Date.now().toString() }];
    });

    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
  };

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

      {/* 🔥 모달 외부 클릭 오버레이 — 달력 위, 모달 아래 */}
      {isModalOpen && (
        <div
          className="modal-overlay-clicker"
          onClick={() => setIsModalOpen(false)}
        />
      )}

      {/* 왼쪽: 달력 */}
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
        />
      </div>

      {/* 오른쪽: 모달 */}
      {isModalOpen && (
        <div
          className="calendar-side"
          onClick={(e) => e.stopPropagation()}  // ← 중요: 모달 클릭 보호
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
