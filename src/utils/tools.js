export const timestamp2str = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDay();
  const h = date.getHours();
  const m = date.getMinutes();

  return `${Y}-${M}-${D} ${h}:${m}`;
};
