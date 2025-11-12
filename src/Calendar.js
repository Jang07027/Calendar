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
      image: null,
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
      image: null,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // 날짜 클릭 → 새 이벤트 추가
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  // 일정 클릭 → 수정 모달
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedDate(event.startStr);

    // ✅ extendedProps에 이미지, 작성자 등 추가 데이터 포함
    setEditingEvent({
      id: event.id,
      title: event.title,
      date: event.startStr,
      description: event.extendedProps.description || '',
      author: event.extendedProps.author || '',
      worker: event.extendedProps.worker || '',
      crop: event.extendedProps.crop || '',
      weather: event.extendedProps.weather || '',
      image: event.extendedProps.image || null, // ✅ 사진 복원
    });

    setIsModalOpen(true);
  };

  // ✅ 영농일지 추가 또는 수정
  const handleSaveEvent = (eventData) => {
    setEvents((prev) => {
      const exists = prev.find((evt) => evt.id === eventData.id);
      if (exists) {
        // 수정
        return prev.map((evt) => (evt.id === eventData.id ? { ...evt, ...eventData } : evt));
      } else {
        // 새 일정
        return [...prev, { ...eventData, id: Date.now().toString() }];
      }
    });
    setIsModalOpen(false);
  };

  // ✅ 영농일지 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <FullCalendar
          locale="ko"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          fixedWeekCount={false}
          headerToolbar={{ start: 'prev next', center: 'title', end: 'today' }}
          events={events.map((evt) => ({
            ...evt,
            extendedProps: {
              description: evt.description,
              author: evt.author,
              worker: evt.worker,
              crop: evt.crop,
              weather: evt.weather,
              image: evt.image,
            },
          }))}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayCellContent={(info) => <span>{info.date.getDate()}</span>}
        />
      </div>

      {/* ✅ 수정/추가 모달 */}
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
