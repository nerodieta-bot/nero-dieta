'use client';

import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
  FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type AnyData = Record<string, unknown>;
type Op = 'create' | 'update' | 'delete';

function emitPermissionDenied(path: string, operation: Op, data?: AnyData) {
  errorEmitter.emit(
    'permission-error',
    new FirestorePermissionError({
      path,
      operation,
      requestResourceData: data,
    })
  );
}

function emitWriteError(code: string, path: string, operation: Op, data?: AnyData) {
  errorEmitter.emit('write-error', { code, path, operation, data });
}

/**
 * Idempotentny zapis dokumentu – domyślnie UP SERT (merge: true).
 * Nie awaituje; błędy permission emitowane selektywnie.
 */
export function setDocumentNonBlocking(
  docRef: DocumentReference,
  data: AnyData,
  options?: SetOptions
) {
  const effective: SetOptions = options ?? { merge: true };

  setDoc(docRef, data, effective).catch((err: FirestoreError) => {
    if (err.code === 'permission-denied') {
      emitPermissionDenied(docRef.path, effective.merge ? 'update' : 'create', data);
    } else {
      emitWriteError(err.code, docRef.path, effective.merge ? 'update' : 'create', data);
      // opcjonalnie:
      // console.error('[setDoc]', err);
    }
  });
}

/**
 * Dodanie dokumentu do kolekcji.
 * Zwraca Promise<DocRef>, ale zwykle nie czekamy.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: AnyData) {
  const p = addDoc(colRef, data).catch((err: FirestoreError) => {
    if (err.code === 'permission-denied') {
      emitPermissionDenied(colRef.path, 'create', data);
    } else {
      emitWriteError(err.code, colRef.path, 'create', data);
      // console.error('[addDoc]', err);
    }
    throw err; // pozwól callerowi ewentualnie obsłużyć
  });
  return p;
}

/**
 * Aktualizacja dokumentu.
 * Jeśli dokument nie istnieje (not-found), robimy UPSERT (merge: true).
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: AnyData) {
  updateDoc(docRef, data).catch(async (err: FirestoreError) => {
    if (err.code === 'not-found') {
      // UPSERT – to rozwiązuje Twój przypadek /users/<uid> + updatedAt
      return setDoc(docRef, data, { merge: true });
    }
    if (err.code === 'permission-denied') {
      emitPermissionDenied(docRef.path, 'update', data);
    } else {
      emitWriteError(err.code, docRef.path, 'update', data);
      // console.error('[updateDoc]', err);
    }
  });
}

/**
 * Usunięcie dokumentu.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef).catch((err: FirestoreError) => {
    if (err.code === 'permission-denied') {
      emitPermissionDenied(docRef.path, 'delete');
    } else {
      emitWriteError(err.code, docRef.path, 'delete');
      // console.error('[deleteDoc]', err);
    }
  });
}
