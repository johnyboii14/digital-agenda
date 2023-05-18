import { useEffect } from 'react';

import AgendaCalendar from '../../components/AiringAgenda';
import Header from '../../components/Header';

import { useAppDispatch } from '../../config/hooks';
import { clearEvents } from '../../actions/events';
import { clearAirings } from '../../actions/airings';

import './styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function Home(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(clearEvents());
    void dispatch(clearAirings());
  }, [dispatch]);

  return (
    <div className="main-page-style">
      <Header />
      <main>
        <AgendaCalendar />
      </main>
    </div>
  );
}

export default Home;
