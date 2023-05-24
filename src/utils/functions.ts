import toast from "react-hot-toast";
import QRCode from 'qrcode'

export const countLines = (text: string) => {
  return text.split(/\r\n|\r|\n/).length
};

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

export const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
}

export const onGenerateQr = async (projectId: string, projectName: string) => {
  const projectLink = getProjectUrl(projectId);
  try {
    const qrImage = await QRCode.toDataURL(
      projectLink,
      { type: 'image/png' },
    )
    await shareOrCopyToClipboard({
      title: `${projectName}'s QR-Code`,
      isFile: true,
      fileName: `${projectName}'s QR-Code.png`,
      text: qrImage
    })
  } catch (err) {
    toast('Something went wrong generating the QR-Code', {
      className: 'bg-error text-error'
    })
  }
}

export const shareOrCopyToClipboard = async ({
  text,
  title,
  isFile,
  fileName,
}: {
  text: string,
  title?: string,
  isFile?: boolean
  fileName?: string;
}) => {
  if (isFile) {
    const blob = await (await fetch(text)).blob()
    const file = new File([blob], (fileName || 'projectQr.png'), { type: blob.type })
    downloadFile(fileName || 'projectQr.png', file)
    return;
  }
  const shareData: ShareData = {
    title,
    url: text,
  };
  if (navigator.share && navigator.canShare(shareData)) {
    void navigator.share({
      title,
      url: text,
    })
  } else {
    void copyToClipboard(text);
  }
}

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  toast('Copied to the clipboard!')
}

const downloadFile = (fileName: string, blob: Blob) => {
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `${fileName}`,
  );

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

export const getProjectUrl = (projectId: string) => {
  return `${window.location.origin}/newfeedback/${projectId}`
}
