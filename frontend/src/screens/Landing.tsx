export const Landing = () => {
    return (
        <div>
            <div className="mt-2">
                <div className="grid grid-cols-1 gap-4
                md:grid-cols-2">
                    <div>
                        <img src={"/chessboard.jpeg"} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Play Chess online on our site!</h1>
                        <div className="mt-4">
                            <button className="bg-blue-500
                            hover:bg-blue-700 text-white
                            font-bold py-2 px-4 rounded">
                                Play Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}