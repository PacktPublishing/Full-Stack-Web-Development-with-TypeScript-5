import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import { navigate as navigateOriginal } from "svelte-routing";
import axios from "axios";
import ChatListSideBar from "./ChatListSideBar.svelte";
vi.mock("axios");
vi.mock("svelte-routing", () => ({
  navigate: vi.fn(),
}));

const navigate = vi.mocked(navigateOriginal, true);
const axiosGet = vi.mocked(axios, true).get;
describe("ChatListSideBar", () => {
  const mockChats = {
    data: {
      data: [
        { id: "chat1", name: "Chat 1" },
        { id: "chat2", name: "Chat 2" },
      ],
    },
  };

  beforeEach(() => {
    axiosGet.mockClear();
    navigate.mockClear();
  });

  it("displays an error message when chats fail to load", async () => {
    axiosGet.mockRejectedValue(new Error("Failed to fetch chats"));
    const { findByText } = render(ChatListSideBar);

    await waitFor(
      async () => {
        const errorMessage = await findByText(
          "Failed to fetch chats. Please try again later.",
        );
        expect(errorMessage).toBeInTheDocument();
      },
      {
        timeout: 100, // Wait up to 2 seconds before failing the test
      },
    );
  });

  it("displays no chats message when there are no chats", async () => {
    axiosGet.mockResolvedValue({ data: { data: [] } });
    const { findByText } = render(ChatListSideBar);
    expect(
      await findByText("No chats available. Create a new one!"),
    ).toBeInTheDocument();
  });

  it("displays chats when data is loaded", async () => {
    axiosGet.mockResolvedValue(mockChats);
    const { findByText } = render(ChatListSideBar);
    expect(await findByText("Chat 1")).toBeInTheDocument();
    expect(await findByText("Chat 2")).toBeInTheDocument();
  });

  it("navigates to the chat when a chat item is clicked", async () => {
    axiosGet.mockResolvedValue(mockChats);
    const { findByText } = render(ChatListSideBar);
    const firstChatItem = await findByText("Chat 1");
    expect(firstChatItem).toBeInTheDocument();
    await fireEvent.click(firstChatItem);
    expect(navigate).toHaveBeenCalledWith("/chat1");
  });

  it("shows create chat popup when new chat button is clicked", async () => {
    axiosGet.mockResolvedValue({ data: { data: [] } });
    const { getByText, findByText } = render(ChatListSideBar);
    await fireEvent.click(getByText("New Chat"));
    expect(await findByText("Create")).toBeInTheDocument(); // Assuming popup text
  });
});
