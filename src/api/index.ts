import { Firestore } from "firebase/firestore"
import PollStore from "./firebase/polls"
import UserStore from "./firebase/users"
import { initializeApp, FirebaseOptions } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import AuthStore from "./firebase/auth"
import SessionStore from "./firebase/sessions/sessions"
import SubmissionStore from "./firebase/submissions"
import VertexStore from "./firebase/vertex"
import GitHubStore from "./github"

const config: FirebaseOptions = {
  apiKey: "AIzaSyDWTmXZvlh_kWxwROS6ma1XZz9VSpBAOEQ",
  authDomain: "new-pulsecheck.firebaseapp.com",
  projectId: "new-pulsecheck",
  storageBucket: "new-pulsecheck.firebasestorage.app",
  messagingSenderId: "238920390028",
  appId: "1:238920390028:web:b567cdeb56f8603b6932a9",
  measurementId: "G-79L0E0NQPP",
}

const BUCKET_URL = "gs://new-pulsecheck.firebasestorage.app"

const app = initializeApp(config)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app, BUCKET_URL)
export const functions = getFunctions(app)

if (import.meta.env.VITE_USE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
  connectFirestoreEmulator(firestore, "localhost", 8080)
  connectStorageEmulator(storage, "localhost", 9199)
  connectFunctionsEmulator(functions, "localhost", 5001)
  console.warn("🔧 Using Firebase emulators")
}

/**
 * Enum to model Firestore collection names.
 * Use this enum to prevent hardcoded strings, reduces typos and
 * provides better autocompletion when referring to Firestore collections.
 */
export enum clx {
  /* Collection for storing polls */
  polls = "polls",
  /* Subcollection for questions */
  questions = "questions",
  /* Subcollection for storing prompt options */
  options = "options",
  /* Collection for storing user data */
  users = "users",
  /* Collection for storing poll sessions */
  sessions = "sessions",
  /* Collection for storing users in waiting room */
  waiting_users = "waiting_users",
  /* Collection for storing responses for poll session questions */
  responses = "responses",
  /* Collection for storing user submissions for poll sessions */
  submissions = "submissions",
  /* Collection for storing user answers of the current question */
}

/**
 * Serves as a central interface for managing Firestore.
 */
class APIStore {
  private readonly _auth: AuthStore
  private readonly _users: UserStore
  private readonly _polls: PollStore
  private readonly _sessions: SessionStore
  private readonly _submissions: SubmissionStore
  private readonly _vertex: VertexStore
  private readonly _github: GitHubStore

  constructor(db: Firestore) {
    this._auth = new AuthStore()
    this._users = new UserStore(db)
    this._polls = new PollStore(db)
    this._sessions = new SessionStore(db, functions)
    this._submissions = new SubmissionStore(db)
    this._vertex = new VertexStore(functions)
    this._github = new GitHubStore()
  }

  public get auth(): AuthStore {
    return this._auth
  }

  public get users(): UserStore {
    return this._users
  }

  public get polls(): PollStore {
    return this._polls
  }

  public get sessions(): SessionStore {
    return this._sessions
  }

  public get submissions(): SubmissionStore {
    return this._submissions
  }

  public get vertex(): VertexStore {
    return this._vertex
  }

  public get github(): GitHubStore {
    return this._github
  }
}

const api = new APIStore(firestore)

export default api
