import { v4 as uuidv4 } from "uuid";
import Layout from "../components/layout";
import {
  getAuthParams,
  getCodeChallenge,
  redirectToAuthUrl,
  setStateIdToStorage,
  setVerifierToStorage,
} from "../utils/authUtils";

export default function Home() {
  return (
    <Layout>
      <button
        onClick={() => {
          const { verifier, challenge } = getCodeChallenge();
          const scope = "user-read-private user-read-email";
          const state = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
          const params = getAuthParams(scope, state, challenge);
          const query = new URLSearchParams(params).toString();
          setStateIdToStorage(state);
          setVerifierToStorage(verifier);
          redirectToAuthUrl(query);
        }}
      >
        Log in to Get Started
      </button>
    </Layout>
  );
}
