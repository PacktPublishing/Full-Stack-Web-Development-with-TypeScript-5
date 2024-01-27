interface IChat {
    id: number;
    ownerId: number;
    messages: IMessage[];
}

interface IMessage {
    id: number;
    chatId: number;
    userId: number;
    content: string;
    feedback?: string;
    createdAt: Date;
}

interface IUser {
    id: number;
    name: string;
    email: string;
}

interface IDatabaseResource<T> {
    get(id: number): Promise<T | null>;

    getAll(): Promise<T[]>;
}

class ChatResource implements IDatabaseResource<IChat> {
    async get(id: number): Promise<IChat | null> {
        return null;
    }

    async getAll(): Promise<IChat[]> {
        return [];
    }
}

class UserResource implements IDatabaseResource<IUser> {

    async get(id: number): Promise<IUser | null> {
        return null;
    }

    async getAll(): Promise<IUser[]> {
        return [];
    }

    async getIdFromToken(id: string): Promise<number | null> {
        return 0;
    }
}

class AuthenticationService {
    async isAuthenticated(token: string): Promise<boolean> {
        return true;
    }
}

class ChatService {
    private chatResource: ChatResource = new ChatResource();
    private userResource: UserResource = new UserResource();
    private authService: AuthenticationService = new AuthenticationService();


    async getChatMessages(chatId: number, token: string): Promise<IMessage[] | null> {
        if (!await this.authService.isAuthenticated(token)) {
            throw new Error('User not authenticated');
        }

        const userId = await this.userResource.getIdFromToken(token);
        const user = await this.userResource.get(userId!);
        const chat = await this.chatResource.get(chatId);

        if (!chat || chat.ownerId !== user?.id) {
            throw new Error('Chat not found or access denied');
        }

        return chat.messages;
    }
}


const chatService = new ChatService();

async function getChatMessages(chatId: number, token: string) {
    try {
        const messages = await chatService.getChatMessages(chatId, token);
        return {success: true, messages};
    } catch (error) {
        return {success: false, message: 'Internal server error'}
    }
}

function narrowToNumber(value: unknown): number {
    if (typeof value !== 'number') {
        throw new Error('Value is not a number');
    }
    return value;
}

async function getChatMessagesWithNarrowing(chatId: unknown, req: { authorization: string }) {
    const authToken = req.authorization;
    const numberChatId = narrowToNumber(chatId);
    const messages = await chatService.getChatMessages(numberChatId, authToken);

    if (messages !== null) {
        messages.map((message) => {
            console.log(`Message ID: ${message.id}, Feedback: ${message.feedback?.trim() ?? "no feedback"}`);
        });
        return {success: true, messages}
    } else {
        return {success: false, message: 'Chat not found or access denied'}
    }
}


function getChatMessage(): IMessage | null {
    return null
}

const message = getChatMessage()
if (message !== null) {
    console.log(message.chatId)
}

console.log(`Message ID: ${message?.id}, Feedback: ${message?.feedback?.trim() ?? "no feedback"}`);

type NarrowFunction = (value: any) => number;


type MapCallback = (message: IMessage) => void;
const logMessage: MapCallback = (message) => {
    console.log(`Message ID: ${message.id}`);
};
// messages.map((message: IMessage) => {
//     logMessage(message);
// });


interface IUser {
    id: number;
    name: string;
    email: string;
}

type UserPreview = Pick<IUser, 'id' | 'name'>;
type UserNamesById = Record<number, string>;
type PartialIUser = Partial<IUser>;
type RequiredIUser = Required<PartialIUser>;
type UserWithoutEmail = Omit<IUser, 'email'>;
type ReadonlyIUser = Readonly<IUser>;


const userPreview: UserPreview = {id: 1, name: 'John'};
const userNamesById: UserNamesById = {1: 'John', 2: 'Alice'};
const userWithoutEmail: UserWithoutEmail = {id: 2, name: 'Alice'};
const user: ReadonlyIUser = {id: 1, name: 'John', email: 'john@example.com'};
// user.name = 'Alice';
const partialUser: PartialIUser = {id: 1};
const requiredUser: RequiredIUser = {id: 1, name: 'John', email: 'john@example.com'};

// union types

type MessageType = "user" | "system"

interface IMessageWithType {
    type: MessageType;
    // other properties
}

type DbChatSuccessResponse = {
    success: true;
    data: IChat;
};

type DbChatErrorResponse = {
    success: false;
    error: string;
};

function getChatFromDb(chatId: string): DbChatSuccessResponse | DbChatErrorResponse {
    const chat = {} as IChat;
    if (chat) {
        return {
            success: true,
            data: chat,
        };
    } else {
        return {
            success: false,
            error: "Chat not found in the database",
        };
    }
}

// Handling the response:
const dbResponse = getChatFromDb("chat123");
if (dbResponse.success === true) {
    console.log("Chat data:", dbResponse.data);
} else {
    console.error("Error:", dbResponse.error);
}

// type intersections
type IDBEntityWithId = {
    id: number;
};

type IChatEntity = {
    name: string;
};

type IChatEntityWithId = IDBEntityWithId & IChatEntity;

const chatEntity: IChatEntityWithId = {
    id: 1,
    name: "Typescript tuitor",
};

// exntensible interfaces
interface IMessageWithType extends IMessage {
    type: MessageType;
}

const userMessage: IMessageWithType = {
    id: 10,
    chatId: 2,
    userId: 1,
    content: "Hello, world!",
    createdAt: new Date(),
    type: "user",
};

// OOP
abstract class AbstractDatabaseResource {

    constructor(protected resourceName: string) {
    }

    protected logResource(resource: { id: number }): void {
        console.log(`[${this.resourceName}] Resource logged:`, resource);
    }

    abstract get(id: number): { id: number } | null

    abstract getAll(): { id: number }[]

    abstract addResource(resource: { id: number }): void;
}

class InMemoryChatResource extends AbstractDatabaseResource {
    private resources: IChat[] = [];

    constructor() {
        super("chat");
    }

    get(id: number): IChat | null {
        const resource = this.resources.find((item) => item.id === id);
        return resource ? {...resource} : null;
    }

    getAll(): IChat[] {
        return [...this.resources];
    }

    addResource(resource: IChat): void {
        this.resources.push(resource);
        this.logResource(resource);
    }
}

class SqlChatResource extends AbstractDatabaseResource {

    constructor() {
        super("chat");
        // Initialize SQL connection and setup here
    }

    addResource(resource: IChat): void {
        // SQL-specific logic to add a resource
        this.logResource(resource)
    }

    get(id: number): IChat | null {
        // SQL-specific logic to select a chat
        return null
    }

    getAll(): IChat[] {
        // SQL-specific logic to select all chats
        return []
    }

}

const inMemoryChatResource = new InMemoryChatResource();
const sqlChatResource = new SqlChatResource();

const chat1: IChat = {
    id: 1,
    ownerId: 2,
    messages: []
};

const chat2: IChat = {
    id: 2,
    ownerId: 1,
    messages: []
};

inMemoryChatResource.addResource(chat1);
sqlChatResource.addResource(chat2);

const retrievedChat1 = inMemoryChatResource.get(1);
if (retrievedChat1) {
    console.log("Retrieved Chat from In-Memory Resource:", retrievedChat1);
} else {
    console.log("Chat not found in In-Memory Resource");
}

const retrievedChat2 = sqlChatResource.get(2);
if (retrievedChat2) {
    console.log("Retrieved Chat from SQL Resource:", retrievedChat2);
} else {
    console.log("Chat not found in SQL Resource");
}

// generics

function printValue<T>(value: T): void {
    console.log(value);
}

printValue<number>(123);
printValue<string>("Hello");

class GenericsInMemoryResource<T extends { id: number }> extends AbstractDatabaseResource {
    private resources: T[] = [];

    constructor(resourceName: string) {
        super(resourceName);
    }

    get(id: number): T | null {
        const resource = this.resources.find((item) => item.id === id);
        return resource ? {...resource} : null;
    }

    getAll(): T[] {
        return [...this.resources];
    }

    addResource(resource: T): void {
        this.resources.push(resource);
        this.logResource(resource);
    }
}

const userInMemoryResource = new GenericsInMemoryResource<IUser>('user')
const chatInMemoryResource = new GenericsInMemoryResource<IChat>('chat')

userInMemoryResource.addResource({id: 1, name: 'Admin', email: 'admin@admin.com'});
chatInMemoryResource.addResource({id: 10, ownerId: userInMemoryResource.get(1)!.id, messages: []});

function fetchData(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Data Fetched"), 1000);
    });
}