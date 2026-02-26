import { useEffect, useState } from "react";

// Sửa lại hàm tính toán một chút: nhận thêm currentTime để tính toán
const calculateElapsedTime = (createdAt: string, currentTime: number): string => {
  const createdTime = new Date(createdAt).getTime();
  const diffInSeconds = Math.floor((currentTime - createdTime) / 1000);

  if (diffInSeconds < 0) return "0s";

  if (diffInSeconds < 60) return `${diffInSeconds}s`;

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  }

  const hours = Math.floor(diffInSeconds / 3600);
  const remainingMinutes = Math.floor((diffInSeconds % 3600) / 60);

  return remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`;
};

export const useElapsedTime = (createdAt?: string | null): string => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!createdAt) return;

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [createdAt]);

  if (!createdAt) return "";

  return calculateElapsedTime(createdAt, now);
};
