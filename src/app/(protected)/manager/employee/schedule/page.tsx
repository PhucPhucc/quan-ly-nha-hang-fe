"use client";

import React, { useState } from "react";

import ScheduleCalendar from "@/components/features/Schedule/ScheduleCalendar";

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col gap-8 px-6 md:px-10 py-8 h-full overflow-y-auto no-scrollbar pb-10">
      <div className="flex-1">
        <ScheduleCalendar currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>
    </div>
  );
};

export default SchedulePage;
