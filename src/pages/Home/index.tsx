import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import AgendaCalendar from '../../components/AiringAgenda';
import AiringTable from '../../components/AiringTable';
import Header from '../../components/Header';

import { useAppDispatch } from '../../config/hooks';
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
    localStorage.setItem(DEFAULT_VIEW_OPTION, opt);
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(clearAirings());
  }, [dispatch]);

  return (
    <div className="main-page-style">
      <Header
        viewOption={viewOption}
        handleViewOptionClick={handleViewOptionClick}
      />
      <main style={{ zIndex: 1, position: 'relative' }}>
        <AnimatePresence>
          {viewOption !== VIEW_OPTION.AGENDA ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <AiringTable isAdmin={false} />
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {' '}
              <AgendaCalendar />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <div className="vignette" />
    </div>
  );
}

export default Home;
