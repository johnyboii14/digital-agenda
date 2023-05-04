import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../config/hooks";

import { clearAirings } from "../../actions/airings";

function AdminAiringTable(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearAirings());
  }, [dispatch]);
  const airings = useAppSelector((state) => state.airings.airings);
  const airingsForToday = airings.filter((airing) => {
    const airingDate = new Date(airing.airing_time);
    const today = new Date();
    return today.getDate() === airingDate.getDate();
  });
  const infomercialsToday = airingsForToday.filter(
    (airing) => airing.type === "Infomercial"
  );
  const shoppingBlocksToday = airingsForToday.filter(
    (airing) => airing.type === "ShoppingBlock"
  );
  return (
    <section className="admin-data__container">
      <header>Overview</header>
      <section className="data-overview__container">
        <article className="data-header__container">
          <h4>{airingsForToday.length}</h4>
          <h6>Showings Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{infomercialsToday.length}</h4>
          <h6>Infomercials Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{shoppingBlocksToday.length}</h4>
          <h6>Shopping Channels Today</h6>
        </article>
      </section>
    </section>
  );
}

export default AdminAiringTable;
