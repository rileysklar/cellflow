/*
<ai_context>
Defines common types for server actions.
</ai_context>
*/

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never } 