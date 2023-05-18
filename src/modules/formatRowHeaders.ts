export default (s: string): string =>
  String(s).replace(/^_*(.)|_+(.)/g, (_s, c: string, d: string): string =>
    c.length > 0 ? c.toUpperCase() : ` ${d.toUpperCase()}`
  );
