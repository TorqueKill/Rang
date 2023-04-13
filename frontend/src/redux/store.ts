import { configureStore } from '@reduxjs/toolkit'
import userCounterReducer from './counter'
import handCards from './handCards';

const store = configureStore({
  reducer: { cardsInHand: handCards, users: userCounterReducer},
})

export default store;
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch