import axios from 'axios';
import history from '../history';
import {
  RECEIVE_COMMENTS,
  ADD_COMMENT,
  RECEIVE_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT,
  REPLACE_COMMENT, 
  CLEAR_CURRENT

} from './types';


const apiUrl = 'https://articles23.herokuapp.com';
const token = "Bearer " + localStorage.getItem("jwtToken")




export const getComments = (articleId) => {
  return (dispatch) => {
    return axios({method: 'get', url: `${apiUrl}/api/articles/${articleId}/comments`, headers: {'Authorization': token }})
    .then(response => {
      dispatch({ type: RECEIVE_COMMENTS, payload: response.data})
    })
    .catch(error => { throw(error)})
  }
};

export const addComment = ({  body, article_id, user_id, email }) => {     
  return (dispatch) => {
    return axios({ method: 'post', url:`${apiUrl}/api/comments`, headers: {'Authorization': token }, data: {body, user_id, article_id}})
    .then(response => {
      let data = response.data;
      dispatch({
        type: ADD_COMMENT,
        payload: {id: data.id, body: data.body, article_id: article_id, user_id: user_id, email: email}
      })
    })
    .then(() => {
      //  debugger
      history.push(`/articles/${article_id}`)
    })
    .catch(error => { throw(error)});
  }
}

export const getComment = (id) => {
  return (dispatch) => {
    return axios({method: 'get', url: `${apiUrl}/api/articles/${id}`, headers: {'Authorization': token }})
      .then(response => {
        dispatch({ type: RECEIVE_COMMENT, payload: response.data })
      })
      .catch(error => {
        throw(error);
      })
  }
}

export const deleteComment = (article, id) => {
  let articleId = article.id;
  return (dispatch) => {
    return axios({ method:'delete', url:`${apiUrl}/api/comments/${id}`, headers: {'Authorization': token}})
    .then(response => {
      dispatch({ type: REMOVE_COMMENT, payload: {id}})
    })
    .then(() => {
      history.push(`/articles/${articleId}`)
    })
    .catch(error => {
      throw(error)
    })
  }
}

export const updateComment = (article) => {
  const articleId = article.id;
  return (dispatch) => {
    return axios({ method:'patch', url:`${apiUrl}/${article.id}.json`, headers: {'Authorization': token }, data: {title: article.title, content: article.content}})
      .then(response => {
        const data = response.data;
        dispatch({ type: UPDATE_COMMENT, payload: {id: data.id, title: data.title, content: data.content}})
        dispatch({ type: REPLACE_COMMENT, payload: {id: data.id, title: data.title, content: data.content}})
      })
      .then(() => {
        history.push(`/articles/${articleId}`)
      })
      .catch(error => { throw(error)});
  }
}


export const clearCurrent = () => {
  return {
      type: CLEAR_CURRENT
  }
}
