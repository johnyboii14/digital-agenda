import { useEffect, useState } from 'react';

import AgendaCalendar from '../../components/AiringAgenda';
import Header from '../../components/Header';

import { useAppDispatch } from '../../config/hooks';
import { clearEvents } from '../../actions/events';
import { clearAirings } from '../../actions/airings';

import { VIEW_OPTION } from '../../@types';

import './styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function Home(): JSX.Element {
  const [viewOption, toggleViewOption] = useState<VIEW_OPTION>(
    VIEW_OPTION.AGENDA
  );
  const handleViewOptionClick = (opt: VIEW_OPTION): void => {
    toggleViewOption(opt);
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(clearEvents());
    void dispatch(clearAirings());
  }, [dispatch]);

  return (
    <div className="main-page-style">
      <Header
        viewOption={viewOption}
        handleViewOptionClick={handleViewOptionClick}
      />
      <main style={{ zIndex: 1, position: 'relative' }}>
        <AgendaCalendar />
      </main>
      <div className="vignette" />
    </div>
  );
}

export default Home;
