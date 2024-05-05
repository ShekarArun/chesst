import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
        console.log('Added user to game')
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket)
        console.log('Removed user from game')
        // TODO: Stop game as user has left
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            // TODO: Validate data format using zod
            const message = JSON.parse(data.toString())
            console.log('Message: ', message)
            if (message.type === INIT_GAME) {
                console.info('Identified message to initialize game')
                if (this.pendingUser) {
                    // Start game
                    console.info('Starting game')
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket
                    console.info('Waiting for next user')
                }
            } else if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            } else {
                console.log(`Unknown message type ${message.type}`)
            }
        })
    }
}