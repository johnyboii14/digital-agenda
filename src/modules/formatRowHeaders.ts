export default (s: string): string =>
  String(s).replace(/^_*(.)|_+(.)/g, (_s, c, d) =>
    c ? c.toUpperCase() : ` ${d.toUpperCase()}`
  );
