const url: string =
  process.env.NODE_ENV.length === 0 || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://agenda.rctvpact.com';

export default url;
