import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

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
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }))
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // TODO: Validate type of 'move' using zod

        // Is it this user's turn?
        if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
            console.error('Not your turn yet');
            return;
            // TODO: Raise 'not your turn' error
        }
        if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
            console.error('Not your turn yet');
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
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
            return;
        }
        // Send updated board to both players
        if (this.board.moves.length % 2 === 0) {
            this.player2.emit(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.emit(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
    }
}