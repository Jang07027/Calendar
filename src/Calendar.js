//Calendar.js
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

  // 일정 클릭
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const data = event.extendedProps;

    setSelectedDate(event.startStr);
    setEditingEvent({
      id: event.id,
      title: event.title,
      date: event.startStr,
      description: data.description || '',
      author: data.author || '',
      worker: data.worker || '',
      crop: data.crop || '',
      weather: data.weather || '',
      image: data.image || null,
    });

    setIsModalOpen(true);
  };

  // 추가 또는 수정
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

  // 삭제 + 확인창 추가
  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setIsModalOpen(false);
  };

  // 이벤트 바 커스터마이징
  const renderEventContent = (eventInfo) => {
    const data = eventInfo.event.extendedProps;

    return (
      <div className="fc-custom-event">
        <div className="fc-event-title">{eventInfo.event.title}</div>

        <div className="fc-event-btns">
          <button
            className="fc-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              setEditingEvent({
                id: eventInfo.event.id,
                title: eventInfo.event.title,
                date: eventInfo.event.startStr,
                description: data.description,
                author: data.author,
                worker: data.worker,
                crop: data.crop,
                weather: data.weather,
                image: data.image,
              });
              setSelectedDate(eventInfo.event.startStr);
              setIsModalOpen(true);
            }}
          >
            수정
          </button>

          <button
            className="fc-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEvent(eventInfo.event.id);
            }}
          >
            삭제
          </button>
        </div>
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
          //eventClick={handleEventClick}
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
