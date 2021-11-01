/* eslint-disable camelcase */
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux'
import { createPost } from '../actions/postsActions';

function CommentPost({ data, createPost }) {
  const publishCommentPath = JSON.parse(data).publishcommentpath;
  const publication_id = JSON.parse(data).publication_id;
  const currentUser = JSON.parse(JSON.parse(data).currentuser);
  const currentUser_id = currentUser.id;
  const [text, setText] = useState('');

  async function onChangeEvent(e) {
    e.preventDefault();
    setText(e.target.value);
  }

  async function fetchServer(e) {
    e.preventDefault();
    const rdata = {
      comment_text: text,
      publicationId: publication_id,
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
        <input type="hidden" name="publicationId" value={ publication_id } />
        <input type="hidden" name="userId" value={ currentUser_id} />
        <input type="submit" className="float-right margin-1 round-1" value="Enviar" />
      </form>
    </Fragment>
  );
}

export default connect(null, { createPost })(CommentPost);
