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
        errorMessage = property.propertyMessage + ": " + errorMessagesLocal[0].toLowerCase();
      }
    });
  }
  toast.error(errorMessage || defaultMessage);
}
