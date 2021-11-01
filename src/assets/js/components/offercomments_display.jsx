/* eslint-disable camelcase */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux'

// Bring in the asynchronous fetchPosts action
import { fetchPosts } from '../actions/postsActions'

function OfferCommentDisplay({ data, dispatch, loading, posts, hasErrors }) {
  const currentUser = JSON.parse(data).currentuser;
  const selfPath = JSON.parse(data).selfpath;
  // const publication_id = JSON.parse(data).publication_id;
  // const [loading, setLoading] = useState(false);
  // const [commentUsersPair, setCommentUsersPair] = useState([]);

  // const fetchServer = useCallback(async () =>{
  //   const ans = await fetch(selfPath, { method: 'GET' }).then((r) => r.json());
  //   if (JSON.stringify(ans.commentUsersPair) === JSON.stringify(commentUsersPair)){
  //     return
  //   }
  //   setCommentUsersPair(ans.commentUsersPair);
  //
  // });

  // useEffect(() => { fetchServer(); });
  useEffect(() => {
    dispatch(fetchPosts(selfPath));
  }, [dispatch]);

  if (loading) return <p>Loading posts...</p>;
  if (hasErrors) return <p>Unable to display posts.</p>;
  return (
    <Fragment>
      {
        posts.map((commentUserPair) => {
          const comment = commentUserPair[0];
          const user = commentUserPair[1];
          return (
            <div id="comment" className="flex-container">
              <div id="profile-pic" className="">
                { currentUser ?
                  <a href={`/users/${user.username}`}>
                    {
                      user.image_url ?
                        <img id="user_img" className="profile-pic medium-pic" src={user.image_url}/>:
                        <img id="user_img" className="profile-pic medium-pic"
                             src="https://iic2513-groupimgs.s3.us-east-2.amazonaws.com/default_avatar.png"/>
                    }
                  </a>:
                  null
                }
              </div>
              <div id="comment_box" className="container background-hard-blue rubik-font">
                {comment.comment_text}
              </div>
            </div>
          )
        })
      }
    </Fragment>
  );
}


// Map Redux state to React component props
const mapStateToProps = (state) => ({
  loading: state.posts.loading,
  posts: state.posts.posts,
  hasErrors: state.posts.hasErrors,
});
// Connect Redux to React
export default connect(mapStateToProps)(OfferCommentDisplay)
