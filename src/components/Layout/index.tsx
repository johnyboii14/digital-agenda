import { Fragment, Suspense } from "react";

function Layout({ children }: any) {
  return (
    <Fragment>
      <Suspense fallback={<b>Loading ...</b>}>{children}</Suspense>
    </Fragment>
  );
}

export default Layout;
