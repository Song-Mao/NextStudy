"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversationList: MessageData[];
  selectedChat: ChatData | null;
  conversationId: string | null;
}

const initialState: ChatState = {
  conversationList: [],
  selectedChat: null,
  conversationId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<any>) => {
      state.conversationList.push(action.payload);
    },
    setConversationList: (state, action: PayloadAction<any[]>) => {
      state.conversationList = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<ChatData | null>) => {
      state.selectedChat = action.payload;
    },
    setConversationId: (state, action: PayloadAction<string | null>) => {
      state.conversationId = action.payload;
    },
    clearChatState: (state) => {
      state.conversationList = [];
      state.selectedChat = null;
      state.conversationId = null;
    },
  },
});

export const { addConversation, setConversationList, setSelectedChat, setConversationId, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;