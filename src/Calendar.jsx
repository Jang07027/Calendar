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
      title: '감자',
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
      id: '4', // 중복 방지용
      title: '상추',
      date: '2025-12-15',
      description: '상추 내용2',
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

  // 공통: 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // 날짜 칸 클릭
  const handleDateClick = (info) => {
    // 1) 모달이 이미 열려 있으면 → 이번 클릭은 "닫기"만 (어떤 날짜든)
    if (isModalOpen) {
      handleCloseModal();
      return;
    }

    // 2) 모달이 닫혀 있을 때만 새 작성 모달 열기
    setSelectedDate(info.dateStr);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  // 이벤트 바 클릭 → 해당 이벤트 수정 모드
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
      createdAt: data.createdAt,
    });

    setSelectedDate(info.event.startStr);
    setIsModalOpen(true); // 이미 열려 있어도 상관 없음(내용만 교체)
  };

  // 저장 (신규 + 수정)
  const handleSaveEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      createdAt: editingEvent?.createdAt || Date.now(),
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

    handleCloseModal();
  };

  // 삭제
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    handleCloseModal();
  };

  // FullCalendar에서 이벤트 렌더링 모양
  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-custom-event">
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="calendar-layout">
        <div className="calendar-container">
          <FullCalendar
            locale="ko"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="100%"
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

        {/* 오른쪽 모달 패널 */}
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
