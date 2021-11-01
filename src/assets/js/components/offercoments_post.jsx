/* eslint-disable camelcase */
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux'
import { createPost } from '../actions/postsActions';

function OfferCommentPost({ data, createPost }) {
  const publishCommentPath = JSON.parse(data).publishcommentpath;
  const offer_id = JSON.parse(data).offer_id;
  const currentUser_id = JSON.parse(data).currentuser_id;
  const [text, setText] = useState('');

  async function onChangeEvent(e) {
    e.preventDefault();
    setText(e.target.value);
  }

  async function fetchServer(e) {
    e.preventDefault();
    const rdata = {
      comment_text: text,
      ofertumId: offer_id,
      userId: currentUser_id,
      };
    const ans = await fetch(publishCommentPath, { method: 'POST', body: JSON.stringify(rdata) }).then((r) => r.json());
    if (ans.iscorrect) {
      setText('');
      createPost(ans.comment_posted)
    }
  }

  // { comment_text: 'pel', publicationId: '1', userId: '1' }



  return (
    <Fragment>
      <form onSubmit={ fetchServer } >
      {/*<form action={ publishCommentPath } method="post">*/}
        <textarea name="comment_text"
                  className="round-1 width-80 color-input no-border non-resizable"
                  id="comment_input" placeholder="Escribe un comentario..."
                  onChange={onChangeEvent}
                  value={text}/>
        <input type="hidden" name="ofertumId" value={ offer_id } />
        <input type="hidden" name="userId" value={ currentUser_id} />
        <input type="submit" className="float-right margin-1 round-1" value="Enviar" />
      </form>
    </Fragment>
  );
}

export default connect(null, { createPost })(OfferCommentPost);
