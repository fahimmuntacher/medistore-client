export const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: segment.replace(/-/g, " "),
      href,
      isLast: index === segments.length - 1,
    };
  });
};
