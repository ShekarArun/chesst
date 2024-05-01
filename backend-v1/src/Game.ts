import { WebSocket } from "ws";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: String;
    private moves: String[];
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = "";
        this.moves = [];
        this.startTime = new Date();
    }

    makeMove(socket: WebSocket, move: String) {
        // Validate:
        // 1. Is it this user's turn?
        // 2. Is the move valid?


        // Update board
        // Push move

        // Check if game over
        // Send updated board to both players
    }
}