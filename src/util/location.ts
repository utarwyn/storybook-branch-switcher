export const generateLink = ({
  location,
  targetHost,
  defaultBranch,
  target,
}: {
  location: Location;
  targetHost?: string;
  defaultBranch: string;
  target: string;
}): string => {
  const hostname = targetHost || `${location.hostname}:${location.port}`;
  let path: string;

  if (target !== defaultBranch) {
    path = `/${target}/`;
  } else {
    path = "/";
  }

  return `${location.protocol}//${hostname}${path}${location.search}${location.hash}`;
};
