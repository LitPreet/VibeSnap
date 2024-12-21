import { formatDistanceToNow, format, isYesterday } from "date-fns";
export function throttle(cb: (...args: any[]) => void, del: number) {
    let lastExec = 0;
    return function (...args: any[]) {
      let now = Date.now();
      if (now - lastExec >= del) {
        cb(...args);
      }
      lastExec = now;
    };
  }

  export const lightColors = [
    "bg-purple-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-teal-100",
  ];

  export const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isYesterday(date)) {
      return "Yesterday";
    }

    const timeDifference = formatDistanceToNow(date, { addSuffix: true });
    return timeDifference.includes("ago") ? timeDifference : format(date, "MMMM dd, yyyy");
  };