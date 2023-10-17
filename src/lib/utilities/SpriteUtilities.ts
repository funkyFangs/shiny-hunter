export function defaultImage(event: Event, file: string) {
  if (event?.target) {
    event.target.src = file;
  }
}