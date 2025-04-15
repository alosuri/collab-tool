import { Virtuoso } from "react-virtuoso";
import { useState, useRef, useCallback, useEffect } from "react";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

// Type for a message
type MessageType = {
  id: number;
  message: string;
  from: string;
};

const Chat = () => {
  const virtuosoRef = useRef<any>(null);
  const [messages, setMessages] = useState<MessageType[]>([
    { id: 1, message: "siema", from: "me" },
    { id: 2, message: "czesc", from: "you" },
    { id: 3, message: "siema", from: "me" },
    { id: 4, message: "czesc", from: "you" },
    { id: 5, message: "siema", from: "me" },
    { id: 6, message: "czesc", from: "you" },
    { id: 7, message: "siema", from: "me" },
    { id: 8, message: "czesc", from: "you" },
    { id: 9, message: "siema", from: "me" },
    { id: 10, message: "czesc", from: "you" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const loadMore = useCallback(() => {
    if (loading) return;

    setLoading(true);
    setShowLoading(true);

    const currentScrollPosition = virtuosoRef.current?.scrollTop;

    const oldestId = messages[0].id;

    // Simulate fetching more messages
    const moreMessages = [
      { id: oldestId - 1, message: "aha 1", from: "you" },
      { id: oldestId - 2, message: "aha 2", from: "me" },
      { id: oldestId - 3, message: "aha 1", from: "you" },
      { id: oldestId - 4, message: "aha 2", from: "me" },
      { id: oldestId - 5, message: "aha 1", from: "you" },
      { id: oldestId - 6, message: "aha 2", from: "me" },
    ];

    // Simulate network delay
    setTimeout(() => {
      setMessages((prevMessages) => {
        const newMessages = [...moreMessages, ...prevMessages];
        setScrollPosition(currentScrollPosition || 0);
        return newMessages;
      });

      setLoading(false);
      setShowLoading(false);
    }, 200);
  }, [messages, loading]);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollTo({ top: scrollPosition });
    }
  }, [scrollPosition]);

  return (
    <Flex flexDir="column" height="100%">
      <Box style={{ overflow: "hidden" }} height="100%">
        {/* Virtuoso List Component */}
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          firstItemIndex={Math.max(messages[0]?.id ?? 0, 0)}
          initialTopMostItemIndex={messages.length - 1}
          startReached={loadMore}
          itemContent={(index, message: MessageType) => {
            return (
              <div key={message.id} style={{ padding: 10, textAlign: message.from === "me" ? "right" : "left" }}>
                <Box
                  display={"inline-block"}
                  background={message.from === "me" ? useColorModeValue("gray.200", "gray.800") : useColorModeValue("green.200", "green.600")}
                  borderRadius={10}
                  maxW="60%"
                  wordWrap="break-word"
                  padding="2"
                >
                  {message.message}
                </Box>
              </div>
            );
          }}
        />

        {/* Loading Text */}
        {showLoading && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span>Loading...</span>
          </div>
        )}
      </Box>
      <Textarea autoresize />
    </Flex>
  );
};

export default Chat;
