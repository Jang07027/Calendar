// Calendar.js
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './EventModal';
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

  /* 날짜 클릭 시 모달 열기 */
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  /* 이벤트 클릭 시 모달 열기 */
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

  /* 저장 */
  const handleSaveEvent = (eventData) => {
    setEvents((prev) => {
      const exists = prev.find((evt) => evt.id === eventData.id);
      if (exists) {
        return prev.map((evt) =>
          evt.id === eventData.id ? { ...evt, ...eventData } : evt
        );
      } else {
        return [...prev, { ...eventData, id: Date.now().toString() }];
      }
    });

    setIsModalOpen(false);
  };

  /* 삭제 */
  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
  };

  /* 이벤트 모양 (버튼 제거된 버전) */
  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-custom-event">
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
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
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleSaveEvent}
        onDeleteEvent={handleDeleteEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  );
}

export default Calendar;
