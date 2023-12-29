export const generateLink = (location: Location, targetHost: string, def: string, current: string, target: string): string => {
  const hostname = targetHost || `${location.hostname}:${location.port}`;
  let path: string;

  if (current && def !== current) {
    path = location.pathname.replace(current, target);
  } else if (target && def !== target) {
    path = `/${target}/`;
  } else {
    path = "/";
  }

  return `${location.protocol}//${hostname}${path}${location.search}${location.hash}`;
};
