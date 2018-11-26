export function publicationSubmitPath() {
  return '/publications';
}

export function getShowPath(publication) {
  return `/publications/${publication.id}`;
}

export function getItemImagePath(item) {
  return `/items/${item}/image`;
}

