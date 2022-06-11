import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const API_KEY = process.env.REACT_APP_API_KEY;

(function () {
  var cors_api_host = "cors-anywhere.herokuapp.com";
  var cors_api_url = "https://" + cors_api_host + "/";
  var slice = [].slice;
  var origin = window.location.protocol + "//" + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
  };
})();

export const getComics = () => {
  return async (dispatch) => {
    dispatch({ type: "LOADING" });
    try {
      const json = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issues/?api_key=${API_KEY}&format=json`
      );
      json.data.results && localStorage.setItem("comics", JSON.stringify(json));

      return dispatch({
        type: "GET_COMICS",
        payload: json.data.results,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

// This function fetch the main detail of the character without images of subproperties. (Images of characters, locations, teams and concepts)
export const getSimpleDetails = (id) => {
  return async (dispatch) => {
    dispatch({ type: "LOADING" });
    try {
      const json = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issue/4000-${id}/?api_key=${API_KEY}&format=json`
      );
      json.data.results && localStorage.setItem("detail", JSON.stringify(json));
      dispatch({
        type: "GET_COMIC_DETAIL",
        payload: json.data.results,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const getComicDetail = (id) => {
  return async (dispatch) => {
    dispatch({ type: "LOADING" });
    try {
      const infoCharacterComic = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issue/4000-${id}/?api_key=${API_KEY}&format=json`
      );
      const getImg = (comicImg) => {
        return comicImg;
      };
      const getExtraInfo = async (extraInfo) => {
        const extraInfoObj = extraInfo.map((info) => {
          let obj = {
            name: info.name,
            id: info.id,
            api_detail_url: info.api_detail_url,
          };
          return obj;
        });
        for (let i = 0; i < extraInfoObj.length; i++) {
          let characterImages = await axios.get(
            `https://cors-anywhere.herokuapp.com/${extraInfoObj[i].api_detail_url}?api_key=${API_KEY}&format=json`
          );
          extraInfoObj[i].icon_url =
            characterImages.data.results.image.icon_url;
        }
        return extraInfoObj;
      };
      Promise.all([
        getImg(infoCharacterComic.data.results.image.original_url),
        getExtraInfo(infoCharacterComic.data.results.character_credits),
        getExtraInfo(infoCharacterComic.data.results.location_credits),
        getExtraInfo(infoCharacterComic.data.results.team_credits),
        getExtraInfo(infoCharacterComic.data.results.concept_credits),
      ]).then((result) =>
        dispatch({
          type: "GET_COMIC_DETAIL",
          payload: result,
        })
      );
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
      console.log(error);
    }
  };
};
// To be tested
// extraInfoObj.map(info => {
//   let characterImages = await axios.get(`https://cors-anywhere.herokuapp.com/${info.api_detail_url}?api_key=${API_KEY}&format=json`)
//   info.icon_url = characterImages.data.results.image.icon_url;
// })

export const setCurrentPage = (payload) => {
  try {
    return {
      type: "SET_CURRENT_PAGE",
      payload: payload,
    };
  } catch (error) {
    console.log(error);
  }
};

export const addFavorite = (id) => {
  return (dispatch) => {
    try {
      dispatch({
        type: "ADD_FAVORITE",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const deleteFavorite = (id) => {
  return (dispatch) => {
    try {
      dispatch({
        type: "DELETE_FAVORITE",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const getFavorites = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "LOADING" });
      const docRef = doc(db, "favorites", id);
      const docSnap = await getDoc(docRef);
      return dispatch({
        type: "GET_FAVORITES",
        payload: docSnap.data().favorites,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const login = (user) => {
  return (dispatch) => {
    try {
      dispatch({
        type: "LOGIN",
        payload: user,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    try {
      dispatch({
        type: "LOGOUT",
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const searchByName = (name) => {
  return (dispatch) => {
    try {
      dispatch({
        type: "SEARCH_BY_NAME",
        payload: name,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };
};

export const closeError = () => {
  return (dispatch) => {
    try {
      dispatch({
        type: "CLOSE_ERROR",
      });
    } catch (error) {
      console.log(error);
    }
  };
};
