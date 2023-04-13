import { createSlice } from "@reduxjs/toolkit";

export const handCardsSlice = createSlice({
    name: "handCards",
    initialState: {
        cards: [],
    },
    reducers: {
        addCard: (state, action) => {
            state.cards.push(action.payload);
        },
        //cards are in the form of {suit: 2, rank: 11}
        removeCard: (state, action) => {
            console.log("store: removing card: ", action.payload)
            const index = state.cards.findIndex(
                (card) => card.suit === action.payload.suit && card.rank === action.payload.rank
            );
            if (index !== -1) {
                state.cards.splice(index, 1);
            }
        },
        clearCards: (state) => {
            state.cards = [];
        },
        getCards: (state, action) => {
            state.cards = action.payload;
        },
        addCards: (state, action) => {
            state.cards = state.cards.concat(action.payload);
        }
        
    },
});

export const { addCard, removeCard, clearCards, getCards,addCards } = handCardsSlice.actions;

export default handCardsSlice.reducer;