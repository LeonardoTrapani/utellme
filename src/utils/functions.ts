import toast from "react-hot-toast";

/*
This function should be called in the onError (on query or mutation) of the trpc client and should look like this:
toastTrpcError(
  "Something went wrong creating the project.",
  e.data?.zodError?.fieldErrors,
  [
    { propertyName: "name", propertyMessage: "Project name" },
  ]
)
*/

enum TimeType {
  Year = "year",
  Month = "month",
  Day = "day",
  Hour = "hour",
  Minute = "minute",
  Second = "second",
}

export const timeSinceNow = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  const returnValue = (interval: number, type: TimeType) => {
    if (type === TimeType.Second) {
      return "just now";
    }
    if (interval.toFixed(0) === "1") {
      return `1 ${type} ago`;
    } else {
      return `${interval.toFixed(0)} ${type}s ago`;
    }
  };

  if (interval > 1) {
    return returnValue(interval, TimeType.Year);
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return returnValue(interval, TimeType.Month);
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return returnValue(interval, TimeType.Day);
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return returnValue(interval, TimeType.Hour);
  }
  interval = seconds / 60;
  if (interval > 1) {
    return returnValue(interval, TimeType.Minute);
  }
  return returnValue(seconds, TimeType.Second);
}

export const toastTrpcError = (
  defaultMessage: string,
  errorMessages: {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  } | undefined,
  properties: { propertyName: string, propertyMessage: string }[]
) => {
  let errorMessage: string | undefined = undefined;
  if (errorMessages) {
    properties.forEach((property) => {
      const errorMessagesLocal = errorMessages[property.propertyName]
      if (errorMessagesLocal && errorMessagesLocal[0]) {
        errorMessage = "An error has occurred with the " + property.propertyMessage.toLowerCase() + ": " + errorMessagesLocal[0].toLowerCase();
      }
    });
  }
  toast.error(errorMessage || defaultMessage);
}

export const isDarkTheme = () => {
  if (typeof window !== "undefined") {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    return darkThemeMq.matches;
  }
  return true;
}
