let messageText: string = "my first chat message"
// messageText = 5 , this provides an error
const numbers: Array<number> = [1, 2]
const bigNumbers: number[] = [300, 400]

interface Chat {
    name: string;
    model: string;
}

const foodChat: Chat = {name: 'food recipes exploration', model: 'gpt-4'};
const typescriptChat: Chat = {name: 'typescript teacher', model: 'gpt-3.5-turbo'};

function displayChat(chat: Chat) {
    console.log(`Chat: ${chat.name}, Model: ${chat.model}`);
}
