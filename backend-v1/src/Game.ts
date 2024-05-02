import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // TODO: Validate type of 'move' using zod

        // Is it this user's turn?
        if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
            return;
            // TODO: Raise 'not your turn' error
        }
        if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
            return;
            // TODO: Raise 'not your turn' error
        }

        try {
            this.board.move(move) // Handles move validation and updates the board if valid
        } catch (e) {
            console.error('Error making this move!', e)
            throw e
        }

        // Check if game over
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
        }
        // Send updated board to both players
    }
}