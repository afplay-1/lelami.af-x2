import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquareCode, Paperclip, Mic, CheckCheck } from 'lucide-react';
import { Conversation, ChatMessage } from '../types';

interface MessagesViewProps {
  lang: 'en' | 'da' | 'pa';
  initialConversations: Conversation[];
  translations: any;
}

export default function MessagesView({ lang, initialConversations, translations }: MessagesViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    // Mark messages as read by resetting unreadCount
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '' || !activeConvId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user_1', // represents logged-in user Ahmad
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'sent',
    };

    const userTypedMessage = chatInput;

    // Append to state
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: userTypedMessage,
            lastMessageTime: newMessage.timestamp,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setChatInput('');

    // Trigger simulated reply
    setIsTyping(true);
    setTimeout(() => {
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

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: chosenReplyText,
              lastMessageTime: replyMsg.timestamp,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 2000);
  };

  const isRTL = lang === 'da' || lang === 'pa';

  return (
    <div className="flex flex-col flex-grow text-zinc-100 select-none relative animate-fade-in">
      {!activeConvId ? (
        /* Conversation inbox index row lists */
        <div className="flex flex-col flex-grow p-4 pt-14 pb-28">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-orange-500 tracking-tight">{translations.messages}</h2>
            <span className="text-xs text-orange-400 font-bold font-mono">
              {conversations.reduce((acc, current) => acc + current.unreadCount, 0)} {lang === 'en' ? 'NEW' : 'پیام جدید'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:border-orange-500/30 transition-all duration-200 select-none ${
                  conv.unreadCount > 0 ? 'bg-[#1a1a1c]/20 border-orange-500/25' : 'border-white/5'
                }`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                {/* User Avatar Initials */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1b1b1b] to-zinc-900 border border-white/10 flex items-center justify-center text-orange-400 text-sm font-black">
                    {conv.user.avatar}
                  </div>
                  {conv.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border border-zinc-950 rounded-full"></span>
                  )}
                </div>

                {/* Sender content and metadata */}
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-extrabold text-orange-500 text-sm truncate">{conv.user.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-zinc-350 text-xs min-h-[1.25rem] truncate font-medium max-w-[260px]">
                    {conv.lastMessage}
                  </p>

                  {/* Context listing reference */}
                  {conv.listingContext && (
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1">
                      <span className="capitalize text-zinc-400 font-bold underline">
                        💡 {conv.listingContext.title}
                      </span>
                    </span>
                  )}
                </div>

                {/* Unread numeric circular badge indicator */}
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-black text-black flex-shrink-0 animate-pulse">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Dynamic detailed full screen chatting frame */
        <div className="flex flex-col flex-grow h-screen bg-zinc-950 relative">
          {/* Header toolbar */}
          <div
            className="sticky top-0 bg-[#202020]/90 backdrop-blur-md pt-14 pb-3.5 px-4 border-b border-zinc-850 flex items-center gap-3 z-40 select-none"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <button
              onClick={() => setActiveConvId(null)}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-805 cursor-pointer"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-orange-500/50 flex items-center justify-center text-orange-400 text-xs font-black">
                {activeConv?.user.avatar}
              </div>
              {activeConv?.user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#202020] rounded-full"></span>
              )}
            </div>

            <div className="flex-grow min-w-0 flex flex-col leading-none">
              <h4 className="font-extrabold text-sm text-zinc-50">{activeConv?.user.name}</h4>
              <span className="text-[10px] text-zinc-500 font-semibold mt-1">
                {isTyping
                  ? translations.typing
                  : activeConv?.user.isOnline
                    ? translations.online
                    : `${translations.offline} (${activeConv?.user.lastSeen || '1d ago'})`}
              </span>
            </div>
          </div>

          {/* Context listing sticky item info bar */}
          {activeConv?.listingContext && (
            <div
              className="px-4 py-2.5 bg-[#252525] border-b border-zinc-800 flex items-center justify-between select-none"
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
                  <span className="text-xs text-zinc-200 font-black">{activeConv.listingContext.title}</span>
                  <span className="text-[11px] text-orange-500 font-bold font-mono mt-1">
                    {activeConv.listingContext.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chat scrollbox listings */}
          <div className="flex-grow overflow-y-auto px-4 py-4 pb-28 flex flex-col gap-3.5 scrollbar-none">
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
                    className={`px-4 py-3 rounded-2xl text-xs font-bold leading-relaxed shadow ${
                      isMe
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-[#151515] text-zinc-200 border border-white/5 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1 font-semibold flex items-center gap-1 leading-none">
                    {m.timestamp}
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </span>
                </div>
              );
            })}

            {/* Simulated Dot typing indicator placeholder */}
            {isTyping && (
              <div className={`flex items-center gap-1.5 p-3 rounded-2xl bg-[#151515] border border-white/5 max-w-[70px] ${isRTL ? 'self-end' : 'self-start'}`}>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Bottom input typing console tray */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-805 text-zinc-450 hover:text-white cursor-pointer transition-colors active:scale-90 flex-shrink-0">
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex-grow flex items-center bg-[#242424] border border-[#333] hover:border-zinc-750 p-1.5 rounded-2xl"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'en' ? 'Type message...' : 'نوشتن پیام...'}
                className="flex-grow bg-transparent border-none text-xs outline-none text-zinc-200 px-2 font-semibold"
              />

              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-black active:scale-90 transition-transform cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-805 text-zinc-455 hover:text-white cursor-pointer active:scale-95 flex-shrink-0">
              <Mic className="w-4.5 h-4.5 text-zinc-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
