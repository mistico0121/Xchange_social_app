/* frontend/src/actions/postsReducerucer.js */
export const GET_POSTS = 'GET POSTS';
export const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
export const GET_POSTS_FAILURE = 'GET_POSTS_FAILURE';
export const CREATE_POST = 'CREATE_POST';

// Create Redux action creators that return an action
export const getPosts = () => ({
  type: GET_POSTS,
});

export const getPostsSuccess = (posts) => ({
  type: GET_POSTS_SUCCESS,
  payload: posts,
});

export const getPostsFailure = () => ({
  type: GET_POSTS_FAILURE,
});

export const createPost = (post) => {
  return {
    type: CREATE_POST,
    payload: post,
  }
};

// Combine them all in an asynchronous thunk
export function fetchPosts(selfPath) {
  return async (dispatch) => {
    dispatch(getPosts());

    try {
      // const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await fetch(selfPath, { method: 'GET' }).then((r) => r.json());
      // const data = await response.json();

      dispatch(getPostsSuccess(data.commentUsersPair));
    } catch (error) {
      dispatch(getPostsFailure());
    }
  };
}
