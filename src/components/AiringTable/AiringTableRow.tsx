import { type Airing } from '../../@types';

interface AiringTableRowProps {
  data: Airing;
}

function AiringTableRow({ data }: AiringTableRowProps): JSX.Element {
  const {
    item_name: itemName,
    item_number: itemNum,
    station,
    airing_time: airingTime,
    price,
    airing_id: airingId,
    show,
  } = data;
  const localePrice = price.toLocaleString();
  const airingDay = new Date(airingTime).toLocaleDateString();
  const airingFormattedTime = new Date(airingTime).toLocaleTimeString();
  return (
    <tr className="airing-table-row__container">
      <td>
        {airingDay} {airingFormattedTime}
      </td>
      <td>{itemNum}</td>
      <td style={{ width: 15 }}>{itemName}</td>
      <td>{airingId}</td>
      <td>{show}</td>
      <td>{station}</td>
      <td>${localePrice}</td>
    </tr>
  );
}

export default AiringTableRow;