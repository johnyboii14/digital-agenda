import { useEffect, useState } from 'react';

import AgendaCalendar from '../../components/AiringAgenda';
import AiringTable from '../../components/AiringTable';
import Header from '../../components/Header';

import { useAppDispatch } from '../../config/hooks';
import { clearEvents } from '../../actions/events';
import { clearAirings } from '../../actions/airings';
import { DEFAULT_VIEW_OPTION } from '../../constants';

import { VIEW_OPTION } from '../../@types';

import './styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function Home(): JSX.Element {
  let defaultView = localStorage.getItem(DEFAULT_VIEW_OPTION);
  if (defaultView === '' || defaultView === undefined || defaultView === null) {
    defaultView = VIEW_OPTION.AGENDA;
  }
  const [viewOption, toggleViewOption] = useState<VIEW_OPTION>(
    defaultView as VIEW_OPTION
  );
  const handleViewOptionClick = (opt: VIEW_OPTION): void => {
    toggleViewOption(opt);
    localStorage.setItem(DEFAULT_VIEW_OPTION, opt)
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(clearEvents());
    void dispatch(clearAirings());
  }, [dispatch]);
  const content =
    viewOption === VIEW_OPTION.AGENDA ? <AgendaCalendar /> : <AiringTable isAdmin={false} />;

  return (
    <div className="main-page-style">
      <Header
        viewOption={viewOption}
        handleViewOptionClick={handleViewOptionClick}
      />
      <main style={{ zIndex: 1, position: 'relative' }}>{content}</main>
      <div className="vignette" />
    </div>
  );
}

export default Home;
