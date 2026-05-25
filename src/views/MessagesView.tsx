import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquareCode, Paperclip, Mic, CheckCheck } from 'lucide-react';
import { Conversation, ChatMessage } from '../types';
import { toLocalNumbers } from '../lib/i18n';

// Import Firebase context
import { auth } from '../lib/firebase';
import { sendChatMessage } from '../lib/firebaseService';

interface MessagesViewProps {
  lang: 'en' | 'da' | 'pa';
  conversations: Conversation[];
  onConversationsChange: (conversations: Conversation[]) => void;
  translations: any;
  activeConvId?: string | null;
  setActiveConvId?: (id: string | null) => void;
}

export default function MessagesView({
  lang,
  conversations,
  onConversationsChange,
  translations,
  activeConvId: propActiveConvId,
  setActiveConvId: propSetActiveConvId,
}: MessagesViewProps) {
  const [internalActiveConvId, setInternalActiveConvId] = useState<string | null>(null);

  const activeConvId = propActiveConvId !== undefined ? propActiveConvId : internalActiveConvId;
  const setActiveConvId = propSetActiveConvId !== undefined ? propSetActiveConvId : setInternalActiveConvId;

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    onConversationsChange(
      conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '' || !activeConvId || !activeConv) return;

    const currentUserId = auth.currentUser?.uid || 'user_1';

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'sent',
    };

    const userTypedMessage = chatInput;
    setChatInput('');

    if (auth.currentUser) {
      await sendChatMessage(activeConvId, newMessage, activeConv);
    } else {
      const currentConversations = conversations;
      const conversationsWithUserMsg = currentConversations.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: userTypedMessage,
            lastMessageTime: newMessage.timestamp,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      });
      onConversationsChange(conversationsWithUserMsg);
    }

    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);

      const botReplies: Record<string, string[]> = {
        conv_1: [
          lang === 'en'
            ? 'Yes, it is still available. Come to Kart-e-Parwan block near custom office.'
            : 'بله، هنوز موجود است. به بخش کارته پروان نزدیک اداره گمرک تشریف بیاورید.',
          lang === 'en'
            ? 'Let me know the timing so I can park it outside.'
            : 'ساعت قرار را برایم بگویید تا موتر را بیرون پارک کنم.',
        ],
        conv_2: [
          lang === 'en'
            ? 'I can do AFN 92,000 final, please respect. Clean apple warranty.'
            : 'قیمت آخرش ۹۲۰۰۰ افغانی است محترم صاحب. کات شرکت و گارانتی پاک دارد.',
        ],
        conv_3: [
          lang === 'en'
            ? 'Awesome. I will send my brother to verify keys.'
            : 'بسیار عالی. برادرم را برای تسلیمی کلیدها روان می‌کنم.',
        ],
      };

      const replies = botReplies[activeConvId] || [
        lang === 'en' ? 'Tashakor for your interest! I will contact you back.' : 'تشکر از توجه شما! به زودی با شما به روزرسانی می‌کنم.',
      ];

      const chosenReplyText = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: chosenReplyText,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        status: 'read',
      };

      if (auth.currentUser) {
        await sendChatMessage(activeConvId, replyMsg, activeConv);
      } else {
        const currentConversations = conversations;
        const conversationsWithUserMsg = currentConversations.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: chosenReplyText,
              lastMessageTime: replyMsg.timestamp,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        });
        onConversationsChange(conversationsWithUserMsg);
      }
    }, 2000);
  };

  const isRTL = lang === 'da' || lang === 'pa';
  const totalUnread = conversations.reduce((acc, current) => acc + current.unreadCount, 0);

  return (
    <div className="flex flex-col flex-grow text-zinc-800 select-none relative animate-fade-in">
      {!activeConvId ? (
        /* Conversation inbox index row lists */
        <div className="flex flex-col flex-grow p-4 pt-6 pb-20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-blue-600 tracking-tight">{translations.messages}</h2>
            <span className="text-xs text-blue-600 font-bold">
              {toLocalNumbers(String(totalUnread), lang)} {lang === 'en' ? 'NEW' : 'پیام جدید'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white border cursor-pointer hover:border-blue-500/30 transition-all duration-200 select-none ${
                  conv.unreadCount > 0 ? 'bg-blue-600/5 border-blue-600/20' : 'border-zinc-200 shadow-sm'
                }`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                {/* User Avatar Initials */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-blue-600 text-sm font-black">
                    {conv.user.avatar}
                  </div>
                  {conv.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border border-white rounded-full"></span>
                  )}
                </div>

                {/* Sender content and metadata */}
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-extrabold text-zinc-800 text-sm truncate">{conv.user.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold">
                      {toLocalNumbers(conv.lastMessageTime, lang)}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs min-h-[1.25rem] truncate font-semibold max-w-[260px]">
                    {toLocalNumbers(conv.lastMessage, lang)}
                  </p>

                  {/* Context listing reference */}
                  {conv.listingContext && (
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-1 font-semibold">
                      <span className="capitalize text-zinc-500 font-extrabold underline">
                        💡 {toLocalNumbers(conv.listingContext.title, lang)}
                      </span>
                    </span>
                  )}
                </div>

                {/* Unread numeric circular badge indicator */}
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 animate-pulse">
                    {toLocalNumbers(String(conv.unreadCount), lang)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Dynamic detailed full screen chatting frame */
        <div className="flex flex-col flex-grow h-screen bg-zinc-50 relative">
          {/* Header toolbar */}
          <div
            className="sticky top-0 bg-white/95 backdrop-blur-md pt-6 pb-2.5 px-4 border-b border-zinc-200/80 flex items-center gap-3 z-40 select-none shadow-sm"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <button
              onClick={() => setActiveConvId(null)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-blue-500/25 flex items-center justify-center text-blue-600 text-xs font-black">
                {activeConv?.user.avatar}
              </div>
              {activeConv?.user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border border-white rounded-full"></span>
              )}
            </div>

            <div className="flex-grow min-w-0 flex flex-col leading-none">
              <h4 className="font-extrabold text-sm text-zinc-800">{activeConv?.user.name}</h4>
              <span className="text-[10px] text-zinc-400 font-semibold mt-1">
                {isTyping
                  ? translations.typing
                  : activeConv?.user.isOnline
                    ? translations.online
                    : `${translations.offline} (${toLocalNumbers(activeConv?.user.lastSeen || '1d ago', lang)})`}
              </span>
            </div>
          </div>

          {/* Context listing sticky item info bar */}
          {activeConv?.listingContext && (
            <div
              className="px-4 py-2.5 bg-zinc-100 border-b border-zinc-200/80 flex items-center justify-between select-none"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={activeConv.listingContext.image}
                  alt={activeConv.listingContext.title}
                  className="w-8 h-8 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-xs text-zinc-700 font-black">{toLocalNumbers(activeConv.listingContext.title, lang)}</span>
                  <span className="text-[11px] text-blue-600 font-bold mt-1">
                    {toLocalNumbers(activeConv.listingContext.price, lang)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chat scrollbox listings */}
          <div className="flex-grow overflow-y-auto px-4 py-4 pb-36 flex flex-col gap-3.5 scrollbar-none">
            {activeConv?.messages.map((m) => {
              const isMe = m.senderId === 'user_1';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${
                    isMe
                      ? isRTL
                        ? 'self-start items-start'
                        : 'self-end items-end'
                      : isRTL
                        ? 'self-end items-end'
                        : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-zinc-805 border border-zinc-200 rounded-bl-none'
                    }`}
                  >
                    {toLocalNumbers(m.text, lang)}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono mt-1 font-semibold flex items-center gap-1 leading-none">
                    {toLocalNumbers(m.timestamp, lang)}
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                  </span>
                </div>
              );
            })}

            {/* Simulated Dot typing indicator placeholder */}
            {isTyping && (
              <div className={`flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-zinc-200 max-w-[70px] ${isRTL ? 'self-end' : 'self-start'} shadow-sm`}>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Bottom input typing console tray */}
          <div className="absolute bottom-16 left-0 right-0 p-4 bg-white border-t border-zinc-200/80 flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-850 cursor-pointer transition-colors active:scale-90 flex-shrink-0 shadow-sm">
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex-grow flex items-center bg-zinc-100 border border-zinc-200 hover:border-zinc-300 p-1.5 rounded-2xl"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'en' ? 'Type message...' : 'نوشتن پیام...'}
                className="flex-grow bg-transparent border-none text-xs outline-none text-zinc-800 px-2 font-bold"
              />

              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-550 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-850 cursor-pointer active:scale-95 flex-shrink-0 shadow-sm">
              <Mic className="w-4.5 h-4.5 text-zinc-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
