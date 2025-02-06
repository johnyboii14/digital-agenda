const url: string =
  process.env.NODE_ENV.length === 0 || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/digitalagendav2'
    : 'https://infinity.rctvpact.com/digitalagendav2';

export default url;
