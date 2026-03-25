import {
  CollectionReference,
  DocumentReference,
  Firestore,
} from "firebase/firestore"
import { Poll, Session, PromptOption, Question } from "../../types"

/**
 * Abstract Class for working with a Firestore database.
 * Provides a protected Firestore instance and enforces a consistent structure for subclasses.
 */
export default abstract class BaseStore {
  /**
   * Used to interact with the database. Marked a private to ensure controlled access.
   */
  private readonly _db: Firestore

  constructor(db: Firestore) {
    this._db = db
  }

  protected get db() {
    return this._db
  }
}

/**
 * Defines parameters for referencing a specific document of type `T`.
 * Defined based on the type of `T`:
 * - If `T` is `PromptOption`, the parameters include `pid`, `qid`, and `oid`.
 * - If `T` is `Question`, the parameters include `pid` and `qid`.
 * - If `T` is `Poll`, the parameters include `pid`.
 * - For unsupported types of `T`, this resolves to `never`.
 */
export type DocumentParams<T> = T extends PromptOption
  ? { pid: string; qid: string; oid: string }
  : T extends Question
    ? { pid: string; qid: string }
    : T extends Poll
      ? { pid: string }
      : T extends Session
        ? { sid: string }
        : never

/**
 * Defines a parameters for referencing a collection of documents of type `T`.
 * Defined based on the type of `T`:
 * - If `T` is `PromptOption`, the parameters include `pid` and `qid`.
 * - If `T` is `Question`, the parameters include `pid`.
 * - If `T` is `Poll`, the parameters are `null`, no specific input is required.
 * - For unsupported types of `T`, this resolves to `never`.
 */
export type CollectionParams<T> = T extends PromptOption
  ? { pid: string; qid: string }
  : T extends Question
    ? { pid: string }
    : T extends Poll
      ? null
      : T extends Session
        ? null
        : never

/**
 * Interface for Firestore CRUD operations.
 */
export interface CRUDStore<T> {
  /**
   * Creates a reference to a single document of type `T` based on given parameters.
   * @param params - Parameters that identify the specific document to fetch.
   * @returns A reference to the document of type `T`.
   */
  doc(params: DocumentParams<T>): DocumentReference<T>

  /**
   * Creates a reference to a collection of documents of type `T` based on given parameters.
   * @param params - Parameters that define the collection of documents to reference.
   * @returns A reference to the collection of documents of type `T`.
   */
  collect(params: CollectionParams<T>): CollectionReference<T>

  /**
   * Creates a document of type `T` in the specified collection.
   * @param ref - A reference to the collection where the document will be created.
   * @returns A promise that resolves to a refeence for the newly created document.
   */
  create(ref: CollectionReference<T>): Promise<DocumentReference<T>>

  /**
   * Updates an existing document of type `T` by its reference with the provided partial payload.
   * @params ref - The reference to the document to be updated.
   * @param payload - A partial object containg the fields to update.
   * @returns A promise that resolves when the update is complete.
   */
  updateByRef(ref: DocumentReference<T>, payload: Partial<T>): Promise<void>

  /**
   * Updates an existing document of type `T` by its identifier with the provided partial payload.
   * @params params - Parameters that identify the specific document to update.
   * @payload - A partial object containing the fields to update.
   * @returns A promise that resolves when the update is complete.
   */
  updateById(params: DocumentParams<T>, payload: Partial<T>): Promise<void>

  /**
   * Deletes an existing document of type `T` by its reference.
   * @param ref - The reference to the document to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  deleteByRef(ref: DocumentReference<T>): Promise<void>

  /**
   * Deletes an existing document of type `T` by its identifier.
   * @param params - Parameters that identify the specific document to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  deleteById(params: DocumentParams<T>): Promise<void>
}
