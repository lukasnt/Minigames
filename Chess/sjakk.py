import time

COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"]
ROWS = [1, 2, 3, 4, 5, 6, 7, 8]
BOARD_SIZE = 8

EMPTY_PIECE = " "
WHITE_START_POSITION = ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"]
BLACK_START_POSITION = ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"]
PIECE_IMAGES = {"BP": "♙", "BB": "♗", "BN": "♘", "BR": "♖", "BQ": "♕", "BK": "♔",
                "WP": "♟", "WB": "♝", "WN": "♞", "WR": "♜", "WQ": "♛", "WK": "♚"}



def emptyBoard():
    return [[EMPTY_PIECE for i in range(BOARD_SIZE)] for i in range(BOARD_SIZE)]


def initChessBoard():
    board = emptyBoard()
    board[0] = BLACK_START_POSITION
    board[1] = ["BP" for i in range(BOARD_SIZE)]
    board[BOARD_SIZE - 1] = WHITE_START_POSITION
    board[BOARD_SIZE - 2] = ["WP" for i in range(BOARD_SIZE)]
    return board


def printColumn():
    print(" " * 4, end="")
    for column in COLUMNS:
        print(column, end=" " * 4)
    print()


def printBoard(board):
    printColumn()
    for i in range(len(board)):
        print(BOARD_SIZE - i, end=" | ")
        row = board[i]
        for piece in row:
            try:
                print(PIECE_IMAGES[piece] + " ", end=" | ")
            except KeyError:
                print(EMPTY_PIECE * 2, end=" | ")
        print(BOARD_SIZE - i)
        print("  " + "-" * 5 * BOARD_SIZE)
    printColumn()


def getPiece(position, board):
    try:
        column = COLUMNS.index(position[0])
        row = BOARD_SIZE - (ROWS.index(int(position[1])) + 1)
    except ValueError:
        return None

    return board[row][column]


def setPiece(position, piece, board):
    try:
        column = COLUMNS.index(position[0])
        row = BOARD_SIZE - (ROWS.index(int(position[1])) + 1)
    except ValueError:
        return

    board[row][column] = piece


def addToPosition(position, vector):
    column = ord(position[0])
    row = int(position[1])
    pos = chr(column + vector[0]) + str(row + vector[1])
    return pos


def coordToPos(x, y):
    column = chr(ord("A") + x - 1)
    row = str(y)
    pos = column + row
    return pos


def oppositeTeam(team):
    if team == "W":
        return "B"
    elif team == "B":
        return "W"
    else:
        return team


def pawnMove(fromPos, toPos, team, board):
    column = ord(fromPos[0])
    toColumn = ord(toPos[0])
    row = int(fromPos[1])
    toRow = int(toPos[1])
    if team == "W":
        if getPiece(addToPosition(fromPos, (0, 1)), board) == EMPTY_PIECE:
            if (column == toColumn) and (getPiece(toPos, board) == EMPTY_PIECE):
                if toRow == row + 1:
                    return True
                elif toRow == row + 2 and (row == 2):
                    return True
        if (toRow == row + 1) and (toColumn == column - 1 or toColumn == column + 1):
            if getPiece(toPos, board)[0] == "B":
                return True
    
    if team == "B":
        if getPiece(addToPosition(fromPos, (0, -1)), board) == EMPTY_PIECE:
            if (column == toColumn) and (getPiece(toPos, board) == EMPTY_PIECE):
                if toRow == row - 1:
                    return True
                elif toRow == row - 2 and (row == 7):
                    return True
        if (toRow == row - 1) and (toColumn == column - 1 or toColumn == column + 1):
            if getPiece(toPos, board)[0] == "W":
                return True
    
    return False


def bishopMove(fromPos, toPos, team, board):
    diagonals = [(1, 1), (1, -1), (-1, 1), (-1, -1)]
    for diagonal in diagonals:
        xDir = diagonal[0]
        yDir = diagonal[1]

        pos = fromPos
        for i in range(1, BOARD_SIZE):
            pos = addToPosition(pos, (xDir, yDir))
            piece = getPiece(pos, board)

            if piece == None:
                break
            elif (piece != EMPTY_PIECE) and (pos != toPos):
                break
            elif (pos == toPos) and (piece[0] != team):
                return True


def knightMove(fromPos, toPos, team, board):
    moves = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (-1, 2), (1, -2), (-1, -2)]
    for move in moves:
        pos = fromPos
        pos = addToPosition(pos, move)
        piece = getPiece(pos, board)
        if (pos == toPos) and (piece[0] != team):
            return True
    return False


def rookMove(fromPos, toPos, team, board):
    directions = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    for direction in directions:
        xDir = direction[0]
        yDir = direction[1]

        pos = fromPos
        for i in range(1, BOARD_SIZE):
            pos = addToPosition(pos, (xDir, yDir))
            piece = getPiece(pos, board)

            if piece == None:
                break
            elif (piece != EMPTY_PIECE) and (pos != toPos):
                break
            elif (pos == toPos) and (piece[0] != team):
                return True


def queenMove(fromPos, toPos, team, board):
    return bishopMove(fromPos, toPos, team, board) or rookMove(fromPos, toPos, team, board)


def kingMove(fromPos, toPos, team, board):
    moves = [(1, 0), (0, 1), (-1, 0), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
    for move in moves:
        pos = fromPos
        pos = addToPosition(pos, move)
        piece = getPiece(pos, board)
        if (pos == toPos) and (piece[0] != team):
            return True
    return False
        

def legalMove(piece, fromPos, toPos, board):
    team = piece[0]
    legal = False

    if piece[1] == "P":
        legal = pawnMove(fromPos, toPos, team, board)
    elif piece[1] == "B":
        legal = bishopMove(fromPos, toPos, team, board)
    elif piece[1] == "N":
        legal = knightMove(fromPos, toPos, team, board)
    elif piece[1] == "R":
        legal = rookMove(fromPos, toPos, team, board)
    elif piece[1] == "Q":
        legal = queenMove(fromPos, toPos, team, board)
    elif piece[1] == "K":
        legal = kingMove(fromPos, toPos, team, board)   

    return legal


def copyBoard(board):
    new_board = emptyBoard()
    for i in range(len(new_board)):
        row = new_board[i]
        for j in range(len(row)):
            new_board[i][j] = board[i][j]
    return new_board


def getTeamPieces(team, board):
    pos = "A1"
    pieceList = []
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            piece = getPiece(pos, board)
            if piece[0] == team:
                pieceList.append((piece, pos))
            pos = addToPosition(pos, (1, 0))
        pos = addToPosition(pos, (-BOARD_SIZE, 1))
    return pieceList


def getKingPos(team, board):
    teamPieces = getTeamPieces(team, board)
    for item in teamPieces:
        if item[0] == str(team) + "K":
            return item[1]


def inCheck(team, board):
    kingPos = getKingPos(team, board)
    oppositeTeamPieces = getTeamPieces(oppositeTeam(team), board)
    for item in oppositeTeamPieces:
        piece = item[0]
        pos = item[1]
        if legalMove(piece, pos, kingPos, board):
            return True
    return False


def inCheckmate(team, board):
    before = time.perf_counter()
    
    teamPieces = getTeamPieces(team, board)
    for item in teamPieces:
        piece = item[0]
        pos = item[1]
        
        for y in range(1, BOARD_SIZE + 1):
            for x in range(1, BOARD_SIZE + 1):
                toPos = coordToPos(x, y)
                new_board = copyBoard(board)
                setPiece(toPos, piece, new_board)
                setPiece(pos, EMPTY_PIECE, new_board)
                if legalMove(piece, pos, toPos, board) and not inCheck(team, new_board):
                    return False

    print("it took", time.perf_counter() - before, "amount of time")

    return True


def pawnEnd(pos, board):
    if getPiece(pos, board) == EMPTY_PIECE:
        return False
    if getPiece(pos, board)[1] == "P":
        for i in range(1, BOARD_SIZE + 1):
            if (pos == coordToPos(i, 8)) or (pos == coordToPos(i, 1)):
                return True


def validFormat(inputString):
    inputString = inputString.strip()
    if len(inputString) != 5:
        return False
    elif (inputString[0].upper() not in COLUMNS) or (inputString[3].upper() not in COLUMNS):
        return False
    elif (int(inputString[1]) not in ROWS) or (int(inputString[4]) not in ROWS):
        return False
    return True


def chessMove(move, turn, board):
    if validFormat(move) != True:
            print("The move is not in a valid format.")
            return False
   
    # eksempel på move: "e4-e5"
    move = move.upper().split("-")
    piece = getPiece(move[0], board)

    if piece[0] != turn:
        print("That is not your piece")
        return False

    if legalMove(piece, move[0], move[1], board) != True:
        print("That is not a legal move")
        return False

    copy_board = copyBoard(board)
    setPiece(move[1], piece, copy_board)
    setPiece(move[0], EMPTY_PIECE, copy_board)
    if inCheck(turn, copy_board):
        print("That is not a legal move. You'll be in check")
        return False

    setPiece(move[1], piece, board)
    setPiece(move[0], EMPTY_PIECE, board)
    if pawnEnd(move[1], board):
        new_piece = input("What piece do you want (Q, R, N, B): ")
        setPiece(move[1], turn + new_piece, board)

    return True


def main():
    board = initChessBoard()
    printBoard(board)

    playing = True
    currentTurn = "W"
    move = input("It is " + currentTurn + " turn: ")
    while playing:
        if move == "quit": 
            playing = False
            break

        print(move)
        legal = chessMove(move, currentTurn, board)
        if legal != True:
            move = input("Try again: ")
            continue
        if inCheck(oppositeTeam(currentTurn), board):
            print(oppositeTeam(currentTurn), "in CHECK!")
            if inCheckmate(oppositeTeam(currentTurn), board):
                print("CHECKMATE:", currentTurn, "won!")
                printBoard(board)
                break
        printBoard(board)
        currentTurn = oppositeTeam(currentTurn)
        move = input("It is " + currentTurn + " turn: ")


main()