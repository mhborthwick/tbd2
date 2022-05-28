import { NextApiRequest, NextApiResponse } from "next";

/**
 * Gets request init options
 *
 * @param {string} accessToken
 */
function _getRequestInitOptions(accessToken, details) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  };
}

/**
 * Creates playlist
 *
 * @param {string} accessToken
 * @param {string} userId
 * @param {{name: string, description: string}} details
 * @returns {Promise<Object>}
 */
async function _createPlaylist(accessToken, refresh, userId, details) {
  const baseUrl = "https://api.spotify.com";
  const endpoint = `/v1/users/${userId}/playlists`;
  const api = baseUrl + endpoint;
  const response = await fetch(
    api,
    _getRequestInitOptions(accessToken, details)
  );
  if (response.status === 401) {
    const baseUrl = "https://accounts.spotify.com";
    const endpoint = "/api/token";
    const api = baseUrl + endpoint;
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      }),
    });
    const data = await response.json();
    return data;
  }
  const data = await response.json();
  return data;
}

/**
 * Parses data and returns playlist id
 *
 * @param {Object} data
 * @returns {string} id
 */
function _getPlaylistId(data) {
  const { id } = data;
  return id;
}

/**
 * Creates playlist
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  try {
    const { authorization, refresh } = req.headers;
    const { id, name, description } = req.body;
    const details = { name: name, description: description };
    const results = await _createPlaylist(authorization, refresh, id, details);
    if (results.refresh_token) {
      res.status(401).json(results);
    } else {
      const playlistId = _getPlaylistId(results);
      res.status(200).json({ id: playlistId });
    }
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
