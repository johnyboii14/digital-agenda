import { type Airing } from '../../@types';

interface AiringTableRowProps {
  data: Airing;
}

function AiringTableRow({ data }: AiringTableRowProps): JSX.Element {
  const {
    airing_item_description: itemName,
    airing_item_number: itemNum,
    airing_station: airingStation,
    airing_date_time: airingTime,
    airing_price: airingPrice,
    airing_id: airingId,
    airing_show: airingShow,
  } = data;

  // ✅ Check if airingPrice is defined and a number
  const localePrice = airingPrice !== undefined && !isNaN(airingPrice)
    ? airingPrice.toLocaleString()
    : '0.00';  // Fallback value if undefined

  const airingDate = new Date(airingTime + 'Z'); // ✅ Ensure UTC interpretation

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const airingDay = airingDate.toLocaleDateString('en-US', {
    timeZone: userTimeZone, // ✅ Auto-detect user's timezone
  });

  const airingFormattedTime = airingDate.toLocaleTimeString('en-US', {
    timeZone: userTimeZone, // ✅ Auto-detect user's timezone
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <tr className="airing-table-row__container">
      <td style={{ width: '100px' }}>
        {airingDay} {airingFormattedTime}
      </td>
      <td>{itemNum}</td>
      <td style={{ width: '300px' }}>{itemName}</td>
      <td>{airingId}</td>
      <td>{airingShow}</td>
      <td>{airingStation}</td>
      <td>${localePrice}</td>
    </tr>
  );
}

export default AiringTableRow;
