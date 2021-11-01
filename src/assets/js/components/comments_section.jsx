/* eslint-disable camelcase */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader';
import CommentPost from './coments_post';
import CommentDisplay from './comments_display';

export default function CommentSection({ data }) {
  const currentUser = JSON.parse(data).currentuser;

  return (
    <Fragment>
      <CommentDisplay data={data}/>
      {currentUser ?
        <CommentPost data={data}/>:
        null
      }
    </Fragment>
  );
}

// export default hot(module)(App);
