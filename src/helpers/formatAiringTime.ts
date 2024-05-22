export const formatAiringTime = (airingTime: string): { airingDay: string; airingFormattedTime: string } => {
    const airingDay = new Date(airingTime).toLocaleDateString('en-US', {
      timeZone: 'UTC',
    });
    const airingFormattedTime = new Date(airingTime).toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  
    return { airingDay, airingFormattedTime };
  };
  