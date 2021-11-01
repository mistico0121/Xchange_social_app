/* eslint-disable camelcase */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader';
import OfferCommentPost from './offercoments_post';
import OfferCommentDisplay from './offercomments_display';

export default function OfferCommentSection({ data }) {
  const currentUser = JSON.parse(data).currentuser;

  return (
    <Fragment>
      <OfferCommentDisplay data={data}/>
      {currentUser ?
        <OfferCommentPost data={data}/>:
        null
      }
    </Fragment>
  );
}

// export default hot(module)(App);
