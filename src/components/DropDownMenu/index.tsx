import Composites from './Composites';
import DownSells from './DownSells';
import UpSells from './UpSells';

function DropDownMenu(): JSX.Element {
  return (
    <div>
      <Composites />
      <br />
      <DownSells />
      <br />
      <UpSells />
    </div>
  );
}

export default DropDownMenu;
